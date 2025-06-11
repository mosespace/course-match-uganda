const fs = require('fs');

console.log('🚀 Starting course extraction script...');
const startTime = process.hrtime.bigint(); // High-resolution time for performance

// --- Configuration ---
const INPUT_FILE = 'data.js';
const OUTPUT_FILE = 'courses.json';
const LOG_SNIPPET_LENGTH = 300; // How many characters of the problematic snippet to log
// -------------------

// --- Regex Definitions ---
// This regex targets the overall block structure, capturing the inner content.
// We are still using `(?:\d*)` to optionally match and discard the trailing numbers.
const blockRegex = /\[\[\d+,\s*\[(.*?)\]\]\](?:\d*)/gs;
// -----------------------

// --- Main Script Logic ---
let rawData;
try {
  console.log(`📄 Reading raw data from ${INPUT_FILE}...`);
  const readFileStartTime = process.hrtime.bigint();
  rawData = fs.readFileSync(INPUT_FILE, 'utf-8');
  const readFileEndTime = process.hrtime.bigint();
  const readFileDurationMs =
    Number(readFileEndTime - readFileStartTime) / 1_000_000;
  console.log(
    `✅ Data read in ${readFileDurationMs.toFixed(2)} ms. File size: ${rawData.length} characters.`,
  );
} catch (error) {
  console.error(`❌ Error reading file ${INPUT_FILE}:`, error.message);
  process.exit(1);
}

const output = [];
let totalBlocksProcessed = 0;
let skippedEmptyBlocks = 0;
let skippedNonDocumentChanges = 0;
let skippedMissingFields = 0;
let skippedNonCourseDocuments = 0;
let skippedMalformedJsonBlocks = 0;
let coursesFound = 0;

console.log(
  '🔍 Starting block processing (this might take a while for large files)...',
);
let blockMatch;
while ((blockMatch = blockRegex.exec(rawData)) !== null) {
  totalBlocksProcessed++;
  const blockIndex = blockMatch.index; // Position of the current block in the file
  const blockContent = blockMatch[0]; // The full matched block, including [[...]] and trailing number

  if (totalBlocksProcessed % 100 === 0) {
    console.log(
      `📈 Processed ${totalBlocksProcessed} blocks. Found ${coursesFound} courses so far.`,
    );
  }

  try {
    const innerContent = blockMatch[1]; // Get the content inside the innermost []

    if (!innerContent.trim()) {
      skippedEmptyBlocks++;
      continue;
    }

    // Attempt to parse the innerContent as a single JSON array.
    // This is the most efficient if the innerContent is perfectly '{obj1},{obj2}'
    // and can be turned into '[{obj1},{obj2}]'.
    let items;
    try {
      items = JSON.parse(`[${innerContent}]`);
    } catch (jsonArrayParseError) {
      // If direct parsing as array fails, it means innerContent is malformed.
      // We'll try to find individual objects within it using a different, safer method.
      // This is the fallback for problematic blocks.
      skippedMalformedJsonBlocks++;
      console.warn(
        `⚠️ Attempting fallback parsing for malformed innerContent (Block Index: ${blockIndex}): ${jsonArrayParseError.message}. Snippet: ${innerContent.substring(0, LOG_SNIPPET_LENGTH)}...`,
      );

      items = [];
      // This more robust (but potentially slower) approach finds balanced curly braces.
      // It iterates through the string, keeping track of curly brace depth.
      let braceDepth = 0;
      let currentObjectStart = -1;

      for (let i = 0; i < innerContent.length; i++) {
        const char = innerContent[i];

        if (char === '{') {
          if (braceDepth === 0) {
            currentObjectStart = i; // Mark the start of a new top-level object
          }
          braceDepth++;
        } else if (char === '}') {
          braceDepth--;
          if (braceDepth === 0 && currentObjectStart !== -1) {
            // Found a complete top-level JSON object
            const jsonString = innerContent.substring(
              currentObjectStart,
              i + 1,
            );
            try {
              items.push(JSON.parse(jsonString));
            } catch (singleObjectParseError) {
              skippedMalformedJsonBlocks++;
              console.error(
                `❌ Failed to parse individual JSON object (Block Index: ${blockIndex}, Char Pos: ${currentObjectStart}): ${singleObjectParseError.message}. Snippet: ${jsonString.substring(0, LOG_SNIPPET_LENGTH)}...`,
              );
            }
            currentObjectStart = -1; // Reset for the next object
          }
        }
      }
    }

    // Now process the extracted items (whether from direct parse or fallback)
    for (const item of items) {
      // Check if it's a documentChange (we only care about these for courses)
      if (item && typeof item === 'object' && item.documentChange) {
        const doc = item.documentChange.document;
        const fields = doc?.fields;

        if (!fields) {
          skippedMissingFields++;
          // console.debug(`DEBUG: Skipped documentChange with missing fields (Block Index: ${blockIndex}).`);
          continue;
        }

        // Check if this document is actually a 'course'
        if (fields.university?.mapValue?.fields?.name?.stringValue) {
          const name = fields.name?.stringValue || '';

          const course = {
            name,
            university:
              fields.university?.mapValue?.fields?.name?.stringValue || '',
            type: fields.university?.mapValue?.fields?.type?.stringValue || '',
            duration: parseInt(fields.duration?.integerValue || '0'),
            description: fields.description?.stringValue || '',
            required_subjects: extractArray(fields.required_subjects),
            other_requirements: extractArray(fields.other_requirements),
          };
          output.push(course);
          coursesFound++;
        } else {
          skippedNonCourseDocuments++;
          // console.debug(`DEBUG: Skipped non-course document (Block Index: ${blockIndex}). Document name: ${doc?.name || 'N/A'}`);
        }
      } else if (item && typeof item === 'object' && item.targetChange) {
        skippedNonDocumentChanges++;
        // console.debug(`DEBUG: Skipped targetChange block (Block Index: ${blockIndex}).`);
      } else {
        // If it's an object but neither documentChange nor targetChange
        console.warn(
          `⚠️ Skipped unknown top-level object type in block (Block Index: ${blockIndex}). Object Snippet: ${JSON.stringify(item || {}).substring(0, LOG_SNIPPET_LENGTH)}...`,
        );
      }
    }
  } catch (err) {
    // This catch is for errors in the overall block processing, not JSON parsing errors
    skippedMalformedJsonBlocks++;
    console.error(
      `❌ General Error processing block (Block Index: ${blockIndex}): ${err.message}. Full Block Snippet: ${blockContent.substring(0, LOG_SNIPPET_LENGTH)}...`,
    );
  }
} // End of outer blockRegex loop

function extractArray(field) {
  if (!field || !field.arrayValue) return [];
  const values = field.arrayValue.values || [];
  return values.map((v) => v.stringValue || '');
}

// --- Final Output and Summary ---
const endTime = process.hrtime.bigint();
const totalDurationMs = Number(endTime - startTime) / 1_000_000;

console.log('\n--- Extraction Summary ---');
console.log(`✅ Total Blocks Processed: ${totalBlocksProcessed}`);
console.log(`✅ Courses Extracted: ${output.length}`);
console.log(`--- Skipped Categories ---`);
console.log(`  - Empty Blocks: ${skippedEmptyBlocks}`);
console.log(
  `  - Non-DocumentChange Blocks (e.g., targetChange): ${skippedNonDocumentChanges}`,
);
console.log(
  `  - DocumentChange with Missing 'fields': ${skippedMissingFields}`,
);
console.log(
  `  - Documents Not Identified as Courses: ${skippedNonCourseDocuments}`,
);
console.log(`  - Malformed JSON/Parsing Errors: ${skippedMalformedJsonBlocks}`);
console.log(`--- End of Summary ---`);

try {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(
    `✨ Successfully wrote ${output.length} courses to ${OUTPUT_FILE}`,
  );
} catch (error) {
  console.error(`❌ Error writing output file ${OUTPUT_FILE}:`, error.message);
}

console.log(`🎉 Script finished in ${totalDurationMs.toFixed(2)} ms.`);
console.log('--------------------------');

const fs = require('fs');

console.log('🚀 Starting university extraction script...');
const startTime = process.hrtime.bigint(); // High-resolution time for performance

// --- Configuration ---
const INPUT_FILE = 'data.js'; // Assuming the same input file
const OUTPUT_FILE = 'universities.json';
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

// Using a Map to store unique universities by their name to avoid duplicates
const uniqueUniversities = new Map();

let totalBlocksProcessed = 0;
let skippedEmptyBlocks = 0;
let skippedNonDocumentChanges = 0;
let skippedMissingFields = 0;
let skippedNonUniversityDocuments = 0; // New counter
let skippedMalformedJsonBlocks = 0;
let universitiesFound = 0;

console.log('🔍 Starting block processing for universities...');
let blockMatch;
while ((blockMatch = blockRegex.exec(rawData)) !== null) {
  totalBlocksProcessed++;
  const blockIndex = blockMatch.index; // Position of the current block in the file
  const blockContent = blockMatch[0]; // The full matched block, including [[...]] and trailing number

  if (totalBlocksProcessed % 100 === 0) {
    console.log(
      `📈 Processed ${totalBlocksProcessed} blocks. Found ${universitiesFound} unique universities so far.`,
    );
  }

  try {
    const innerContent = blockMatch[1]; // Get the content inside the innermost []

    if (!innerContent.trim()) {
      skippedEmptyBlocks++;
      continue;
    }

    let items;
    try {
      items = JSON.parse(`[${innerContent}]`);
    } catch (jsonArrayParseError) {
      skippedMalformedJsonBlocks++;
      console.warn(
        `⚠️ Attempting fallback parsing for malformed innerContent (Block Index: ${blockIndex}): ${jsonArrayParseError.message}. Snippet: ${innerContent.substring(0, LOG_SNIPPET_LENGTH)}...`,
      );

      items = [];
      let braceDepth = 0;
      let currentObjectStart = -1;

      for (let i = 0; i < innerContent.length; i++) {
        const char = innerContent[i];

        if (char === '{') {
          if (braceDepth === 0) {
            currentObjectStart = i;
          }
          braceDepth++;
        } else if (char === '}') {
          braceDepth--;
          if (braceDepth === 0 && currentObjectStart !== -1) {
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
            currentObjectStart = -1;
          }
        }
      }
    }

    for (const item of items) {
      if (item && typeof item === 'object' && item.documentChange) {
        const doc = item.documentChange.document;
        const fields = doc?.fields;

        if (!fields) {
          skippedMissingFields++;
          continue;
        }

        // The key difference: we're looking for the 'university' mapValue
        const universityData = fields.university?.mapValue?.fields;

        if (universityData && universityData.name?.stringValue) {
          const name = universityData.name.stringValue;
          const website = universityData.website?.stringValue || '';
          const logo = universityData.logo?.stringValue || ''; // Assuming 'logo' field might exist
          const status = universityData.status?.stringValue || ''; // Assuming 'status' might exist
          const description = universityData.description?.stringValue || ''; // Assuming 'description' might exist for uni
          const type = universityData.type?.stringValue || ''; // Using 'type' as requested

          // Create a unique key for the university (e.g., lowercase name)
          const uniqueKey = name.toLowerCase();

          // Add to Map if not already present
          if (!uniqueUniversities.has(uniqueKey)) {
            uniqueUniversities.set(uniqueKey, {
              name,
              description, // Added description for university
              website,
              logo,
              status,
              type, // Using 'type' as 'status'
            });
            universitiesFound++;
          }
        } else {
          skippedNonUniversityDocuments++; // This applies to documents that are not relevant university data
        }
      } else if (item && typeof item === 'object' && item.targetChange) {
        skippedNonDocumentChanges++;
      } else {
        console.warn(
          `⚠️ Skipped unknown top-level object type in block (Block Index: ${blockIndex}). Object Snippet: ${JSON.stringify(item || {}).substring(0, LOG_SNIPPET_LENGTH)}...`,
        );
      }
    }
  } catch (err) {
    skippedMalformedJsonBlocks++;
    console.error(
      `❌ General Error processing block (Block Index: ${blockIndex}): ${err.message}. Full Block Snippet: ${blockContent.substring(0, LOG_SNIPPET_LENGTH)}...`,
    );
  }
} // End of outer blockRegex loop

// --- Final Output and Summary ---
const endTime = process.hrtime.bigint();
const totalDurationMs = Number(endTime - startTime) / 1_000_000;

// Convert Map values to an array for JSON output
const outputUniversities = Array.from(uniqueUniversities.values());

console.log('\n--- Extraction Summary ---');
console.log(`✅ Total Blocks Processed: ${totalBlocksProcessed}`);
console.log(`✅ Unique Universities Extracted: ${outputUniversities.length}`);
console.log(`--- Skipped Categories ---`);
console.log(`  - Empty Blocks: ${skippedEmptyBlocks}`);
console.log(
  `  - Non-DocumentChange Blocks (e.g., targetChange): ${skippedNonDocumentChanges}`,
);
console.log(
  `  - DocumentChange with Missing 'fields': ${skippedMissingFields}`,
);
console.log(
  `  - Documents Not Containing University Data: ${skippedNonUniversityDocuments}`,
);
console.log(`  - Malformed JSON/Parsing Errors: ${skippedMalformedJsonBlocks}`);
console.log(`--- End of Summary ---`);

try {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputUniversities, null, 2));
  console.log(
    `✨ Successfully wrote ${outputUniversities.length} unique universities to ${OUTPUT_FILE}`,
  );
} catch (error) {
  console.error(`❌ Error writing output file ${OUTPUT_FILE}:`, error.message);
}

console.log(`🎉 Script finished in ${totalDurationMs.toFixed(2)} ms.`);
console.log('--------------------------');

const fs = require('fs');

// Load raw data
const raw = fs.readFileSync('data.js', 'utf-8');

// Match Firestore-style blocks like [[n,[{...}]]]
const matches = raw.match(/\[\[\d+,\[(.*?)\]\]\]/gs);

if (!matches) {
  console.error('❌ No course blocks found');
  process.exit(1);
}

const output = [];

for (const match of matches) {
  try {
    // Extract inner content
    const inner = match.match(/\[\d+,\[(.*?)\]\]\]/s)[1];
    const json = `[${inner}]`;

    const items = JSON.parse(json);
    for (const item of items) {
      const doc = item?.documentChange?.document;
      const fields = doc?.fields;
      if (!fields) continue;

      const name = fields.name?.stringValue || '';
      if (!name.toLowerCase().includes('bachelor')) continue;

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
    }
  } catch (err) {
    console.warn('⚠️ Skipped malformed block:', err.message);
  }
}

function extractArray(field) {
  if (!field || !field.arrayValue) return [];
  const values = field.arrayValue.values || [];
  return values.map((v) => v.stringValue || '');
}

fs.writeFileSync('courses.json', JSON.stringify(output, null, 2));
console.log(`✅ Extracted ${output.length} courses to courses.json`);

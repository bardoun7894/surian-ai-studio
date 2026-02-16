const fs = require('fs');
const content = fs.readFileSync('/var/local/surian-ai-studio/frontend-next/src/contexts/LanguageContext.tsx', 'utf8');
const lines = content.split('\n');
const keys = {};
lines.forEach((line, index) => {
    const match = line.match(/^\s*'([^']+)'\s*:/);
    if (match) {
        const key = match[1];
        if (keys[key]) {
            console.log(`Duplicate key: ${key} at line ${index + 1} (previous at ${keys[key]})`);
        } else {
            keys[key] = index + 1;
        }
    }
});

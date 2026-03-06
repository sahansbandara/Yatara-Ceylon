const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src', 'models');
const files = fs.readdirSync(modelsDir);

let er = 'erDiagram\n';

for (let file of files) {
  if (!file.endsWith('.ts')) continue;
  const content = fs.readFileSync(path.join(modelsDir, file), 'utf8');
  let modelName = file.replace('.ts', '').toUpperCase();
  er += `    ${modelName} {\n`;
  
  // crude parsing
  const lines = content.split('\n');
  let inSchema = false;
  for (let line of lines) {
    if (line.includes('new mongoose.Schema')) inSchema = true;
    if (inSchema) {
      let match = line.match(/^\s*([a-zA-Z0-9_]+):\s*{?\s*type:\s*([a-zA-Z]+)/);
      if (!match) match = line.match(/^\s*([a-zA-Z0-9_]+):\s*([a-zA-Z]+)/);
      
      if (match && !match[1].startsWith('//')) {
        let prop = match[1];
        let type = match[2];
        if (type === 'String' || type === 'String,') type = 'string';
        if (type === 'Number' || type === 'Number,') type = 'number';
        if (type === 'Boolean' || type === 'Boolean,') type = 'boolean';
        if (type === 'Date' || type === 'Date,') type = 'date';
        if (type === 'mongoose' || type === 'Schema') type = 'ObjectId';
        er += `        ${type} ${prop}\n`;
      }
    }
  }
  er += `    }\n\n`;
}
console.log(er);

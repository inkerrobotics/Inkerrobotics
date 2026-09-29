import { removeBackground } from '@imgly/background-removal-node';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const files = ['Rahul', 'Amith', 'Anju'];
const dir = './public/images/About';

for (const name of files) {
  console.log(`Processing ${name}...`);
  const inputPath = join(dir, `${name}.png`);
  const outputPath = join(dir, `${name}.png`);
  const blob = new Blob([readFileSync(inputPath)], { type: 'image/png' });
  const result = await removeBackground(blob);
  const buffer = Buffer.from(await result.arrayBuffer());
  writeFileSync(outputPath, buffer);
  console.log(`✓ ${name} done`);
}
console.log('All done!');

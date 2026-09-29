import { removeBackground } from '@imgly/background-removal-node';
import { readFileSync, writeFileSync } from 'fs';

const IN  = './public/images/Robotics/Alton.png';
const OUT = './public/images/Robotics/Alton-cutout.png';

const blob = new Blob([readFileSync(IN)], { type: 'image/png' });
const result = await removeBackground(blob);
writeFileSync(OUT, Buffer.from(await result.arrayBuffer()));
console.log('written', OUT);

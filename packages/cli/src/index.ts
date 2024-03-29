// import { parse } from 'pg-proto-parser/compiler'
// import { writeFileSync } from 'fs';
// import { sync as mkdirp } from 'mkdirp';
// import { join, basename } from 'path';

export default async (argv) => {
  console.log(argv);
  if (!argv.inputFile || !argv.outputDir) {
    console.log('inputFile and outputDir required!');
    console.log(`
interweb --inputFile input.tsx --outputDir out
  `);
    process.exit(1);
  }

  // const input = fileToAst(argv.inputFile);
  // const result = parse(input, true);
  // const outCodePretty = prettyPrint(result.ast).code;
  // mkdirp(argv.outputDir);
  // writeFileSync(join(argv.outputDir, basename(argv.inputFile)), outCodePretty);
};
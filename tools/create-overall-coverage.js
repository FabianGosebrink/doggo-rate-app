// tools/create-overall-coverage.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const coverageLibsDir = path.join(__dirname, '..', 'coverage', 'libs');
const outputDir = path.join(__dirname, '..', 'coverage', 'combined');
const tempDir = path.join(__dirname, '..', 'coverage', '.nyc_temp');
// Report generation reads every *.json in this directory as a coverage map,
// so it must hold only the merged coverage-final.json — never outputDir,
// where a previous run's coverage-summary.json would get misread as one.
const mergedDir = path.join(__dirname, '..', 'coverage', '.nyc_merged');

// Find all coverage-final.json files recursively
function findCoverageFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'combined') {
      findCoverageFiles(fullPath, files);
    } else if (entry.name === 'coverage-final.json') {
      files.push(fullPath);
    }
  }
  return files;
}

// Create temp directory with all coverage files
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true });
}
fs.mkdirSync(tempDir, { recursive: true });

const coverageFiles = findCoverageFiles(coverageLibsDir);
console.log(`Found ${coverageFiles.length} coverage files\n`);

// Copy each coverage file to temp dir with unique name
coverageFiles.forEach((file, index) => {
  const destPath = path.join(tempDir, `coverage-${index}.json`);
  fs.copyFileSync(file, destPath);
});

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (fs.existsSync(mergedDir)) {
  fs.rmSync(mergedDir, { recursive: true });
}
fs.mkdirSync(mergedDir, { recursive: true });

try {
  // Merge and generate report
  execSync(`npx nyc merge "${tempDir}" "${mergedDir}/coverage-final.json"`, {
    stdio: 'inherit',
  });

  execSync(
    `npx nyc report --temp-dir="${mergedDir}" --reporter=html --reporter=text --reporter=json-summary --report-dir="${outputDir}"`,
    { stdio: 'inherit' },
  );

  console.log(
    `\n✅  Combined report generated at: coverage/combined/index.html`,
  );
} catch (error) {
  console.error('❌  Failed to generate combined coverage:', error.message);
  process.exit(1);
} finally {
  // Cleanup temp directories
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.rmSync(mergedDir, { recursive: true, force: true });
}

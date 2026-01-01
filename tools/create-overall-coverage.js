// tools/create-overall-coverage.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const coverageLibsDir = path.join(__dirname, '..', 'coverage', 'libs');
const outputDir = path.join(__dirname, '..', 'coverage', 'combined');
const tempDir = path.join(__dirname, '..', 'coverage', '.nyc_temp');

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

try {
  // Merge and generate report
  execSync(`npx nyc merge "${tempDir}" "${outputDir}/coverage-final.json"`, {
    stdio: 'inherit',
  });

  execSync(
    `npx nyc report --temp-dir="${outputDir}" --reporter=html --reporter=text --report-dir="${outputDir}"`,
    { stdio: 'inherit' },
  );

  console.log(
    `\n✅  Combined report generated at: coverage/combined/index.html`,
  );
} catch (error) {
  console.error('❌  Failed to generate combined coverage:', error.message);
  process.exit(1);
} finally {
  // Cleanup temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
}

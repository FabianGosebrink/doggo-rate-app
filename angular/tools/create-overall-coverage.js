const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const TEST_RESULTS_FOLDER = 'coverage';
const TEMP_FOLDER = 'coverage/.temp';
const COVERAGE_FOLDER = 'coverage/.complete';
const FINAL_JSON_COVERAGE_FILENAME = 'coverage-final.json';
const MERGED_COVERAGE_FILENAME = 'coverage-complete.json';

async function mergeCoverageFilesToJson() {
  clearTempFolder();

  const jsonFiles = findCoverageFiles(TEST_RESULTS_FOLDER);

  console.log(`Found ${jsonFiles.length} coverage JSON files.`);

  for (const filePath of jsonFiles) {
    const targetPath = getTargetPath(filePath);
    console.log(`Copying '${filePath}' to '${targetPath}'`);
    await fs.copy(filePath, targetPath);
  }

  const mergedCoveragePath = path.join(
    COVERAGE_FOLDER,
    MERGED_COVERAGE_FILENAME
  );

  executeCommand(`nyc merge ${TEMP_FOLDER} ${mergedCoveragePath}`);
}

function createIstanbulReportFromJson() {
  const command = `nyc report -t ${TEMP_FOLDER} --report-dir ${COVERAGE_FOLDER} --reporter=html --reporter=cobertura --reporter=lcov --reporter=text-summary`;

  executeCommand(command);

  console.log(`Executed '${command}' successfully.`);
}

function findCoverageFiles(dir, files = []) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const entryPath = path.join(dir, entry);

    if (fs.statSync(entryPath).isDirectory()) {
      findCoverageFiles(entryPath, files);
    } else if (path.basename(entryPath) === FINAL_JSON_COVERAGE_FILENAME) {
      files.push(entryPath);
    }
  }

  return files;
}

function getTargetPath(filePath) {
  const projectName = path.dirname(filePath).split(path.sep).slice(-2, -1)[0];
  const filename = `${projectName}-${path.basename(filePath)}`;

  return path.join(TEMP_FOLDER, filename);
}

function clearTempFolder() {
  fs.emptyDirSync(TEMP_FOLDER);
}

function executeCommand(command) {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing command: ${command}`, err);

      return;
    }
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }
  });
}

const main = async function () {
  await mergeCoverageFilesToJson();
  createIstanbulReportFromJson();
};

main();

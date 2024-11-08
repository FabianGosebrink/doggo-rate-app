const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const TEST_RESULTS_FOLDER = 'coverage';
const TEMP_FOLDER = 'coverage/.temp';
const COVERAGE_FOLDER = 'coverage/complete';
const JEST_GENERATED_FINAL_JSON_COVERAGE_FILENAME = 'coverage-final.json';
const COVERAGE_TARGET_FILENAME = 'coverage-complete.json';

async function mergeCoverageFilesToJson() {
  fs.emptyDirSync(TEMP_FOLDER);

  const allTestingJsonFiles = getFilesRecursively(TEST_RESULTS_FOLDER);
  console.log(`Found ${allTestingJsonFiles.length} testing json files.`);

  for (const testingJsonPath of allTestingJsonFiles) {
    const filename = path.basename(testingJsonPath);
    const folders = testingJsonPath.split('/');
    const folderDepth = folders.length;
    const projectNameFolderIndex = folderDepth - 2;
    const projectName = folders[projectNameFolderIndex];
    const fileNameWithProject = projectName
      ? `${projectName}-${filename}`
      : filename;
    const targetPath = path.join(TEMP_FOLDER, fileNameWithProject);

    console.log(`Moving '${testingJsonPath}' to '${targetPath}'`);

    await fs.copy(testingJsonPath, targetPath);
  }

  const targetPath = path.join(COVERAGE_FOLDER, COVERAGE_TARGET_FILENAME);
  const command = `nyc merge ${TEMP_FOLDER} ${targetPath}`;

  executeCommand(command);
}

function createIstanbulReportFromJson() {
  const command = `nyc report -t ${TEMP_FOLDER} --report-dir ${COVERAGE_FOLDER} --reporter=html --reporter=cobertura --reporter=lcov --reporter=text-summary`;

  executeCommand(command);

  console.log(`Executed '${command}' successfully.`);
}

function getFilesRecursively(dir, files = []) {
  const fileList = fs.readdirSync(dir);

  for (const file of fileList) {
    const name = `${dir}/${file}`;

    if (fs.statSync(name).isDirectory()) {
      getFilesRecursively(name, files);
    } else {
      const filename = path.basename(name);
      const isMatchingJestFile =
        filename === JEST_GENERATED_FINAL_JSON_COVERAGE_FILENAME;

      if (isMatchingJestFile) {
        files.push(name);
      }
    }
  }

  return files;
}

function executeCommand(command) {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stdout);
    console.error(stderr);
  });
}

await mergeCoverageFilesToJson();

createIstanbulReportFromJson();

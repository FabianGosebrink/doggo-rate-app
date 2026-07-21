const shell = require('shelljs');

const BASE_HREF = './';
const OUTPUT_TEMP_PATH = '.temp/desktop';
const OUTPUT_DIST_PATH = 'dist/desktop';
const ICON_PATH = 'assets/desktop/icon';
const DESKTOP_ASSETS = 'assets/desktop/*';
// Package against the Electron version we develop with instead of a
// hardcoded one that silently drifts on every dependency update.
const ELECTRON_VERSION = require('electron/package.json').version;

shell.echo('Start building desktop');

// DELETE TEMP FOLDER
shell.rm('-rf', `${OUTPUT_TEMP_PATH}`);
shell.rm('-rf', `${OUTPUT_DIST_PATH}`);
shell.echo('Deleted temp and dist folders...');

// BUILD ANGULAR
console.log('build angular');
const angularBuildCommand = `npm run build-temp -- --base-href=${BASE_HREF} --output-path=${OUTPUT_TEMP_PATH}`;
shell.exec(angularBuildCommand);

// COPY ASSETS
console.log('copy desktop assets');
shell.cp('-r', `${DESKTOP_ASSETS}`, `${OUTPUT_TEMP_PATH}`);

// BUILD DESKTOP
console.log('build desktop');
shell.exec(
  `npx @electron/packager ${OUTPUT_TEMP_PATH} --electronVersion=${ELECTRON_VERSION} --overwrite --icon=${ICON_PATH} --platform=win32,linux --out=${OUTPUT_DIST_PATH}`,
);

console.log('DONE');

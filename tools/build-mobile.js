const shell = require('shelljs');

shell.echo('Start building mobile');

// npx cap add android

console.log('build angular');
const angularBuildCommand = `npm run build`;
shell.exec(angularBuildCommand);

console.log('adding splashscreen');
const splashscreencommand = `npx capacitor-assets generate --android --assetPath assets/img`;
shell.exec(splashscreencommand);

console.log('Syncing app with capacitor');
const syncCommand = `npx cap sync android`;
shell.exec(syncCommand);

// console.log('Starting app with android');
// const startCommand = `npx cap run android -- --verbose --sdk-info --stacktrace`;
// shell.exec(startCommand);

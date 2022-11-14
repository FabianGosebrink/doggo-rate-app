const shell = require("shelljs");

const IMG_ASSETS = "assets/img";

shell.echo("Start building mobile");

console.log("build angular");
const angularBuildCommand = `ng build`;
shell.exec(angularBuildCommand);

console.log("adding splashscreen");
const splashscreencommand = `npx capacitor-assets generate --android --assetPath assets/img`;
shell.exec(splashscreencommand);

console.log("Syncing app with capacitor");
const syncCommand = `npx cap sync android`;
shell.exec(syncCommand);

// console.log("Starting app with android");
// const startCommand = `npx cap run android -- --verbose --sdk-info --stacktrace`;
// shell.exec(startCommand);

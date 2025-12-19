const { execSync } = require('child_process');

/**
 * Hardcoded list of libraries to recreate in the workspace.
 */
const libraries = [
  {
    name: 'about-feature',
    directory: 'libs/about/feature',
    importPath: '@dog-rating/about/feature',
  },
  {
    name: 'dogs-domain',
    directory: 'libs/dogs/domain',
    importPath: '@dog-rating/dogs/domain',
  },
  {
    name: 'dogs-feature',
    directory: 'libs/dogs/feature',
    importPath: '@dog-rating/dogs/feature',
  },
  {
    name: 'dogs-ui',
    directory: 'libs/dogs/ui',
    importPath: '@dog-rating/dogs/ui',
  },
  {
    name: 'shared-ui-common',
    directory: 'libs/shared/ui-common',
    importPath: '@dog-rating/shared/ui-common',
  },
  {
    name: 'shared-util-auth',
    directory: 'libs/shared/util-auth',
    importPath: '@dog-rating/shared/util-auth',
  },
  {
    name: 'shared-util-camera',
    directory: 'libs/shared/util-camera',
    importPath: '@dog-rating/shared/util-camera',
  },
  {
    name: 'shared-util-common',
    directory: 'libs/shared/util-common',
    importPath: '@dog-rating/shared/util-common',
  },
  {
    name: 'shared-util-environments',
    directory: 'libs/shared/util-environments',
    importPath: '@dog-rating/shared/util-environments',
  },
  {
    name: 'shared-util-notification',
    directory: 'libs/shared/util-notification',
    importPath: '@dog-rating/shared/util-notification',
  },
  {
    name: 'shared-util-platform-information',
    directory: 'libs/shared/util-platform-information',
    importPath: '@dog-rating/shared/util-platform-information',
  },
  {
    name: 'shared-util-real-time',
    directory: 'libs/shared/util-real-time',
    importPath: '@dog-rating/shared/util-real-time',
  },
];

function recreateWorkspaceLibraries() {
  console.log(`🚀 Starting generation of ${libraries.length} libraries...\n`);

  libraries.forEach((lib, index) => {
    // Construct the command using the --name flag to avoid positional argument errors
    const command = `npx nx g @nx/angular:library --name=${lib.name} --directory=${lib.directory} --importPath=${lib.importPath} --no-interactive`;

    console.log(`[${index + 1}/${libraries.length}] Creating: ${lib.name}...`);
    console.log(`> ${command}`);

    try {
      // Execute synchronously so we don't overwhelm the file system and can see output in order
      execSync(command, { stdio: 'inherit' });
      console.log(`✅ Successfully created ${lib.name}.\n`);
    } catch (error) {
      console.error(`❌ Failed to create library ${lib.name}:`, error.message);
    }
  });

  console.log('✨ Finished recreating all libraries!');
}

recreateWorkspaceLibraries();

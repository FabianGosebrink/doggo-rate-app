import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ratemydoggo',
  webDir: 'dist/ratemydoggo',
  bundledWebRuntime: false,
  // android: {
  //   allowMixedContent: true,
  //   overrideUserAgent: 'capacitor://localhost',
  // },
  // server: {
  //   allowNavigation: ['https://ratemydoggo.azurewebsites.net/api/*'],
  //   // androidScheme: 'http',
  //   // cleartext: true,
  // },
  // plugins: {
  //   CapacitorHttp: {
  //     enabled: true,
  //   },
  // },
};

export default config;

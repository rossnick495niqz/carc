import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.carculator.app',
    appName: 'Auto Import Calculator',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: "#111111",
            showSpinner: false,
            androidScaleType: "CENTER_CROP",
            splashFullScreen: true,
            splashImmersive: true
        },
        Keyboard: {
            resize: "body",
            style: "DARK",
            resizeOnFullScreen: true
        }
    }
};

export default config;

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import pkg from '../package.json';

const getGitHash = () => {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch (e) {
        return 'unknown';
    }
};

const versionInfo = {
    version: pkg.version,
    sha: getGitHash(),
    builtAt: new Date().toISOString(),
};

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

fs.writeFileSync(
    path.join(publicDir, 'version.json'),
    JSON.stringify(versionInfo, null, 2)
);

console.log('Generated public/version.json:', versionInfo);

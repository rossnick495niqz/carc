import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// We want to detect 'new URL(..., "/")' or 'new URL(..., "/carc/")' patterns in build output
// which indicate a relative base was passed to URL constructor (unsafe).

// Assumes running from project root
const DIST_DIR = path.resolve(process.cwd(), 'dist/assets');

async function check() {
    console.log('🔍 Scanning build output for unsafe URL constructors...');

    if (!fs.existsSync(DIST_DIR)) {
        console.error('❌ dist/assets not found. Run build first.');
        process.exit(1);
    }

    // Find all JS files
    const files = await glob(path.join(DIST_DIR, '*.js'));
    let foundIssues = 0;

    // Regex explanation:
    // new URL\(    -> Match literal "new URL("
    // [^)]+        -> Match arguments
    // ,            -> Match comma separator
    // \s*          -> Optional whitespace
    // ["']\/       -> Match quote followed by slash (start of relative path like "/" or "/carc/")
    const unsafePattern = /new URL\([^,]+,\s*["']\//g;

    // Also look for explicit import.meta.env.BASE_URL usage that might have been compiled to specific strings
    // But usually in vite build it becomes a string literal.

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');

        // Check for unsafe pattern
        // We might get false positives if code legitmately uses absolute paths starting with /, but unlikely for base argument
        // new URL(path, base) -> base must be absolute.

        let match;
        while ((match = unsafePattern.exec(content)) !== null) {
            console.error(`❌ Unsafe URL usage found in ${path.basename(file)} at index ${match.index}:`);
            console.error(`   ...${content.substring(match.index, match.index + 50)}...`);
            foundIssues++;
        }
    }

    if (foundIssues > 0) {
        console.error(`\n💥 Found ${foundIssues} unsafe URL constructor usages.`);
        console.error('   Please use publicUrl() helper instead of new URL(..., import.meta.env.BASE_URL).');
        process.exit(1);
    }

    console.log('✅ No unsafe URL constructors found.');
}

check().catch(e => {
    console.error(e);
    process.exit(1);
});

#!/usr/bin/env node

/**
 * Verification Script - Check if MediCare is properly set up
 * Run this to diagnose any issues before starting the app
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 MediCare Setup Verification\n');
console.log('=' .repeat(50));

let passed = 0;
let failed = 0;

// Check 1: Required files exist
console.log('\n1️⃣  Checking required files...');
const requiredFiles = ['package.json', 'server.js', 'script.js', 'index.html', 'styles.css'];
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   ✅ ${file}`);
        passed++;
    } else {
        console.log(`   ❌ ${file} - MISSING`);
        failed++;
    }
});

// Check 2: Node modules installed
console.log('\n2️⃣  Checking Node modules...');
if (fs.existsSync('node_modules')) {
    console.log('   ✅ node_modules exists');
    passed++;
    
    const requiredModules = ['express', 'sqlite3', 'cors'];
    requiredModules.forEach(mod => {
        if (fs.existsSync(`node_modules/${mod}`)) {
            console.log(`      ✅ ${mod} installed`);
            passed++;
        } else {
            console.log(`      ❌ ${mod} - NOT INSTALLED`);
            failed++;
        }
    });
} else {
    console.log('   ❌ node_modules not found - Run: npm install');
    failed++;
}

// Check 3: Database file
console.log('\n3️⃣  Checking database...');
if (fs.existsSync('medicare.db')) {
    console.log('   ✅ medicare.db exists');
    passed++;
} else {
    console.log('   ℹ️  medicare.db not created yet (will be created on first server run)');
}

// Check 4: Package.json contains correct dependencies
console.log('\n4️⃣  Checking package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = packageJson.dependencies || {};
    
    ['express', 'sqlite3', 'cors'].forEach(dep => {
        if (deps[dep]) {
            console.log(`   ✅ ${dep}: ${deps[dep]}`);
            passed++;
        } else {
            console.log(`   ❌ ${dep} - NOT IN PACKAGE.JSON`);
            failed++;
        }
    });
} catch (err) {
    console.log('   ❌ Error reading package.json');
    failed++;
}

// Check 5: API configuration in script.js
console.log('\n5️⃣  Checking API configuration...');
try {
    const scriptContent = fs.readFileSync('script.js', 'utf8');
    if (scriptContent.includes('localhost:3001')) {
        console.log('   ✅ API_BASE_URL set to localhost:3001');
        passed++;
    } else {
        console.log('   ❌ API_BASE_URL not properly configured');
        failed++;
    }
} catch (err) {
    console.log('   ❌ Error reading script.js');
    failed++;
}

// Check 6: Port configuration
console.log('\n6️⃣  Checking port configuration in server.js...');
try {
    const serverContent = fs.readFileSync('server.js', 'utf8');
    if (serverContent.includes('3001')) {
        console.log('   ✅ Server configured for port 3001');
        passed++;
    } else {
        console.log('   ❌ Server port not properly configured');
        failed++;
    }
} catch (err) {
    console.log('   ❌ Error reading server.js');
    failed++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Summary:');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);

if (failed === 0) {
    console.log('\n✨ All checks passed! Ready to run MediCare.\n');
    console.log('🚀 Next steps:');
    console.log('   1. Terminal 1: npm start');
    console.log('   2. Terminal 2: npx http-server -p 8000');
    console.log('   3. Open: http://127.0.0.1:8000\n');
} else {
    console.log('\n⚠️  Please fix the errors above before running MediCare.\n');
    console.log('💡 Tips:');
    console.log('   - Run: npm install');
    console.log('   - Check: node -v (should be v14+)');
    console.log('   - Check: npm -v (should be v6+)\n');
}

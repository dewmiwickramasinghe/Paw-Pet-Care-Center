const fs = require('fs');
const path = require('path');

// Check package.json for required dependencies
console.log('Checking package.json for required dependencies...');
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDependencies = {
  '@mui/material': true,
  '@emotion/react': true,
  '@emotion/styled': true,
  '@mui/icons-material': true,
  'axios': true,
  'react-router-dom': true
};

const missingDependencies = [];

for (const dep in requiredDependencies) {
  if (!packageJson.dependencies[dep]) {
    missingDependencies.push(dep);
  }
}

if (missingDependencies.length > 0) {
  console.log('Missing dependencies found:');
  console.log(missingDependencies.join(', '));
  console.log(`Run: npm install ${missingDependencies.join(' ')}`);
} else {
  console.log('All required dependencies are installed.');
}

// Check for common errors in component files
console.log('\nChecking component files for common errors...');

const componentsDir = path.join(__dirname, 'src/components');
const componentFiles = fs.readdirSync(componentsDir);

let errorsFound = false;

for (const file of componentFiles) {
  const filePath = path.join(componentsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for missing Grid import in files that use Grid
  if (content.includes('<Grid') && !content.includes('import') && !content.includes('Grid')) {
    console.log(`ERROR: ${file} uses Grid component but doesn't import it`);
    errorsFound = true;
  }
  
  // Check for files using Material UI icons without proper import
  if ((content.includes('<Icon') || content.includes('Icon />')) && 
      !content.includes('@mui/icons-material')) {
    console.log(`ERROR: ${file} uses Material UI icons but doesn't import from @mui/icons-material`);
    errorsFound = true;
  }
}

if (!errorsFound) {
  console.log('No common errors found in component files.');
}

console.log('\nChecking for import errors in App.js...');

const appJsPath = path.join(__dirname, 'src/App.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Check if App.js tries to import components that don't exist
const importMatches = appJsContent.matchAll(/import\s+(\w+)\s+from\s+['"]\.\/components\/(\w+)['"]/g);

for (const match of importMatches) {
  const componentName = match[2];
  const componentPath = path.join(componentsDir, `${componentName}.js`);
  
  if (!fs.existsSync(componentPath)) {
    console.log(`ERROR: App.js imports ${componentName} but ${componentName}.js doesn't exist`);
    errorsFound = true;
  }
}

console.log('\nFrontend diagnostic completed.'); 
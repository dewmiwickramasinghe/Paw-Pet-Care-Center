const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnosing and fixing frontend issues...');

// Check for common issue with react-scripts and node version
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 1. Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('❌ node_modules not found. Running npm install...');
  try {
    // Run npm install synchronously
    require('child_process').execSync('npm install', {
      stdio: 'inherit',
      cwd: __dirname
    });
    console.log('✅ npm install completed successfully.');
  } catch (error) {
    console.error('❌ npm install failed:', error.message);
    process.exit(1);
  }
}

// 2. Check backend server connection
console.log('🔄 Checking backend server connection...');
exec('curl http://localhost:5000/api/pets', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Cannot connect to backend server. Is it running?');
    console.log('ℹ️ Make sure your backend server is running at http://localhost:5000');
  } else {
    console.log('✅ Backend server is running and accessible.');
  }

  // 3. Start the frontend
  console.log('🚀 Starting the frontend application...');
  console.log('ℹ️ If you encounter any errors, check the browser console (F12) for details.');
  
  // Run npm start
  const npmStart = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  npmStart.on('error', (error) => {
    console.error('❌ Failed to start the application:', error);
  });

  // Handle process exit
  process.on('SIGINT', () => {
    console.log('👋 Stopping the application...');
    npmStart.kill('SIGINT');
    process.exit(0);
  });
}); 
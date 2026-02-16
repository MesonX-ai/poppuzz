// Quick project structure verification
const fs = require('fs');
const path = require('path');

console.log('🧪 Verifying Pop Puzzle Project Structure...\n');

const requiredFiles = [
  'App.tsx',
  'package.json',
  'app.json',
  'tsconfig.json',
  'babel.config.js',
  'eas.json',
  'src/screens/HomeScreen.tsx',
  'src/screens/GameScreen.tsx',
  'src/components/Bubble.tsx',
  'src/components/GameBoard.tsx',
  'src/utils/gameLogic.ts',
  'src/types/index.ts',
  'assets/icon.png',
  'assets/splash.png',
  'assets/adaptive-icon.png',
  'assets/favicon.png',
];

let allFound = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log('✓', file);
  } else {
    console.log('✗', file, '(MISSING)');
    allFound = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allFound) {
  console.log('✅ All required files are present!');
  console.log('🎮 Project is ready for development!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm start');
  console.log('  2. Scan QR code with Expo Go app');
  console.log('  3. Start playing Pop Puzzle!');
} else {
  console.log('❌ Some files are missing!');
  console.log('Please check the project setup.');
}

console.log('='.repeat(50) + '\n');

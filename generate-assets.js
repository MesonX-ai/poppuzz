const sharp = require('sharp');
const path = require('path');

async function createAssets() {
  const assetsDir = path.join(__dirname, 'assets');

  // Create a simple circular bubble icon with gradient
  const svgIcon = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad1" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#6BB6FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#4A90E2;stop-opacity:1" />
        </radialGradient>
        <radialGradient id="highlight" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.8" />
          <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="#4A90E2"/>
      <circle cx="512" cy="512" r="400" fill="url(#grad1)"/>
      <circle cx="380" cy="380" r="150" fill="url(#highlight)"/>
      <text x="512" y="580" font-family="Arial" font-size="200" font-weight="bold" 
            text-anchor="middle" fill="#FFFFFF">🎈</text>
    </svg>
  `;

  const svgSplash = `
    <svg width="1284" height="2778" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#6BB6FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#4A90E2;stop-opacity:1" />
        </radialGradient>
      </defs>
      <rect width="1284" height="2778" fill="url(#bgGrad)"/>
      <text x="642" y="1200" font-family="Arial" font-size="120" font-weight="bold" 
            text-anchor="middle" fill="#FFFFFF">Pop Puzzle</text>
      <text x="642" y="1600" font-family="Arial" font-size="240" text-anchor="middle">🎈</text>
    </svg>
  `;

  try {
    // Generate app icon
    await sharp(Buffer.from(svgIcon))
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));

    // Generate adaptive icon
    await sharp(Buffer.from(svgIcon))
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon.png'));

    // Generate splash screen
    await sharp(Buffer.from(svgSplash))
      .png()
      .toFile(path.join(assetsDir, 'splash.png'));

    // Generate favicon
    await sharp(Buffer.from(svgIcon))
      .resize(48, 48)
      .png()
      .toFile(path.join(assetsDir, 'favicon.png'));

    console.log('✅ Placeholder assets created successfully!');
    console.log('📁 Assets saved to:', assetsDir);
    console.log('\n⚠️  These are placeholder assets. Replace with custom designs before publishing!');
  } catch (error) {
    console.error('Error generating assets:', error);
  }
}

createAssets();

const { Jimp } = require('jimp');

async function processImage() {
  try {
    // Read the original image that was copied from the user's upload
    // Wait, the original logo.png was overwritten.
    // Let's read from the artifact directory again to get the pristine original image.
    const image = await Jimp.read('C:\\Users\\Ahmad\\.gemini\\antigravity-ide\\brain\\12337823-a5a7-4981-af82-ee5ccbbd8b1d\\media__1786544946270.png');
    
    const targetColor = { r: 255, g: 255, b: 255 }; // White background
    const threshold = 40; // Allow some deviation for JPEG artifacts

    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // First pass: Find background color (assuming top-left pixel is background)
    const bgR = image.bitmap.data[0];
    const bgG = image.bitmap.data[1];
    const bgB = image.bitmap.data[2];

    image.scan(0, 0, width, height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      // Calculate color distance from the background color
      const distance = Math.sqrt(
        Math.pow(r - bgR, 2) +
        Math.pow(g - bgG, 2) +
        Math.pow(b - bgB, 2)
      );

      // If it's very close to the background color, make it fully transparent
      if (distance < threshold) {
        this.bitmap.data[idx + 3] = 0; // Alpha 0
      } else if (distance < threshold + 30) {
        // Anti-aliasing / smoothing for edges
        const alpha = Math.floor(255 * ((distance - threshold) / 30));
        this.bitmap.data[idx + 3] = alpha;
      }
    });

    await image.write('public/logo-clear.png');
    console.log('Successfully created logo-clear.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();

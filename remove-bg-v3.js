const { Jimp } = require('jimp');

async function processImage() {
  try {
    // Read the original image from the artifact directory (the one the user uploaded)
    const image = await Jimp.read('C:\\Users\\Ahmad\\.gemini\\antigravity-ide\\brain\\12337823-a5a7-4981-af82-ee5ccbbd8b1d\\media__1786544946270.png');
    
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    image.scan(0, 0, width, height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      // The logo only contains dark blue, cyan, and light blue. All of these have relatively low Red values.
      // The background is a white/gray gradient, which has high Red, Green, and Blue.
      // We also check if it's somewhat unsaturated (grayish) to avoid deleting any bright colors if they exist.
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = (max === 0) ? 0 : (max - min) / max;

      // If the pixel is light (r > 160) AND relatively grayish (saturation < 0.3)
      if (r > 160 && g > 160 && b > 160 && saturation < 0.25) {
        this.bitmap.data[idx + 3] = 0; // Make fully transparent
      } else if (r > 130 && g > 130 && b > 130 && saturation < 0.3) {
        // Soft edge for anti-aliasing
        const alpha = Math.floor(255 * (1 - ((r - 130) / 30)));
        this.bitmap.data[idx + 3] = Math.max(0, Math.min(255, alpha));
      }
    });

    await image.write('public/logo-transparent-final.png');
    console.log('Successfully created logo-transparent-final.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();

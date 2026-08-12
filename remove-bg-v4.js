const { Jimp } = require('jimp');

async function processImage() {
  try {
    const image = await Jimp.read('C:\\Users\\Ahmad\\.gemini\\antigravity-ide\\brain\\12337823-a5a7-4981-af82-ee5ccbbd8b1d\\media__1786544946270.png');
    
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Luminance thresholds
    const L_BG = 220; // Luminance above this is considered pure background (alpha = 0)
    const L_FG = 150; // Luminance below this is considered pure foreground (alpha = 255)

    image.scan(0, 0, width, height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      let alpha = 255;
      
      if (luminance >= L_BG) {
        alpha = 0;
      } else if (luminance <= L_FG) {
        alpha = 255;
      } else {
        // Smooth transition for anti-aliased edges (between 150 and 220)
        alpha = Math.floor(255 * (L_BG - luminance) / (L_BG - L_FG));
      }

      // If the pixel is semi-transparent, it means it was originally blended with white.
      // To prevent a white halo, we can darken the pixel's RGB by stretching it back.
      // But keeping it simple also works well enough.
      
      this.bitmap.data[idx + 3] = alpha;
    });

    await image.write('public/logo-transparent-final.png');
    console.log('Successfully created logo-transparent-final.png with preserved motto');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();

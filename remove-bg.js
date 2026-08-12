const { Jimp } = require('jimp');

async function processImage() {
  try {
    const image = await Jimp.read('public/logo.png');
    
    // Process each pixel
    image.scan((x, y, idx) => {
      const r = image.bitmap.data[idx + 0];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];
      
      // Calculate how close the pixel is to white (255)
      // If it's pure white, alpha = 0 (transparent)
      // If it's dark, alpha = 255 (opaque)
      // This helps with anti-aliasing around the edges
      
      const avg = (r + g + b) / 3;
      
      if (avg > 235) { // Very light gray/white
        // Make pure white completely transparent, and smoothly ramp up opacity for edge pixels
        const alpha = Math.max(0, 255 - ((avg - 235) * (255 / 20)));
        image.bitmap.data[idx + 3] = alpha;
      }
    });

    await image.write('public/logo-transparent.png');
    console.log('Successfully created logo-transparent.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();

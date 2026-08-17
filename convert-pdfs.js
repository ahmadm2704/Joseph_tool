const fs = require('fs');
const path = require('path');
const pdf2img = require('pdf-img-convert');

async function convertPdfs() {
  const artifactDir = 'C:\\Users\\Ahmad\\.gemini\\antigravity-ide\\brain\\12337823-a5a7-4981-af82-ee5ccbbd8b1d';
  const publicDir = path.join(__dirname, 'public', 'certificates');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Find all PDFs in the artifact directory
  const files = fs.readdirSync(artifactDir).filter(f => f.endsWith('.pdf'));
  
  let i = 1;
  for (const file of files) {
    const pdfPath = path.join(artifactDir, file);
    console.log(`Converting ${pdfPath}...`);
    
    try {
      // Convert first page to image
      const outputImages = await pdf2img.convert(pdfPath, {
        width: 1200, // High res for aesthetics
        page_numbers: [1]
      });
      
      const outPath = path.join(publicDir, `cert-${i}.png`);
      fs.writeFileSync(outPath, outputImages[0]);
      console.log(`Saved ${outPath}`);
      i++;
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err);
    }
  }
}

convertPdfs();

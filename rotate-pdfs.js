const fs = require('fs');
const { PDFDocument, degrees } = require('pdf-lib');

(async () => {
  const dir = 'public/certificates';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.pdf'));
  
  for (const file of files) {
    const path = dir + '/' + file;
    const pdfBytes = fs.readFileSync(path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    for (const page of pages) {
      page.setRotation(degrees(90));
    }
    
    const modified = await pdfDoc.save();
    fs.writeFileSync(path, modified);
    console.log('Successfully rotated ' + file);
  }
})();

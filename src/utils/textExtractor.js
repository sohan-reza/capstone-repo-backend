import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse/lib/pdf-parse.js'
import mammoth from 'mammoth';
import AdmZip from 'adm-zip';

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const extractTextFromDocx = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

const extractTextFromZip = async (zipPath) => {
  const zip = new AdmZip(zipPath);
  const tempFolder = `uploads/tmp-${Date.now()}`;
  zip.extractAllTo(tempFolder, true);

  let allText = '';

  const files = fs.readdirSync(tempFolder);

  for (const file of files) {
    const filePath = path.join(tempFolder, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isFile() &&
      !file.startsWith('._') &&
      !file.startsWith('.')
    ) {
      const ext = path.extname(file).toLowerCase();

      if (ext === '.pdf') {
        allText += '\n' + await extractTextFromPDF(filePath);
      } else if (ext === '.docx') {
        allText += '\n' + await extractTextFromDocx(filePath);
      }

      fs.unlinkSync(filePath);
    }
  }

  fs.rmdirSync(tempFolder, { recursive: true });
  return allText;
};


export const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return await extractTextFromPDF(filePath);
  } else if (ext === '.docx') {
    return await extractTextFromDocx(filePath);
  } else if (ext === '.zip') {
    return await extractTextFromZip(filePath);
  } else {
    throw new Error('Unsupported file type. Only PDF, DOCX, and ZIP allowed.');
  }
};

// import mammoth from 'mammoth';
// import { logger } from './logger.js';
// import * as pdfjsLib from 'pdfjs-dist';

// // Configure PDF.js worker
// const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
//   try {
//     // Convert buffer to Uint8Array
//     const data = new Uint8Array(buffer);
    
//     // Load PDF document
//     const loadingTask = pdfjsLib.getDocument({
//       data,
//       useWorkerFetch: false,
//       isEvalSupported: false,
//       useSystemFonts: true,
//     });
    
//     const pdf = await loadingTask.promise;
//     let fullText = '';
    
//     // Extract text from each page
//     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//       const page = await pdf.getPage(pageNum);
//       const textContent = await page.getTextContent();
//       const pageText = textContent.items
//         .map((item: any) => item.str)
//         .join(' ');
//       fullText += pageText + '\n\n';
//     }
    
//     logger.info(`Extracted ${fullText.length} characters from PDF`);
//     return fullText.trim();
//   } catch (error) {
//     logger.error('PDF extraction failed:', error);
//     throw new Error('Failed to extract text from PDF');
//   }
// }

// export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
//   try {
//     const result = await mammoth.extractRawText({ buffer });
//     logger.info(`Extracted ${result.value.length} characters from DOCX`);
//     return result.value;
//   } catch (error) {
//     logger.error('DOCX extraction failed:', error);
//     throw new Error('Failed to extract text from DOCX');
//   }
// }

// export async function extractText(
//   buffer: Buffer,
//   mimeType: string
// ): Promise<string> {
//   if (mimeType === 'application/pdf') {
//     return extractTextFromPDF(buffer);
//   } else if (
//     mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//   ) {
//     return extractTextFromDOCX(buffer);
//   } else if (mimeType === 'text/plain') {
//     return buffer.toString('utf-8');
//   } else {
//     throw new Error(`Unsupported file type: ${mimeType}`);
//   }
// }
import { createRequire } from 'module';
import mammoth from 'mammoth';
import { logger } from './logger.js';

// This workaround ensures we load the Node.js-compatible "legacy" build of the PDF library.
const require = createRequire(import.meta.url);
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = new Uint8Array(buffer);

    // The legacy build is designed for Node.js and does not need a web worker.
    const pdf = await pdfjsLib.getDocument(data).promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + ' '; // Add a space between pages
    }

    logger.info(`Extracted ${fullText.length} characters from PDF`);
    return fullText.trim();
  } catch (error) {
    logger.error('PDF extraction failed:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    logger.info(`Extracted ${result.value.length} characters from DOCX`);
    return result.value;
  } catch (error) {
    logger.error('DOCX extraction failed:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

export async function extractText(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(buffer);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractTextFromDOCX(buffer);
  } else if (mimeType === 'text/plain') {
    return buffer.toString('utf-8');
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

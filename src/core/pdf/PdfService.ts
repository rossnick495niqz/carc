import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

export class PdfService {
    static async generateReport(elementId: string, filename: string = 'report.pdf') {
        const element = document.getElementById(elementId);
        if (!element) throw new Error('Element not found');

        try {
            // 1. Capture High-Res Image
            // Scale up for better quality on retina/print
            const dataUrl = await toPng(element, {
                quality: 0.95,
                pixelRatio: 2,
                backgroundColor: '#ffffff' // Force white background for PDF
            });

            // 2. Init PDF (A4)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // 3. Add Image to PDF
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // 4. Save
            pdf.save(filename);

        } catch (err) {
            console.error('PDF Generation failed', err);
            throw err;
        }
    }
}

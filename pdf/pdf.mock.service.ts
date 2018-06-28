import { PdfService } from './pdf.service';

export class PdfMockService extends PdfService {
    public constructor(memberSocketService, ngRedux) {
        const callConstructor = false;
        if (callConstructor) {
            super(memberSocketService, ngRedux);
        }
    }

    public getPdf(pdfId: any): any {
        return new Promise((resolve, reject) => {
            if (pdfId === 0) {
                reject('fileHash');
            }
            resolve('fileHash');
        });
    }
}

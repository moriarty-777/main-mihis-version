import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).addVirtualFileSystem(pdfFonts);

@Injectable({
  providedIn: 'root',
})
export class PdfGenerationService {
  private http = inject(HttpClient);
  private toastrService = inject(ToastrService);
  // async generateChildVaccinationStatusPdf(children: any[]) {
  //   const documentDefinition = {
  //     content: [
  //       { text: 'Child Vaccination Status Report', style: 'header' },
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', '*', '*', '*', '*'],
  //           body: [
  //             [
  //               { text: 'First Name', style: 'tableHeader' },
  //               { text: 'Last Name', style: 'tableHeader' },
  //               { text: 'Vaccine Status', style: 'tableHeader' },
  //               { text: 'Purok', style: 'tableHeader' },
  //               { text: 'Barangay', style: 'tableHeader' },
  //             ],
  //             ...children.map((child) => [
  //               child.firstName,
  //               child.lastName,
  //               child.vaccineStatus,
  //               `Purok ${child.purok}`,
  //               child.barangay,
  //             ]),
  //           ],
  //         },
  //       },
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         margin: [0, 0, 0, 10] as [number, number, number, number],
  //       },
  //       tableHeader: { bold: true, fontSize: 13, color: 'black' },
  //     },
  //   };

  //   pdfMake.createPdf(documentDefinition).open();
  // }
  async generateChildVaccinationStatusPdf(
    children: any[],
    year: string,
    month: string
  ) {
    const documentDefinition = {
      content: [
        { text: 'Child Vaccination Status Report', style: 'header' },
        { text: `Year: ${year}`, style: 'subheader' },
        { text: `Month: ${month}`, style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'First Name', style: 'tableHeader' },
                { text: 'Last Name', style: 'tableHeader' },
                { text: 'Vaccine Status', style: 'tableHeader' },
                { text: 'Purok', style: 'tableHeader' },
                { text: 'Barangay', style: 'tableHeader' },
              ],
              ...children.map((child) => [
                child.firstName,
                child.lastName,
                child.vaccineStatus,
                `Purok ${child.purok}`,
                child.barangay,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10] as [number, number, number, number],
        },
        subheader: {
          fontSize: 14,
          bold: false,
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}

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
  // New function for generating nutritional status report
  // async generateChildNutritionalStatusPdf(
  //   children: any[],
  //   year: string,
  //   month: string
  // ) {
  //   const documentDefinition = {
  //     content: [
  //       { text: 'Child Nutritional Status Report', style: 'header' },
  //       { text: `Year: ${year}`, style: 'subheader' },
  //       { text: `Month: ${month}`, style: 'subheader' },
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', '*', '*', '*', '*'],
  //           body: [
  //             [
  //               { text: 'First Name', style: 'tableHeader' },
  //               { text: 'Last Name', style: 'tableHeader' },
  //               { text: 'Nutritional Status', style: 'tableHeader' }, // Updated label
  //               { text: 'Purok', style: 'tableHeader' },
  //               { text: 'Barangay', style: 'tableHeader' },
  //             ],
  //             ...children.map((child) => [
  //               child.firstName,
  //               child.lastName,
  //               child.nutritionalStatus, // Use nutritional status here
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
  //       subheader: {
  //         fontSize: 14,
  //         bold: false,
  //         margin: [0, 0, 0, 5] as [number, number, number, number],
  //       },
  //       tableHeader: { bold: true, fontSize: 13, color: 'black' },
  //     },
  //   };

  //   pdfMake.createPdf(documentDefinition).open();
  // }
  async generateChildNutritionalStatusPdf(
    children: any[],
    year: string,
    month: string
  ) {
    // Calculate the number of malnourished children
    const malnourishedCount = children.filter(
      (child) => child.nutritionalStatus === 'Malnourished'
    ).length;

    // Define the note based on the malnourished count
    let note = '';
    if (malnourishedCount > 10) {
      note =
        'Note: Initiate a 10-day feeding program for malnourished children.';
    } else if (malnourishedCount > 0 && malnourishedCount <= 10) {
      note = 'Note: Provide nutritional supplements to malnourished children.';
    }

    // Define the document structure
    const documentDefinition = {
      content: [
        {
          text: note,
          style: 'note',
          absolutePosition: { x: 400, y: 40 }, // Position it at the top right
        },
        { text: 'Child Nutritional Status Report', style: 'header' },
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
                { text: 'Nutritional Status', style: 'tableHeader' },
                { text: 'Purok', style: 'tableHeader' },
                { text: 'Barangay', style: 'tableHeader' },
              ],
              ...children.map((child) => [
                child.firstName,
                child.lastName,
                child.nutritionalStatus,
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
        note: { fontSize: 12, italics: true }, // Simplified note style
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}

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

  async generateImmunizationStatusReport(
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
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  // TODO: NEW
  // async generateMissedVaccineReportPdf(
  //   childrenWithMissedVaccines: any[],
  //   year: string,
  //   month: string
  // ) {
  //   // Define the document structure for the missed vaccine report
  //   const documentDefinition = {
  //     content: [
  //       { text: 'Missed Vaccine Report', style: 'header' },
  //       { text: `Year: ${year}`, style: 'subheader' },
  //       { text: `Month: ${month}`, style: 'subheader' },
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', '*', '*', '*', '*', '*'],
  //           body: [
  //             [
  //               { text: 'First Name', style: 'tableHeader' },
  //               { text: 'Last Name', style: 'tableHeader' },
  //               { text: 'Vaccine Name', style: 'tableHeader' },
  //               { text: 'Date Missed', style: 'tableHeader' },
  //               { text: 'Reason', style: 'tableHeader' },
  //               { text: 'Purok', style: 'tableHeader' },
  //             ],
  //             // Map each child and their missed vaccines to table rows
  //             ...childrenWithMissedVaccines.flatMap((child) =>
  //               child.missedVaccines.map((vaccine: any) => [
  //                 child.firstName,
  //                 child.lastName,
  //                 vaccine.vaccineName,
  //                 new Date(vaccine.dateMissed).toLocaleDateString(), // Format date
  //                 vaccine.reason || 'N/A',
  //                 `Purok ${child.purok}`,
  //               ])
  //             ),
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

  //   // Generate the PDF and open it
  //   pdfMake.createPdf(documentDefinition).open();
  // }
  async generateMissedVaccineReportPdf(childrenWithMissedVaccines: any[]) {
    const documentDefinition = {
      content: [
        { text: 'Missed Vaccine Report', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'], // Only three columns now
            body: [
              [
                { text: 'Vaccine Name', style: 'tableHeader' },
                { text: 'Reason', style: 'tableHeader' },
              ],
              // Map each missed vaccine to table rows without child names or date
              ...childrenWithMissedVaccines.flatMap((child) =>
                child.missedVaccines.map((vaccine: any) => [
                  vaccine.vaccineName,
                  vaccine.reason || 'N/A',
                ])
              ),
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
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  // Administered
  async generateAdministeredVaccinesPdf(vaccineData: any[]) {
    // Check if vaccineData is populated correctly
    console.log('Vaccine Data for PDF:', vaccineData);

    const documentDefinition = {
      content: [
        { text: 'Administered Vaccines and Doses', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Vaccine Name', style: 'tableHeader' },
                { text: 'Dose Number', style: 'tableHeader' },
                { text: 'Male', style: 'tableHeader' },
                { text: 'Female', style: 'tableHeader' },
                { text: 'Total', style: 'tableHeader' },
              ],
              ...vaccineData.map((vaccine) => [
                vaccine.vaccineName || 'N/A', // Default to "N/A" if undefined
                vaccine.doseNumber || 'N/A',
                vaccine.maleCount !== undefined ? vaccine.maleCount : 0, // Default to 0 if undefined
                vaccine.femaleCount !== undefined ? vaccine.femaleCount : 0, // Default to 0 if undefined
                vaccine.totalCount !== undefined ? vaccine.totalCount : 0, // Default to 0 if undefined
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
          margin: [0, 10, 0, 5] as [number, number, number, number],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  // Weight for age
  async generateWeightForAgePdf(weightForAgeData: { [key: string]: number }) {
    const documentDefinition = {
      content: [
        { text: 'Weight-for-Age Distribution', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [
                { text: 'Category', style: 'tableHeader' },
                { text: 'Count', style: 'tableHeader' },
              ],
              ...Object.entries(weightForAgeData).map(([category, count]) => [
                category,
                count,
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
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
  // height for age
  async generateHeightForAgePdf(heightForAgeData: { [key: string]: number }) {
    const documentDefinition = {
      content: [
        { text: 'Height-for-Age Distribution', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [
                { text: 'Category', style: 'tableHeader' },
                { text: 'Count', style: 'tableHeader' },
              ],
              // Dynamically map height-for-age data into table rows
              ...Object.entries(heightForAgeData).map(([category, count]) => [
                category,
                count,
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
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  // weight for height
  async generateWeightForHeightPdf(weightForHeightData: {
    [key: string]: number;
  }) {
    const documentDefinition = {
      content: [
        { text: 'Weight-for-Height Status', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [
                { text: 'Category', style: 'tableHeader' },
                { text: 'Count', style: 'tableHeader' },
              ],
              // Populate rows from weight-for-height data
              ...Object.entries(weightForHeightData).map(
                ([category, count]) => [category, count]
              ),
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
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}

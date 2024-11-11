import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { BARANGAY_LOGO, BINANGONAN_LOGO } from './shared-image';

(<any>pdfMake).addVirtualFileSystem(pdfFonts);

@Injectable({
  providedIn: 'root',
})
export class PdfGenerationService {
  private http = inject(HttpClient);
  private toastrService = inject(ToastrService);

  private readonly bangadLogo = BARANGAY_LOGO;
  private readonly binangonanLogo = BINANGONAN_LOGO;

  private generateHeader() {
    return {
      columns: [
        {
          image: this.binangonanLogo, // Left-side logo
          width: 80,
          alignment: 'left',
          margin: [0, 0, 10, 0],
        },
        {
          stack: [
            { text: 'Republic of the Philippines', style: 'headerText' },
            { text: 'Province of Rizal', style: 'headerText' },
            { text: 'Municipality of Binangonan Rizal', style: 'headerText' },
            { text: 'Barangay Bangad, Binangonan, Rizal', style: 'headerText' },
            { text: 'Barangay Bangad Health Center', style: 'headerText' },
          ],
          alignment: 'center',
          margin: [0, 20, 0, 20],
        },
        {
          image: this.bangadLogo, // Right-side logo
          width: 80,
          alignment: 'right',
          margin: [10, 0, 0, 0],
        },
      ],
    };
  }

  async generateChildVaccinationStatusPdf(
    children: any[],
    year: string,
    month: string
  ) {
    console.log('Children Data:', children);

    const fullyVaccinated = children.filter(
      (child) => child.vaccineStatus === 'Fully Vaccinated'
    );
    const partiallyVaccinated = children.filter(
      (child) => child.vaccineStatus === 'Partially Vaccinated'
    );
    const notVaccinated = children.filter(
      (child) => child.vaccineStatus === 'Not Vaccinated'
    );

    const documentDefinition: any = {
      content: [
        {
          columns: [
            {
              image: this.binangonanLogo, // Left-side logo
              width: 80,
              alignment: 'left',
              margin: [0, 0, 10, 0],
            },
            {
              stack: [
                { text: 'Republic of the Philippines', style: 'headerText' },
                { text: 'Province of Rizal', style: 'headerText' },
                {
                  text: 'Municipality of Binangonan Rizal',
                  style: 'headerText',
                },
                {
                  text: 'Barangay Bangad, Binangonan, Rizal',
                  style: 'headerText',
                },
                {
                  text: 'Barangay Bangad Health Center',
                  style: 'headerText',
                },
              ],
              alignment: 'center',
              margin: [0, 20, 0, 20],
            },
            {
              image: this.bangadLogo, // Right-side logo
              width: 80,
              alignment: 'right',
              margin: [10, 0, 0, 0],
            },
          ],
        },
        { text: 'Child Vaccination Status Report', style: 'header' },
        {
          text: 'This document provides a detailed report of the vaccination status of children in Barangay Bangad. The data includes each child’s name, vaccination status, purok, and gender to aid in monitoring and improving vaccination coverage.',
          alignment: 'justify', // Justified alignment for readability
          margin: [0, 10, 0, 10],
        },
        {
          text: `Year: ${year}`,
          style: 'subheader',
        },
        {
          text: `Month: ${month}`,
          style: 'subheader',
        },
        // Fully Vaccinated Table with Count
        {
          columns: [
            {
              text: `Fully Vaccinated`,
              style: 'tableTitle',
              alignment: 'left',
            },
            {
              text: `Count: ${fullyVaccinated.length}`,
              alignment: 'right',
              style: 'countText',
            },
          ],
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Name', style: 'tableHeader' },
                { text: 'Gender', style: 'tableHeader' },
                { text: 'Purok', style: 'tableHeader' },
                { text: 'Vaccine Status', style: 'tableHeader' },
              ],
              ...fullyVaccinated.map((child) => [
                `${child.firstName} ${child.lastName}`,
                child.gender || 'N/A', // Display 'N/A' if gender is missing
                `Purok ${child.purok}`,
                child.vaccineStatus,
              ]),
            ],
          },
          margin: [0, 0, 0, 20],
        },
        // Partially Vaccinated Table with Count
        {
          columns: [
            {
              text: `Partially Vaccinated`,
              style: 'tableTitle',
              alignment: 'left',
            },
            {
              text: `Count: ${partiallyVaccinated.length}`,
              alignment: 'right',
              style: 'countText',
            },
          ],
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Name', style: 'tableHeader' },
                { text: 'Gender', style: 'tableHeader' },
                { text: 'Purok', style: 'tableHeader' },
                { text: 'Vaccine Status', style: 'tableHeader' },
              ],
              ...partiallyVaccinated.map((child) => [
                `${child.firstName} ${child.lastName}`,
                child.gender || 'N/A', // Display 'N/A' if gender is missing
                `Purok ${child.purok}`,
                child.vaccineStatus,
              ]),
            ],
          },
          margin: [0, 0, 0, 20],
        },
        // Not Vaccinated Table with Count
        {
          columns: [
            { text: `Not Vaccinated`, style: 'tableTitle', alignment: 'left' },
            {
              text: `Count: ${notVaccinated.length}`,
              alignment: 'right',
              style: 'countText',
            },
          ],
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Name', style: 'tableHeader' },
                { text: 'Gender', style: 'tableHeader' },
                { text: 'Purok', style: 'tableHeader' },
                { text: 'Vaccine Status', style: 'tableHeader' },
              ],
              ...notVaccinated.map((child) => [
                `${child.firstName} ${child.lastName}`,
                child.gender || 'N/A', // Display 'N/A' if gender is missing
                `Purok ${child.purok}`,
                child.vaccineStatus,
              ]),
            ],
          },
          margin: [0, 0, 0, 20],
        },
      ],
      styles: {
        headerText: { fontSize: 10, bold: true },
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, margin: [0, 0, 0, 5] },
        tableTitle: { fontSize: 14, bold: true },
        countText: { fontSize: 12, bold: true },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  async generateChildNutritionalStatusPdf(
    children: any[],
    year: string,
    month: string
  ) {
    // Filter children by nutritional status
    const malnourishedChildren = children.filter(
      (child) => child.nutritionalStatus === 'Malnourished'
    );
    const normalChildren = children.filter(
      (child) => child.nutritionalStatus === 'Normal'
    );

    // Count of malnourished children for the note
    const malnourishedCount = malnourishedChildren.length;
    let note = '';
    if (malnourishedCount > 10) {
      note =
        'Note: Initiate a 10-day feeding program for malnourished children.';
    } else if (malnourishedCount > 0 && malnourishedCount <= 10) {
      note = 'Note: Provide nutritional supplements to malnourished children.';
    }

    // Define the document structure
    const documentDefinition: any = {
      content: [
        {
          columns: [
            {
              image: this.binangonanLogo, // Left-side logo
              width: 80,
              alignment: 'left',
              margin: [0, 0, 10, 0],
            },
            {
              stack: [
                { text: 'Republic of the Philippines', style: 'headerText' },
                { text: 'Province of Rizal', style: 'headerText' },
                {
                  text: 'Municipality of Binangonan Rizal',
                  style: 'headerText',
                },
                {
                  text: 'Barangay Bangad, Binangonan, Rizal',
                  style: 'headerText',
                },
                {
                  text: 'Barangay Bangad Health Center',
                  style: 'headerText',
                },
              ],
              alignment: 'center',
              margin: [0, 20, 0, 20],
            },
            {
              image: this.bangadLogo, // Right-side logo
              width: 80,
              alignment: 'right',
              margin: [10, 0, 0, 0],
            },
          ],
        },
        { text: 'Child Nutritional Status Report', style: 'header' },
        {
          text: 'This document provides an overview of the nutritional status of children within Barangay Bangad, Binangonan, Rizal. It details the number of malnourished and normal children, along with their respective information and distribution across the puroks.',
          alignment: 'justify',
          margin: [0, 10, 0, 20],
        },
        { text: `Year: ${year}`, style: 'subheader' },
        { text: `Month: ${month}`, style: 'subheader' },

        // Note for malnourished count
        {
          text: note,
          style: 'note',
          alignment: 'right',
          margin: [0, 0, 0, 10],
        },

        // Malnourished Table with Count
        {
          columns: [
            { text: 'Malnourished', style: 'tableTitle', alignment: 'left' },
            {
              text: `Count: ${malnourishedCount}`,
              style: 'countText',
              alignment: 'right',
            },
          ],
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Name', style: 'tableHeader' },
                { text: 'Gender', style: 'tableHeader' },
                { text: 'Purok', style: 'tableHeader' },
                { text: 'Nutritional Status', style: 'tableHeader' },
              ],
              ...malnourishedChildren.map((child) => [
                `${child.firstName} ${child.lastName}`,
                child.gender,
                `Purok ${child.purok}`,
                child.nutritionalStatus,
              ]),
            ],
          },
          margin: [0, 0, 0, 20],
        },

        // Normal Table with Count
        {
          columns: [
            { text: 'Normal', style: 'tableTitle', alignment: 'left' },
            {
              text: `Count: ${normalChildren.length}`,
              style: 'countText',
              alignment: 'right',
            },
          ],
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Name', style: 'tableHeader' },
                { text: 'Gender', style: 'tableHeader' },
                { text: 'Purok', style: 'tableHeader' },
                { text: 'Nutritional Status', style: 'tableHeader' },
              ],
              ...normalChildren.map((child) => [
                `${child.firstName} ${child.lastName}`,
                child.gender,
                `Purok ${child.purok}`,
                child.nutritionalStatus,
              ]),
            ],
          },
          margin: [0, 0, 0, 20],
        },
      ],
      styles: {
        headerText: { fontSize: 10, bold: true },
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, margin: [0, 0, 0, 5] },
        tableTitle: { fontSize: 14, bold: true },
        countText: { fontSize: 12, bold: true },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
        note: { fontSize: 12, italics: true },
      },
    };

    console.log('Malnourished Children:', malnourishedChildren);
    console.log('Normal Children:', normalChildren);
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

  async generateMissedVaccineReportPdf(childrenWithMissedVaccines: any[]) {
    // Step 1: Create a map to count occurrences for each reason
    const reasonCounts = new Map<string, number>();

    // Step 2: Iterate through each child and their missed vaccines
    childrenWithMissedVaccines.forEach((child) => {
      child.missedVaccines.forEach((vaccine: any) => {
        const reason = vaccine.reason || 'N/A';
        reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
      });
    });

    // Step 3: Convert the map to an array format for the PDF table
    const reasonTableBody = Array.from(reasonCounts, ([reason, count]) => [
      reason,
      count.toString(),
    ]);

    // Step 4: Define the PDF document structure
    const documentDefinition: any = {
      content: [
        this.generateHeader(), // Include the header function if you have one
        { text: 'Missed Vaccine Report', style: 'header' },
        {
          text: 'This document provides a detailed report of missed vaccines within Barangay Bangad, including the reason and count for each missed vaccination.',
          alignment: 'justify',
          margin: [0, 10, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              // Header row
              [
                { text: 'Reason', style: 'tableHeader' },
                { text: 'Count', style: 'tableHeader' },
              ],
              ...reasonTableBody, // Insert aggregated reason counts
            ],
          },
        },
      ],
      styles: {
        headerText: { fontSize: 10, bold: true },
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    // Step 5: Generate and open the PDF
    pdfMake.createPdf(documentDefinition).open();
  }

  // Administered
  async generateAdministeredVaccinesPdf(vaccineData: any[]) {
    const documentDefinition: any = {
      content: [
        this.generateHeader(), // Use the common header here
        { text: 'Administered Vaccines and Doses', style: 'header' },
        {
          text: 'This document provides a summary of administered vaccines and doses categorized by vaccine name, dose number, and gender for Barangay Bangad, Binangonan, Rizal.',
          alignment: 'justify',
          margin: [0, 10, 0, 20],
        },
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
                vaccine.vaccineName || 'N/A',
                vaccine.doseNumber || 'N/A',
                vaccine.maleCount !== undefined ? vaccine.maleCount : 0,
                vaccine.femaleCount !== undefined ? vaccine.femaleCount : 0,
                vaccine.totalCount !== undefined ? vaccine.totalCount : 0,
              ]),
            ],
          },
        },
      ],
      styles: {
        headerText: { fontSize: 10, bold: true },
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  // Weight for age
  async generateWeightForAgePdf(weightForAgeData: { [key: string]: number }) {
    const documentDefinition: any = {
      content: [
        this.generateHeader(), // Use the common header
        { text: 'Weight-for-Age Distribution Report', style: 'header' },
        {
          text: 'This document provides an overview of the weight-for-age distribution among children within Barangay Bangad, Binangonan, Rizal, detailing the count for each category to aid in tracking growth and development.',
          alignment: 'justify',
          margin: [0, 10, 0, 20],
        },
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
        headerText: { fontSize: 10, bold: true },
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  // height for age
  async generateHeightForAgePdf(heightForAgeData: { [key: string]: number }) {
    const documentDefinition: any = {
      content: [
        this.generateHeader(), // Use the common header
        { text: 'Height-for-Age Distribution Report', style: 'header' },
        {
          text: 'This document provides an overview of the height-for-age distribution among children within Barangay Bangad, Binangonan, Rizal, detailing the count for each category to aid in tracking growth and development.',
          alignment: 'justify',
          margin: [0, 10, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [
                { text: 'Category', style: 'tableHeader' },
                { text: 'Count', style: 'tableHeader' },
              ],
              ...Object.entries(heightForAgeData).map(([category, count]) => [
                category,
                count,
              ]),
            ],
          },
        },
      ],
      styles: {
        headerText: { fontSize: 10, bold: true },
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  async generateWeightForHeightPdf(weightForHeightData: {
    [key: string]: number;
  }) {
    const documentDefinition: any = {
      content: [
        {
          columns: [
            {
              image: this.binangonanLogo, // Left-side logo
              width: 80,
              alignment: 'left',
              margin: [0, 0, 10, 0],
            },
            {
              stack: [
                { text: 'Republic of the Philippines', style: 'headerText' },
                { text: 'Province of Rizal', style: 'headerText' },
                {
                  text: 'Municipality of Binangonan Rizal',
                  style: 'headerText',
                },
                {
                  text: 'Barangay Bangad, Binangonan, Rizal',
                  style: 'headerText',
                },
                { text: 'Barangay Bangad Health Center', style: 'headerText' },
              ],
              alignment: 'center',
              margin: [0, 20, 0, 20],
            },
            {
              image: this.bangadLogo, // Right-side logo
              width: 80,
              alignment: 'right',
              margin: [10, 0, 0, 0],
            },
          ],
        },
        { text: 'Weight-for-Height Status Report', style: 'header' },
        {
          text: 'This document provides an overview of the weight-for-height status of children within Barangay Bangad, Binangonan, Rizal. It details the distribution of weight categories, aiding in identifying and addressing potential cases of malnutrition.',
          alignment: 'justify',
          margin: [0, 10, 0, 20],
        },
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
        headerText: { fontSize: 10, bold: true },
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, margin: [0, 10, 0, 5] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
        note: { fontSize: 12, italics: true },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  //   // Generate and open the PDF
  //   pdfMake.createPdf(documentDefinition).open();
  // }
  async generateUserReportPdf(users: any[]) {
    // Filter users by role
    const midwives = users.filter(
      (user) => user.role && user.role.toLowerCase() === 'midwife'
    );
    const bhws = users.filter(
      (user) => user.role && user.role.toLowerCase() === 'bhw'
    );

    // Define the document content
    const documentDefinition: any = {
      content: [
        {
          columns: [
            {
              image: this.binangonanLogo, // Now on the left side
              width: 80,
              alignment: 'left',
              margin: [0, 0, 10, 0],
            },
            {
              stack: [
                { text: 'Republic of the Philippines', style: 'headerText' },
                { text: 'Province of Rizal', style: 'headerText' },
                {
                  text: 'Municipality of Binangonan Rizal',
                  style: 'headerText',
                },
                {
                  text: 'Barangay Bangad, Binangonan, Rizal',
                  style: 'headerText',
                },
              ],
              alignment: 'center',
              margin: [0, 20, 0, 20],
            },
            {
              image: this.bangadLogo, // Now on the right side
              width: 80,
              alignment: 'right',
              margin: [10, 0, 0, 0],
            },
          ],
        },
        { text: 'User Report', style: 'mainHeader', margin: [0, 10, 0, 10] },
        {
          text: 'This document presents a detailed report of the midwives and Barangay Health Workers (BHWs) operating in Barangay Bangad. It includes essential information about each personnel, such as their names, gender, and years of experience in serving the community.',
          alignment: 'justify', //
          margin: [0, 0, 0, 10],
        },
        {
          text: 'The midwives and BHWs play a crucial role in providing healthcare services, focusing on maternal and child health, immunization programs, nutrition monitoring, and other health-related initiatives within Barangay Bangad, Binangonan, Rizal. This report is part of the ongoing effort to ensure efficient healthcare service delivery, transparency, and resource allocation in the barangay.',
          alignment: 'justify', //
          margin: [0, 0, 0, 10],
        },

        { text: 'Midwives', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'First Name', style: 'tableHeader' },
                { text: 'Last Name', style: 'tableHeader' },
                { text: 'Gender', style: 'tableHeader' },
                { text: 'Years of Experience', style: 'tableHeader' },
              ],
              ...midwives.map((user: any) => [
                user.firstName,
                user.lastName,
                user.gender,
                user.yearsOfService,
              ]),
            ],
          },
        },
        {
          text: 'Barangay Health Workers (BHW)',
          style: 'subheader',
          margin: [0, 20, 0, 0],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'First Name', style: 'tableHeader' },
                { text: 'Last Name', style: 'tableHeader' },
                { text: 'Gender', style: 'tableHeader' },
                { text: 'Years of Experience', style: 'tableHeader' },
              ],
              ...bhws.map((user: any) => [
                user.firstName,
                user.lastName,
                user.gender,
                user.yearsOfService,
              ]),
            ],
          },
        },
      ],
      styles: {
        headerText: { fontSize: 10, bold: true },
        mainHeader: { fontSize: 18, bold: true, margin: [0, 10, 0, 10] },
        subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    // Generate and open the PDF
    pdfMake.createPdf(documentDefinition).open();
  }

  async generateCompleteImmunizationReportPdf(
    fullyVaccinatedCount: number,
    partiallyVaccinatedCount: number,
    notVaccinatedCount: number
  ) {
    const documentDefinition: any = {
      content: [
        { text: 'Complete Infant Immunization Report', style: 'header' },
        {
          text: 'This document provides an overview of the immunization status among children within Barangay Bangad, including the counts for fully vaccinated, partially vaccinated, and not vaccinated children.',
          alignment: 'justify',
          margin: [0, 10, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [
                { text: 'Immunization Status', style: 'tableHeader' },
                { text: 'Count', style: 'tableHeader' },
              ],
              ['Fully Vaccinated', fullyVaccinatedCount.toString()],
              ['Partially Vaccinated', partiallyVaccinatedCount.toString()],
              ['Not Vaccinated', notVaccinatedCount.toString()],
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}

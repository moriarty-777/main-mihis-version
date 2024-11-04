import { Component, inject, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { Child } from '../../../shared/models/child';
import { ChildService } from '../../../services/child.service';
import { ChartsGenderComponent } from '../../charts/charts-gender/charts-gender.component';
import { ChartsPurokComponent } from '../../charts/charts-purok/charts-purok.component';
import { ChartsCompleteImmunizationComponent } from '../../charts/charts-complete-immunization/charts-complete-immunization.component';
import { ChartsMissedVaccineReasonComponent } from '../../charts/charts-missed-vaccine-reason/charts-missed-vaccine-reason.component';
import { ChartsCoverageHeatmapPurokComponent } from '../../charts/charts-coverage-heatmap-purok/charts-coverage-heatmap-purok.component';
import { CommonModule } from '@angular/common';
import { AnalyticReportsService } from '../../../services/analytic-reports.service';
import { ChartsImmunizationCoverageComponent } from '../../charts/charts-immunization-coverage/charts-immunization-coverage.component';
import { ChartsWeightForAgeComponent } from '../../charts/charts-weight-for-age/charts-weight-for-age.component';
import { ChartsHeightForAgeComponent } from '../../charts/charts-height-for-age/charts-height-for-age.component';
import { ChartsWeightForHeightComponent } from '../../charts/charts-weight-for-height/charts-weight-for-height.component';
import { PdfGenerationService } from '../../../services/pdf-generation.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    ChartsGenderComponent,
    ChartsPurokComponent,
    ChartsCompleteImmunizationComponent,
    ChartsMissedVaccineReasonComponent,
    ChartsCoverageHeatmapPurokComponent,
    ChartsImmunizationCoverageComponent,
    ChartsWeightForAgeComponent,
    ChartsHeightForAgeComponent,
    ChartsWeightForHeightComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent {
  private childService = inject(ChildService);
  private analyticReportsService = inject(AnalyticReportsService);
  private pdfService = inject(PdfGenerationService);
  maleCount: number = 0;
  femaleCount: number = 0;

  fullyVaccinatedCount: number = 0;
  partiallyVaccinatedCount: number = 0;
  notVaccinatedCount: number = 0;

  // Text to hold the immunization report summary
  vaccinationSummaryText: string = '';

  vaccineDoses: {
    vaccineName: string;
    doseNumber: number;
    maleCount: number;
    femaleCount: number;
    totalCount: number;
  }[] = [];

  purokLabels: string[] = []; // Dynamic labels for Purok
  purokData: number[] = []; // Dynamic data for Purok

  missedVaccineReasons: { label: string; value: number }[] = [];
  mostCommonReason: string = '';
  mostCommonReasonCount: number = 0;

  // Analytics
  weightForAgeData: { [key: string]: number } = {};
  heightForAgeData: { [key: string]: number } = {};
  weightForHeightData: { [key: string]: number } = {};

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // FILETER TODO:
  // FILETER TODO:
  // FILETER TODO:

  availableYears: number[] = [];
  selectedTimeframe: string = '24h';
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  // Add a new property to manage default year and month
  defaultYear: number | null = new Date().getFullYear();
  defaultMonth: number | null = null;
  // Function to reset filters
  resetFilters() {
    this.selectedYear = this.defaultYear;
    this.selectedMonth = this.defaultMonth;
  }

  initializeAvailableYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2017; year--) {
      this.availableYears.push(year);
    }
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.target.value
      ? parseInt(event.target.value)
      : null;
    this.applyFilters();
  }

  onYearChange(event: any) {
    this.selectedYear = event.target.value
      ? parseInt(event.target.value)
      : null;
    this.applyFilters();
  }

  applyFilters() {
    let startDate: Date | undefined = undefined;
    let endDate: Date | undefined = new Date();

    if (this.selectedYear || this.selectedMonth !== null) {
      startDate = new Date(
        this.selectedYear ?? endDate.getFullYear(),
        this.selectedMonth ?? 0,
        1
      );
      endDate =
        this.selectedMonth !== null
          ? new Date(
              this.selectedYear ?? endDate.getFullYear(),
              (this.selectedMonth ?? 0) + 1,
              0
            )
          : new Date(this.selectedYear ?? endDate.getFullYear(), 11, 31);
    }
  }
  // FILETER TODO:
  // FILETER TODO:
  // FILETER TODO:

  ngOnInit() {
    this.loadChildren(); // Fetch data on initialization
    this.loadVaccinationSummary(); // Fetch immunization data
    this.loadVaccineDoseCounts();
    this.fetchAnthropometricStatusData();
    this.fetchWeightForHeightData();
    this.fetchHeightForAgeData(); // Ensure th
    this.loadMissedVaccineData();
    // FILter
    this.initializeAvailableYears();

    // this.loadMissedVaccineData(); // Fetch missed vaccine data
    // this.loadCoveragePurok();
  }

  // Weight for height
  fetchWeightForHeightData() {
    this.analyticReportsService.getWeightForHeightCounts().subscribe((data) => {
      const aggregatedData: { [key: string]: number } = {};

      data.forEach((item: { weightForHeight: string; count: number }) => {
        if (item.weightForHeight) {
          aggregatedData[item.weightForHeight] = item.count;
        } else {
          console.warn('Missing weightForHeight value in item:', item);
        }
      });

      this.weightForHeightData = aggregatedData;
      console.log('Final Weight for Height Data:', this.weightForHeightData);
      this.updateChartDataForWeightForHeight();
    });
  }

  updateChartDataForWeightForHeight() {
    if (this.chart) {
      this.chart.update();
    }
  }

  // WEgiht for age
  fetchAnthropometricStatusData() {
    this.analyticReportsService
      .getAnthropometricStatusCounts()
      .subscribe((data) => {
        // Transform the data to aggregate `weightForAge` values across all children
        const aggregatedData: { [key: string]: number } = {};

        data.forEach((item: { weightForAge: string; count: number }) => {
          if (aggregatedData[item.weightForAge]) {
            aggregatedData[item.weightForAge] += item.count;
          } else {
            aggregatedData[item.weightForAge] = item.count;
          }
        });

        // Set the transformed data to the chart input
        this.weightForAgeData = aggregatedData;

        // Log the transformed data for verification
        console.log('Aggregated Weight for Age Data:', this.weightForAgeData);

        // Manually trigger chart update in child component
        this.updateChartDataForChild();
      });
  }

  // Manually call chart update in the child component
  updateChartDataForChild() {
    if (this.chart) {
      this.chart.update();
    }
  }

  // Weight for age

  // height for age
  fetchHeightForAgeData() {
    this.analyticReportsService.getHeightForAgeCounts().subscribe((data) => {
      const aggregatedData: { [key: string]: number } = {};

      data.forEach((item: { heightForAge: string; count: number }) => {
        aggregatedData[item.heightForAge] = item.count;
      });

      this.heightForAgeData = aggregatedData;

      console.log('Aggregated Height for Age Data:', this.heightForAgeData);

      // Trigger chart update if necessary
      this.updateChartDataForHeightForAge();
    });
  }

  // Method to update height for age chart specifically
  updateChartDataForHeightForAge() {
    if (this.chart) {
      this.chart.update();
    }
  }
  // height for age

  loadMissedVaccineData() {
    this.analyticReportsService.getMissedVaccineReport().subscribe(
      (data: any[]) => {
        // Log the response data structure to understand the fields
        // console.log('Raw Missed Vaccine Report Data:', data);

        // Initialize a map to count occurrences of each reason
        const reasonCounts = new Map<string, number>();

        // Iterate through each child and their missed vaccines to count reasons
        data.forEach((child) => {
          child.missedVaccines.forEach((vaccine: any) => {
            const reason = vaccine.reason || 'Unknown Reason';
            reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
          });
        });

        // Transform the map to the expected array format for charting
        this.missedVaccineReasons = Array.from(
          reasonCounts,
          ([label, value]) => ({
            label,
            value,
          })
        );

        // Determine the most common reason
        const mostCommon = this.missedVaccineReasons.reduce(
          (prev, current) => (current.value > prev.value ? current : prev),
          { label: '', value: 0 }
        );

        this.mostCommonReason = mostCommon.label;
        this.mostCommonReasonCount = mostCommon.value;

        // console.log(
        //   'Transformed Missed Vaccine Reasons:',
        //   this.missedVaccineReasons
        // );
      },
      (error) => {
        console.error('Failed to load missed vaccine report', error);
      }
    );
  }

  loadVaccineDoseCounts(): void {
    this.analyticReportsService.getVaccineDoseCounts().subscribe(
      (data) => {
        // Assuming data from backend already has maleCount, femaleCount, and totalCount
        this.vaccineDoses = data.map((dose) => ({
          vaccineName: dose.vaccineName,
          doseNumber: dose.doseNumber,
          maleCount: dose.maleCount || 0,
          femaleCount: dose.femaleCount || 0,
          totalCount: dose.totalCount || 0,
        }));

        // console.log('Transformed Vaccine Doses:', this.vaccineDoses);
      },
      (error) => {
        console.error('Failed to load vaccine dose counts', error);
      }
    );
  }

  loadCoveragePurok() {
    // Hardcoded data for now, you can replace this with an API call once the database is set up
    // console.log('Missed Vaccine Data:', this.missedVaccineReasons); // Debugging
  }

  loadChildren() {
    this.childService.getAll().subscribe((children: Child[]) => {
      // Gender counts
      this.maleCount = children.filter(
        (child) => child.gender === 'Male'
      ).length;
      this.femaleCount = children.filter(
        (child) => child.gender === 'Female'
      ).length;

      // Purok counts
      const purokCountMap: { [key: string]: number } = {};

      children.forEach((child) => {
        const purok = `Purok ${child.purok}`; // Ensure "Purok" prefix is added
        if (purokCountMap[purok]) {
          purokCountMap[purok]++;
        } else {
          purokCountMap[purok] = 1;
        }
      });
      // Extract labels and data for the Purok chart
      this.purokLabels = Object.keys(purokCountMap) // Labels: Purok 1, Purok 2, etc.
        .sort((a, b) => {
          // Extract numerical parts and sort numerically
          const numA = parseInt(a.replace('Purok ', ''));
          const numB = parseInt(b.replace('Purok ', ''));
          return numA - numB;
        });

      this.purokData = this.purokLabels.map((label) => purokCountMap[label]);
    });
  }

  loadVaccinationSummary() {
    this.childService.getVaccinationSummary().subscribe((summary) => {
      this.fullyVaccinatedCount = summary.fullyVaccinatedCount;
      this.partiallyVaccinatedCount = summary.partiallyVaccinatedCount;
      this.notVaccinatedCount = summary.notVaccinatedCount;
    });
  }

  // Malnourishme nt Data (Hardcoded)
  malnourishmentData: { label: string; value: number }[] = [
    { label: 'Normal', value: 70 },
    { label: 'Malnourished', value: 30 },
  ];

  // Chart data for malnourishment and normal status
  malnourishmentChartData: ChartData<'bar'> = {
    labels: ['Normal', 'Malnourished'],
    datasets: [
      {
        data: this.getMalnourishmentData(), // Retrieve malnourishment data
        backgroundColor: ['#4CAF50', '#FF5722'], // Green for Normal, Red for Malnourished
        hoverBackgroundColor: ['#388E3C', '#E64A19'],
        borderWidth: 1,
        label: 'Nutritional Status',
      },
    ],
  };

  // Helper method to retrieve malnourishment data
  getMalnourishmentData() {
    return this.malnourishmentData.map((status) => status.value);
  }

  // TODO:
  // generateMissedVaccinePdf() {
  //   const year = this.selectedYear ? this.selectedYear.toString() : '';
  //   const month =
  //     this.selectedMonth !== null
  //       ? new Date(0, this.selectedMonth).toLocaleString('default', {
  //           month: 'long',
  //         })
  //       : '';

  //   this.analyticReportsService
  //     .getMissedVaccineReport() // Pass start and end dates
  //     .subscribe((data: any[]) => {
  //       this.pdfService.generateMissedVaccineReportPdf(data, year, month);
  //     });
  // }

  generateMissedVaccinePdf() {
    this.analyticReportsService
      .getMissedVaccineReport()
      .subscribe((data: any[]) => {
        this.pdfService.generateMissedVaccineReportPdf(data);
      });
  }

  generateAdministeredVaccinesPdf() {
    this.pdfService.generateAdministeredVaccinesPdf(this.vaccineDoses);
  }
  generateWeightForAgePdf() {
    this.pdfService.generateWeightForAgePdf(this.weightForAgeData);
  }
  generateHeightForAgePdf() {
    this.pdfService.generateHeightForAgePdf(this.heightForAgeData);
  }
  generateWeightForHeightPdf() {
    this.pdfService.generateWeightForHeightPdf(this.weightForHeightData);
  }
}

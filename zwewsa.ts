/* I've got this code for weight for length z score threshold, weight for age z score threshold and length for age z score threshold and their computation logic

1 Weight for Length Status
export class NutritionalStatusCalcComponent {
  classification: any;
 private zScoreThresholds: any = {
    female: {
      '0-24': {
        '-3SD': [
        ],
        '-2SD': [
        ],
        Median: [
        ],
        '+2SD': [
        ],
        '+3SD': [
        ],
      },
      '24-60': {
        '-3SD': [
        ],
        '-2SD': [
        ],
        Median: [
        ],
        '+2SD': [
        ],
        '+3SD': [
        ],
      },
    },
    male: {
      '0-24': {
        '-3SD': [
        ],
        '-2SD': [
        ],
        Median: [
        ],
        '+2SD': [
        ],
        '+3SD': [
        ],
      },
      '24-60': {
        '-3SD': [
        ],
        '-2SD': [
        ],
        Median: [
        ],
        '+2SD': [
        ],
        '+3SD': [
        ],
      },
    },
  };

  code logic for weight for length 
    private getInterpolatedThreshold(zScores: number[], length: number): number {
    const lengthIndex = Math.floor(length);
    const remainder = length - lengthIndex;

    if (lengthIndex < 0 || lengthIndex >= zScores.length - 1) {
      return zScores[lengthIndex]; // If out of bounds, return the closest index
    }

    const lowerValue = zScores[lengthIndex];
    const upperValue = zScores[lengthIndex + 1];
    console.log(zScores);
    // Interpolate between two closest values if there's a decimal remainder
    return lowerValue + remainder * (upperValue - lowerValue);
  }

  getWeightForLengthStatus(
    gender: 'male' | 'female',
    ageInMonths: number,
    weight: number,
    length: number
  ): string {
    const thresholds = this.zScoreThresholds[gender];
    let group: '0-24' | '24-60' = ageInMonths <= 24 ? '0-24' : '24-60';

    if (length < 45 || length > 120) {
      return 'Length out of range'; // Adjust according to the dataset range
    }

    const thresholdValues = {
      '-3SD': this.getInterpolatedThreshold(thresholds[group]['-3SD'], length),
      '-2SD': this.getInterpolatedThreshold(thresholds[group]['-2SD'], length),
      '+2SD': this.getInterpolatedThreshold(thresholds[group]['+2SD'], length),
      '+3SD': this.getInterpolatedThreshold(thresholds[group]['+3SD'], length),
    };

    if (weight < thresholdValues['-3SD']) {
      return 'Severely Wasted';
    } else if (
      weight >= thresholdValues['-3SD'] &&
      weight < thresholdValues['-2SD']
    ) {
      return 'Wasted';
    } else if (
      weight >= thresholdValues['-2SD'] &&
      weight <= thresholdValues['+2SD']
    ) {
      return 'Normal';
    } else if (
      weight > thresholdValues['+2SD'] &&
      weight <= thresholdValues['+3SD']
    ) {
      return 'Overweight';
    } else if (weight > thresholdValues['+3SD']) {
      return 'Obese';
    } else {
      return 'Invalid Data';
    }
  }

  ngOnInit(): void {
    this.classification = this.getWeightForLengthStatus('female', 10, 13, 80);
    console.log(this.classification);
  }


  2 Length for Age Status

  // Girls' median values (0-59 months)
  private girlsMedian: number[] = [
    49.1,
  ];


  // Girls' SD values (0-59 months)
  private girlsSD: number[] = [
    2.4,
  ];

  // Boys' median values (0-59 months)
  private boysMedian: number[] = [
    49.9, 
  ];

  // Boys' SD values (0-59 months)
  private boysSD: number[] = [
    2.5, 
  ];

  // Z-score calculation method
  calculateZScore(gender: string, ageInMonths: number, length: number): number {
    let median: number;
    let sd: number;

    if (gender === 'female') {
      median = this.girlsMedian[ageInMonths];
      sd = this.girlsSD[ageInMonths];
    } else {
      median = this.boysMedian[ageInMonths];
      sd = this.boysSD[ageInMonths];
    }

    // Z-score formula
    return (length - median) / sd;
  }

  // Classification based on Z-score
  classifyLengthForAge(
    gender: string,
    ageInMonths: number,
    length: number
  ): string {
    const zScore = this.calculateZScore(gender, ageInMonths, length);

    if (zScore <= -3) {
      return 'Severely Stunted';
    } else if (zScore <= -2) {
      return 'Stunted';
    } else if (zScore >= 2) {
      return 'Tall';
    } else {
      return 'Normal';
    }
  }

  ngOnInit() {
    // gender
    // age in months
    //  height
    this.classification = this.classifyLengthForAge('male', 15, 69);
    console.log(this.classification);
  }

  3 Weight for Age Status

   private boysMedian: number[] = [
    3.3,
  ];

  private boysSD: number[] = [
    0.6,
  ];
  // TODO: NOW
  // Girls' Median and SD (0-59 months)
  private girlsMedian: number[] = [
    3.2, 
  ];

  private girlsSD: number[] = [
    0.5, 
  ];

  calculateZScore(gender: string, ageInMonths: number, weight: number): number {
    const median =
      gender === 'male'
        ? this.boysMedian[ageInMonths]
        : this.girlsMedian[ageInMonths];
    const sd =
      gender === 'male' ? this.boysSD[ageInMonths] : this.girlsSD[ageInMonths];
    return (weight - median) / sd;
  }

  classifyWeightForAge(
    gender: string,
    ageInMonths: number,
    weight: number
  ): string {
    const zScore = this.calculateZScore(gender, ageInMonths, weight);
    if (zScore <= -3) {
      return 'Severely Underweight';
    } else if (zScore <= -2) {
      return 'Underweight';
    } else if (zScore >= 2) {
      return 'Overweight';
    } else {
      return 'Normal';
    }
  }

  // Example usage:
  ngOnInit() {
    const classification = this.classifyWeightForAge('male', 34, 27);
    console.log(classification); // Output: 'Normal'
  }
}
*/

import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MotherService } from '../../../services/mother.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-add-child',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup-add-child.component.html',
  styleUrl: './popup-add-child.component.css',
})
export class PopupAddChildComponent {
  addChildForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private motherService: MotherService,
    public dialogRef: MatDialogRef<PopupAddChildComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { motherId: string }
  ) {
    this.addChildForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      photoPath: ['assets/img/child-default.jpg', [Validators.required]],
      purok: ['', [Validators.required]], // Add purok
      barangay: ['', [Validators.required]], // Add barangay
    });
  }

  get firstName() {
    return this.addChildForm.get('firstName');
  }

  get lastName() {
    return this.addChildForm.get('lastName');
  }

  get dateOfBirth() {
    return this.addChildForm.get('dateOfBirth');
  }

  get gender() {
    return this.addChildForm.get('gender');
  }

  get photoPath() {
    return this.addChildForm.get('photoPath');
  }

  get purok() {
    return this.addChildForm.get('purok');
  }

  get barangay() {
    return this.addChildForm.get('barangay');
  }

  addChild() {
    if (this.addChildForm.valid) {
      const newChild = this.addChildForm.value;
      newChild.motherId = this.data.motherId; // Link child to mother

      this.motherService.addChild(newChild).subscribe((response) => {
        this.dialogRef.close(response);
      });
    }
  }

  // formatDate(date: string | Date): string {
  //   const d = new Date(date);
  //   const year = d.getFullYear();
  //   const month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure two digits
  //   const day = ('0' + d.getDate()).slice(-2); // Ensure two digits
  //   return `${year}-${month}-${day}`;
  // }
}

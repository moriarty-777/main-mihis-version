import { CommonModule } from '@angular/common';
import { LoadingService } from './../../../services/loading.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  isLoading!: boolean;

  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    // this.loadingService.showLoading();
  }
}

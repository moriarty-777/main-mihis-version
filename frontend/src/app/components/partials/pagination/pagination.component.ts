import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnInit {
  @Input() totalItems: any;
  @Input() currentPage: any;
  @Input() itemsPerPage: any;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  totalPages = 0;
  pages: number[] = [];

  ngOnInit(): void {
    if (this.totalItems) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['totalItems'] || changes['itemsPerPage']) {
  //     this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  //     this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  //   }
  // }

  pageClicked(page: number) {
    if (page > this.totalPages) return;
    this.onClick.emit(page);
  }
}

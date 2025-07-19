import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Pager } from '../../interface/pager';
import { AppService } from '../../service/aap-service.service';

@Component({
  selector: 'app-pager',
  standalone: false,

  templateUrl: './pager.component.html',
  styleUrl: './pager.component.css',
})
export class PagerComponent implements OnInit, OnChanges {
  dataLoaded: boolean = false;

  @Input() pager!: Pager;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[] = [];

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.dataLoaded = false;

    this.appService.currentPager$.subscribe((pager) => {
      this.pager = pager;
      this.calculatePages();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pager']) {
      this.calculatePages();
    }
  }

  calculatePages() {
    const totalPages = Math.ceil(this.pager.totalRecords / this.pager.pageSize);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    if (this.pages.length > 0) this.dataLoaded = true;
    else this.dataLoaded = false;
  }

  goToPage(page: number) {
    this.pageChange.emit(page);
  }
}

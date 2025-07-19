import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Pager } from '../interface/pager';
import { constants } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private pagerSource: BehaviorSubject<Pager>;
  currentPager$: Observable<Pager>;

  constructor() {
    const initialPager: Pager = {
      starRow: constants.starRow,
      endRow: constants.endRow,
      pageSize: constants.pageSize,
      pageNumber: constants.pageNumber,
      totalRecords: constants.totalRecords,
      pages: [],
    };

    this.pagerSource = new BehaviorSubject<Pager>(initialPager);
    this.currentPager$ = this.pagerSource.asObservable();
  }

  setPager(pager: Pager) {
    this.pagerSource.next(pager);
  }
}

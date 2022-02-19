import { Component, Input } from '@angular/core';
import { catchError, map, take } from 'rxjs/operators';
import { SalaryDetailsModel } from '@app/salary/model/salary-details.model';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.scss'],
})
export class SalaryDetailsComponent {
  @Input() netSalary: number;
  @Input() netSalary2021: number;
  @Input() salaryDetails: SalaryDetailsModel[];
  @Input() salaryDetailsPaidEmployer: SalaryDetailsModel[];

  // from https://github.com/fawazahmed0/currency-api
  salaries$ = this.httpClient
    .get('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/czk.json')
    .pipe(
      take(1),
      map((data) => ({
        eurSalary: this.netSalary * _.get(data, 'czk.eur', 1),
        usdSalary: this.netSalary * _.get(data, 'czk.usd', 1),
        gbpSalary: this.netSalary * _.get(data, 'czk.gbp', 1),
      })),
      catchError(() => of('Error, could not load conversion :-('))
    );

  constructor(private httpClient: HttpClient) {}
}

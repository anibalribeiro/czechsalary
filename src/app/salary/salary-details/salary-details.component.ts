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
  @Input() netSalary2020: number;
  @Input() salaryDetails: SalaryDetailsModel[];
  @Input() salaryDetailsPaidEmployer: SalaryDetailsModel[];

  salaries$ = this.httpClient.get('latest?base=CZK&symbols=USD,GBP,EUR').pipe(
    take(1),
    map((data) => ({
      eurSalary: this.netSalary * _.get(data, 'rates.EUR', 1),
      usdSalary: this.netSalary * _.get(data, 'rates.USD', 1),
      gbpSalary: this.netSalary * _.get(data, 'rates.GBP', 1),
    })),
    catchError(() => of('Error, could not load conversion :-('))
  );

  constructor(private httpClient: HttpClient) {}
}

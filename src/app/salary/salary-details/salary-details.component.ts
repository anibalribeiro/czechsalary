import { Component, Input, OnInit } from '@angular/core';
import { catchError, finalize, map, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalaryModel } from '@app/salary/model/salary.model';
import { DisabilityTypeEnum } from '@app/salary/model/disabilityType.enum';
import { SalaryDetailsModel } from '@app/salary/model/salary-details.model';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.scss'],
})
export class SalaryDetailsComponent implements OnInit {
  @Input() netSalary: number;
  @Input() netSalary2020: number;
  @Input() salaryDetails: SalaryDetailsModel[];

  netSalaryEur: number;
  netSalaryUsd: number;
  netSalaryGbp: number;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient
      .get('latest?base=CZK&symbols=USD,GBP,EUR')
      .pipe(
        take(1),
        catchError(() => of('Error, could not load joke :-('))
      )
      .subscribe((data) => {
        this.netSalaryEur = this.netSalary * _.get(data, 'rates.EUR', 1);
        this.netSalaryUsd = this.netSalary * _.get(data, 'rates.USD', 1);
        this.netSalaryGbp = this.netSalary * _.get(data, 'rates.GBP', 1);
      });
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalaryModel } from '@app/salary/model/salary.model';
import { DisabilityTypeEnum } from '@app/salary/model/disabilityType.enum';
import { SalaryDetailsModel } from '@app/salary/model/salary-details.model';
import { TaxTypeEnum } from '@app/salary/model/taxType.enum';
import { TaxYear } from '@app/salary/model/taxYear.enum';
import SalaryCalculation from '@app/salary/salary-calculation';

@Component({
  selector: 'salary-form',
  templateUrl: './salary-form.component.html',
  styleUrls: ['./salary-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalaryFormComponent implements OnInit {
  salaryForm: FormGroup;
  salary: SalaryModel;
  netSalary: number;
  netSalary2021: number;
  salaryDetails: SalaryDetailsModel[];
  salaryDetailsPaidByEmployer: SalaryDetailsModel[];

  isLoading = false;

  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const savedFormSalary = JSON.parse(localStorage.getItem('salaryForm'));
    const savedNetSalary2022 = JSON.parse(localStorage.getItem('netSalary2022'));
    const savedNetSalary2021 = JSON.parse(localStorage.getItem('netSalary2021'));
    const savedSalaryDetails = JSON.parse(localStorage.getItem('salaryDetails'));
    const savedSalaryDetailsPaidByEmployer = JSON.parse(localStorage.getItem('salaryDetailsPaidByEmployer'));

    if (savedNetSalary2022 && savedSalaryDetails) {
      this.netSalary = savedNetSalary2022;
      this.netSalary2021 = savedNetSalary2021;
      this.salaryDetails = savedSalaryDetails;
      this.salaryDetailsPaidByEmployer = savedSalaryDetailsPaidByEmployer;
    }

    this.salaryForm = this.formBuilder.group({
      salary: [savedFormSalary ? savedFormSalary.salary : null, Validators.required],
      student: [savedFormSalary ? savedFormSalary.student : false, Validators.required],
      numberOfKids: [savedFormSalary ? savedFormSalary.numberOfKids : 0, Validators.required],
      disabilityType: [savedFormSalary ? savedFormSalary.disabilityType : DisabilityTypeEnum.NONE, Validators.required],
      ztp: [savedFormSalary ? savedFormSalary.ztp : false, Validators.required],
      hasCar: [savedFormSalary ? savedFormSalary.hasCar : false, Validators.required],
      priceOfCar: [savedFormSalary ? savedFormSalary.priceOfCar : null],
    });
  }

  get form() {
    return this.salaryForm.controls;
  }

  calculate() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 1000);

    this.salary = {
      salary: this.form.salary.value,
      student: this.form.student.value,
      numberOfKids: this.form.numberOfKids.value,
      disabilityType: this.form.disabilityType.value,
      ztp: this.form.ztp.value,
      hasCar: this.form.hasCar.value,
      priceOfCar: this.form.hasCar.value ? this.form.priceOfCar.value : 0,
    };
    this.netSalary = SalaryCalculation.getNetSalary(this.salary, TaxYear.Current);
    this.netSalary2021 = SalaryCalculation.getNetSalary(this.salary, TaxYear.Previous);
    this.salaryDetails = this.buildSalaryDetails(this.salary);
    this.salaryDetailsPaidByEmployer = this.buildSalaryDetailsPaidByEmployer(this.salary);

    this.saveDataInLocalStorage();
  }

  buildSalaryDetails(salary: SalaryModel): SalaryDetailsModel[] {
    return [
      {
        taxName: TaxTypeEnum.HEALTH_INSURANCE_PAID_EMPLOYEE,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.HEALTH_INSURANCE_PAID_EMPLOYEE',
        amount: SalaryCalculation.getHealthInsurancePaidByEmployee(salary),
      },
      {
        taxName: TaxTypeEnum.SOCIAL_INSURANCE_PAID_EMPLOYEE,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.SOCIAL_INSURANCE_PAID_EMPLOYEE',
        amount: SalaryCalculation.getSocialInsurancePaidByEmployee(salary),
      },
      {
        taxName: TaxTypeEnum.PERSONAL_INCOME_TAX,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.PERSONAL_INCOME_TAX',
        amount: SalaryCalculation.getPersonalIncomeTax(salary, TaxYear.Current),
      },
      {
        taxName: TaxTypeEnum.TAX_CREDITS,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.TAX_CREDITS',
        amount: SalaryCalculation.getTaxCredit(TaxYear.Current),
      },
      {
        taxName: TaxTypeEnum.TAX_BENEFITS,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.TAX_BENEFITS',
        amount: SalaryCalculation.getTaxBenefits(salary, TaxYear.Current),
      },
    ];
  }

  buildSalaryDetailsPaidByEmployer(salary: SalaryModel): SalaryDetailsModel[] {
    return [
      {
        taxName: TaxTypeEnum.TOTAL_COST_FOR_EMPLOYER,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.TOTAL_COST_FOR_EMPLOYER',
        amount: SalaryCalculation.getTotalCostByEmployer(salary),
      },
      {
        taxName: TaxTypeEnum.HEALTH_INSURANCE_PAID_EMPLOYER,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.HEALTH_INSURANCE_PAID_EMPLOYER',
        amount: SalaryCalculation.getHealthInsurancePaidByEmployer(salary),
      },
      {
        taxName: TaxTypeEnum.SOCIAL_INSURANCE_PAID_EMPLOYER,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.SOCIAL_INSURANCE_PAID_EMPLOYER',
        amount: SalaryCalculation.getSocialInsurancePaidByEmployer(salary),
      },
    ];
  }

  private saveDataInLocalStorage() {
    localStorage.setItem('salaryForm', JSON.stringify(this.salary));
    localStorage.setItem('netSalary2022', JSON.stringify(this.netSalary));
    localStorage.setItem('netSalary2021', JSON.stringify(this.netSalary2021));
    localStorage.setItem('salaryDetails', JSON.stringify(this.salaryDetails));
    localStorage.setItem('salaryDetailsPaidByEmployer', JSON.stringify(this.salaryDetailsPaidByEmployer));
  }
}

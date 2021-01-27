import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalaryModel } from '@app/salary/model/salary.model';
import { DisabilityTypeEnum } from '@app/salary/model/disabilityType.enum';
import { SalaryDetailsModel } from '@app/salary/model/salary-details.model';
import { TaxTypeEnum } from '@app/salary/model/taxType.enum';
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
  netSalary2020: number;
  salaryDetails: SalaryDetailsModel[];
  salaryDetailsPaidByEmployer: SalaryDetailsModel[];

  isLoading = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    const savedFormSalary = JSON.parse(localStorage.getItem('salaryForm'));
    const savedNetSalary = JSON.parse(localStorage.getItem('netSalary'));
    const savedNetSalary2020 = JSON.parse(localStorage.getItem('netSalary2020'));
    const savedSalaryDetails = JSON.parse(localStorage.getItem('salaryDetails'));
    const savedSalaryDetailsPaidByEmployer = JSON.parse(localStorage.getItem('salaryDetailsPaidByEmployer'));

    if (savedNetSalary && savedSalaryDetails) {
      this.netSalary = savedNetSalary;
      this.netSalary2020 = savedNetSalary2020;
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
    }, 1500);

    this.salary = {
      salary: this.form.salary.value,
      student: this.form.student.value,
      numberOfKids: this.form.numberOfKids.value,
      disabilityType: this.form.disabilityType.value,
      ztp: this.form.ztp.value,
      hasCar: this.form.hasCar.value,
      priceOfCar: this.form.hasCar.value ? this.form.priceOfCar.value : 0,
    };
    this.netSalary = SalaryCalculation.getNetSalary(this.salary);
    this.netSalary2020 = SalaryCalculation.getNetSalaryFrom2020(this.salary);
    this.salaryDetails = this.buildSalaryDetails(this.salary);
    this.salaryDetailsPaidByEmployer = this.buildSalaryDetailsPaidByEmployer(this.salary);

    this.saveDataInLocalStorage();
  }

  buildSalaryDetails(salary: SalaryModel): SalaryDetailsModel[] {
    return [
      {
        taxName: TaxTypeEnum.HEALTH_INSURANCE_PAID_EMPLOYEE,
        amount: SalaryCalculation.getHealthInsurancePaidByEmployee(salary),
      },
      {
        taxName: TaxTypeEnum.SOCIAL_INSURANCE_PAID_EMPLOYEE,
        amount: SalaryCalculation.getSocialInsurancePaidByEmployee(salary),
      },
      {
        taxName: TaxTypeEnum.PERSONAL_INCOME_TAX,
        amount: SalaryCalculation.getPersonalIncomeTax(salary),
      },
      {
        taxName: TaxTypeEnum.TAX_CREDITS,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.TAX_CREDITS',
        amount: SalaryCalculation.getTaxCredit(),
      },
      {
        taxName: TaxTypeEnum.TAX_BENEFITS,
        toolTip: 'SALARY_DETAILS.TOOLTIPS.TAX_BENEFITS',
        amount: SalaryCalculation.getTaxBenefits(salary),
      },
    ];
  }

  buildSalaryDetailsPaidByEmployer(salary: SalaryModel): SalaryDetailsModel[] {
    return [
      {
        taxName: TaxTypeEnum.TOTAL_COST_FOR_EMPLOYER,
        amount: SalaryCalculation.getTotalCostByEmployer(salary),
      },
      {
        taxName: TaxTypeEnum.HEALTH_INSURANCE_PAID_EMPLOYER,
        amount: SalaryCalculation.getHealthInsurancePaidByEmployer(salary),
      },
      {
        taxName: TaxTypeEnum.SOCIAL_INSURANCE_PAID_EMPLOYER,
        amount: SalaryCalculation.getSocialInsurancePaidByEmployer(salary),
      },
    ];
  }

  private saveDataInLocalStorage() {
    localStorage.setItem('salaryForm', JSON.stringify(this.salary));
    localStorage.setItem('netSalary', JSON.stringify(this.netSalary));
    localStorage.setItem('netSalary2020', JSON.stringify(this.netSalary2020));
    localStorage.setItem('salaryDetails', JSON.stringify(this.salaryDetails));
    localStorage.setItem('salaryDetailsPaidByEmployer', JSON.stringify(this.salaryDetailsPaidByEmployer));
  }
}

import { SalaryModel } from '@app/salary/model/salary.model';
import { DisabilityTypeEnum } from '@app/salary/model/disabilityType.enum';
import { TaxYear } from '@app/salary/model/taxYear.enum';

export default class SalaryCalculation {
  static AVERAGE_SALARY_TIMES_4_PREV = 141764;
  static AVERAGE_SALARY_TIMES_4_CURR = 155644;
  static TAX_CREDIT_PREV = 2320;
  static TAX_CREDIT_CURR = 2570;

  static HEALTH_INSURANCE = 0.045;
  static SOCIAL_INSURANCE = 0.065;
  static PERSONAL_INCOME_TAX_15 = 0.15;
  static PERSONAL_INCOME_TAX_23 = 0.23;

  static HEALTH_INSURANCE_EMPLOYER = 0.09;
  static SOCIAL_INSURANCE_EMPLOYER = 0.248;

  static CAR_TAX = 0.01;

  // BENEFITS
  static STUDENT = 335;
  static ZTP = 1345;
  static FIRST_SECOND_DEGREE = 210;
  static THIRD_DEGREE = 420;

  static ONE_KID = 1267;
  static TWO_KIDS_PREV = 2884;
  static TWO_KIDS_CURR = 3127;
  static THREE_KIDS_PREV = 4901;
  static THREE_KIDS_CURR = 5447;
  static FOUR_KIDS_PREV = 6918;
  static FOUR_KIDS_CURR = 7767;

  static getNetSalary(salaryModel: SalaryModel, taxYear: TaxYear): number {
    return (
      salaryModel.salary -
      this.getPersonalIncomeTax(salaryModel, taxYear) +
      this.getTaxCredit(taxYear) +
      this.getTaxBenefits(salaryModel, taxYear) -
      this.getHealthInsurancePaidByEmployee(salaryModel) -
      this.getSocialInsurancePaidByEmployee(salaryModel)
    );
  }

  static getPersonalIncomeTax(salaryModel: SalaryModel, taxYear: TaxYear): number {
    const salaryThreshold =
      taxYear === TaxYear.Current ? this.AVERAGE_SALARY_TIMES_4_CURR : this.AVERAGE_SALARY_TIMES_4_PREV;
    if (salaryModel.salary < salaryThreshold) {
      return this.getGrossSalaryWithCar(salaryModel) * this.PERSONAL_INCOME_TAX_15;
    } else {
      return (
        (salaryModel.salary - salaryThreshold) * this.PERSONAL_INCOME_TAX_23 +
        salaryThreshold * this.PERSONAL_INCOME_TAX_15 +
        this.getCarPrice(salaryModel) * this.PERSONAL_INCOME_TAX_15
      );
    }
  }

  static getTaxCredit(taxYear: TaxYear): number {
    return taxYear === TaxYear.Current ? this.TAX_CREDIT_CURR : this.TAX_CREDIT_PREV;
  }

  static getHealthInsurancePaidByEmployee(salaryModel: SalaryModel): number {
    return this.getGrossSalaryWithCar(salaryModel) * this.HEALTH_INSURANCE;
  }

  static getSocialInsurancePaidByEmployee(salaryModel: SalaryModel): number {
    return this.getGrossSalaryWithCar(salaryModel) * this.SOCIAL_INSURANCE;
  }

  static getGrossSalaryWithCar(salaryModel: SalaryModel): number {
    if (salaryModel.hasCar && salaryModel.priceOfCar) {
      return salaryModel.salary + this.getCarPrice(salaryModel);
    }
    return salaryModel.salary;
  }

  static getCarPrice(salaryModel: SalaryModel): number {
    if (salaryModel.hasCar && salaryModel.priceOfCar) {
      return salaryModel.priceOfCar * this.CAR_TAX;
    }
    return 0;
  }

  static getTaxBenefits(salaryModel: SalaryModel, taxYear: TaxYear): number {
    let sumBenefits = 0;
    if (salaryModel.student) {
      sumBenefits += this.STUDENT;
    }
    if (salaryModel.ztp) {
      sumBenefits += this.ZTP;
    }
    if (
      salaryModel.disabilityType === DisabilityTypeEnum.FIRST_DEGREE ||
      salaryModel.disabilityType === DisabilityTypeEnum.SECOND_DEGREE
    ) {
      sumBenefits += this.FIRST_SECOND_DEGREE;
    }
    if (salaryModel.disabilityType === DisabilityTypeEnum.THIRD_DEGREE) {
      sumBenefits += this.THIRD_DEGREE;
    }
    switch (salaryModel.numberOfKids) {
      case 1: {
        sumBenefits += this.ONE_KID;
        break;
      }
      case 2: {
        sumBenefits += taxYear === TaxYear.Current ? this.TWO_KIDS_CURR : this.TWO_KIDS_PREV;
        break;
      }
      case 3: {
        sumBenefits += taxYear === TaxYear.Current ? this.THREE_KIDS_CURR : this.THREE_KIDS_PREV;
        break;
      }
      case 4: {
        sumBenefits += taxYear === TaxYear.Current ? this.FOUR_KIDS_CURR : this.FOUR_KIDS_PREV;
        break;
      }
    }
    return sumBenefits;
  }

  static getTotalCostByEmployer(salaryModel: SalaryModel): number {
    return (
      salaryModel.salary +
      this.getSocialInsurancePaidByEmployer(salaryModel) +
      this.getHealthInsurancePaidByEmployer(salaryModel)
    );
  }

  static getHealthInsurancePaidByEmployer(salaryModel: SalaryModel): number {
    return this.getGrossSalaryWithCar(salaryModel) * this.HEALTH_INSURANCE_EMPLOYER;
  }

  static getSocialInsurancePaidByEmployer(salaryModel: SalaryModel): number {
    return this.getGrossSalaryWithCar(salaryModel) * this.SOCIAL_INSURANCE_EMPLOYER;
  }
}

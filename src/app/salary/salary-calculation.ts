import { SalaryModel } from '@app/salary/model/salary.model';
import { DisabilityTypeEnum } from '@app/salary/model/disabilityType.enum';

export default class SalaryCalculation {
  static AVERAGE_SALARY_TIMES_4 = 141764;
  static HEALTH_INSURANCE = 0.045;
  static SOCIAL_INSURANCE = 0.065;
  static PERSONAL_INCOME_TAX_15 = 0.15;
  static PERSONAL_INCOME_TAX_23 = 0.23;
  static TAX_CREDIT = 2320;

  static CAR_TAX = 0.01;

  // BENEFITS
  static STUDENT = 335;
  static ZTP = 1345;
  static FIRST_SECOND_DEGREE = 210;
  static THIRD_DEGREE = 420;
  static ONE_KID = 1267;
  static TWO_KIDS = 2884;
  static THREE_KIDS = 4901;
  static FOUR_KIDS = 6918;

  static getGrossSalaryWithCar(salaryModel: SalaryModel): number {
    if (salaryModel.hasCar && salaryModel.priceOfCar) {
      return salaryModel.salary + salaryModel.priceOfCar * this.CAR_TAX;
    }
    return salaryModel.salary;
  }

  static getHealthInsurancePaidByEmployee(salaryModel: SalaryModel): number {
    return this.getGrossSalaryWithCar(salaryModel) * this.HEALTH_INSURANCE;
  }

  static getSocialInsurancePaidByEmployee(salaryModel: SalaryModel): number {
    return this.getGrossSalaryWithCar(salaryModel) * this.SOCIAL_INSURANCE;
  }

  static getPersonalIncomeTax(salaryModel: SalaryModel): number {
    if (salaryModel.salary < this.AVERAGE_SALARY_TIMES_4) {
      return this.getGrossSalaryWithCar(salaryModel) * this.PERSONAL_INCOME_TAX_15;
    } else {
      return (
        (salaryModel.salary - this.AVERAGE_SALARY_TIMES_4) * this.PERSONAL_INCOME_TAX_23 +
        this.AVERAGE_SALARY_TIMES_4 * this.PERSONAL_INCOME_TAX_15
      );
    }
  }

  static getTaxCredit(): number {
    return this.TAX_CREDIT;
  }

  static getTaxBenefits(salaryModel: SalaryModel): number {
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
        sumBenefits += this.TWO_KIDS;
        break;
      }
      case 3: {
        sumBenefits += this.THREE_KIDS;
        break;
      }
      case 4: {
        sumBenefits += this.FOUR_KIDS;
        break;
      }
    }
    return sumBenefits;
  }

  static getNetSalary(salaryModel: SalaryModel): number {
    return (
      salaryModel.salary -
      this.getHealthInsurancePaidByEmployee(salaryModel) -
      this.getSocialInsurancePaidByEmployee(salaryModel) -
      this.getPersonalIncomeTax(salaryModel) +
      this.getTaxCredit() +
      this.getTaxBenefits(salaryModel)
    );
  }
}

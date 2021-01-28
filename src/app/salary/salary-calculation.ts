import { SalaryModel } from '@app/salary/model/salary.model';
import { DisabilityTypeEnum } from '@app/salary/model/disabilityType.enum';

export default class SalaryCalculation {
  static AVERAGE_SALARY_TIMES_4 = 141764;
  static AVERAGE_SALARY_TIMES_4_2020 = 139340;
  static HEALTH_INSURANCE = 0.045;
  static SOCIAL_INSURANCE = 0.065;
  static PERSONAL_INCOME_TAX_15 = 0.15;
  static PERSONAL_INCOME_TAX_23 = 0.23;
  static TAX_CREDIT = 2320;
  static TAX_CREDIT_2020 = 2070;

  static HEALTH_INSURANCE_EMPLOYER = 0.09;
  static SOCIAL_INSURANCE_EMPLOYER = 0.248;

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
        this.AVERAGE_SALARY_TIMES_4 * this.PERSONAL_INCOME_TAX_15 +
        this.getCarPrice(salaryModel) * this.PERSONAL_INCOME_TAX_15
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

  static getHealthInsurancePaidByEmployer(salaryModel: SalaryModel): number {
    return this.getGrossSalaryWithCar(salaryModel) * this.HEALTH_INSURANCE_EMPLOYER;
  }

  static getSocialInsurancePaidByEmployer(salaryModel: SalaryModel): number {
    return this.getGrossSalaryWithCar(salaryModel) * this.SOCIAL_INSURANCE_EMPLOYER;
  }

  static getTotalCostByEmployer(salaryModel: SalaryModel): number {
    return (
      salaryModel.salary +
      this.getSocialInsurancePaidByEmployer(salaryModel) +
      this.getHealthInsurancePaidByEmployer(salaryModel)
    );
  }

  // CALCULATION OF SALARY OF 2020
  static getSuperGrossSalary(salaryModel: SalaryModel): number {
    return salaryModel.salary * 1.338;
  }

  static getTaxCreditFrom2020(): number {
    return this.TAX_CREDIT_2020;
  }

  static getPersonalIncomeTax2020(salaryModel: SalaryModel, superGross: number): number {
    if (salaryModel.salary + this.getCarPrice(salaryModel) < this.AVERAGE_SALARY_TIMES_4_2020) {
      return this.getGrossSalaryWithCar(salaryModel) * 1.338 * 0.15;
    } else {
      return (
        this.getGrossSalaryWithCar(salaryModel) * 1.338 * 0.15 +
        (this.getGrossSalaryWithCar(salaryModel) - this.AVERAGE_SALARY_TIMES_4_2020) * 0.07
      );
    }
  }

  static getNetSalaryFrom2020(salaryModel: SalaryModel): number {
    const superGross = this.getSuperGrossSalary(salaryModel);
    return (
      salaryModel.salary -
      this.getHealthInsurancePaidByEmployee(salaryModel) -
      this.getSocialInsurancePaidByEmployee(salaryModel) -
      this.getPersonalIncomeTax2020(salaryModel, superGross) +
      this.getTaxCreditFrom2020() +
      this.getTaxBenefits(salaryModel)
    );
  }
}

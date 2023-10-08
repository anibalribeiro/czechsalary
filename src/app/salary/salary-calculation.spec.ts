import { DisabilityTypeEnum } from '@app/salary/model/disabilityType.enum';
import SalaryCalculation from '@app/salary/salary-calculation';
import { TaxYear } from './model/taxYear.enum';

describe('Calculate Salary', () => {
  let salary = {
    salary: 80000,
    student: false,
    numberOfKids: 0,
    disabilityType: DisabilityTypeEnum.NONE,
    ztp: false,
    hasCar: true,
    priceOfCar: 850000,
  };

  test('should calculate net salary', () => {
    expect(SalaryCalculation.getNetSalary(salary, TaxYear.Current)).toEqual(59560);
  });

  test('should calculate gross salary with price of the car included', () => {
    salary.hasCar = true;
    expect(SalaryCalculation.getGrossSalaryWithCar(salary)).toEqual(88500);
    salary.hasCar = false;
    expect(SalaryCalculation.getGrossSalaryWithCar(salary)).toEqual(80000);
  });

  test('should calculate health insurance paid by employee', () => {
    salary.hasCar = true;
    expect(SalaryCalculation.getHealthInsurancePaidByEmployee(salary)).toEqual(3982.5);
    salary.hasCar = false;
    expect(SalaryCalculation.getHealthInsurancePaidByEmployee(salary)).toEqual(3600);
  });

  test('should calculate social insurance paid by employee', () => {
    salary.hasCar = true;
    expect(SalaryCalculation.getSocialInsurancePaidByEmployee(salary)).toEqual(5752.5);
    salary.hasCar = false;
    expect(SalaryCalculation.getSocialInsurancePaidByEmployee(salary)).toEqual(5200);
  });

  test('should calculate personal income tax', () => {
    salary.hasCar = true;
    expect(SalaryCalculation.getPersonalIncomeTax(salary, TaxYear.Current)).toEqual(13275);
    salary.hasCar = false;
    expect(SalaryCalculation.getPersonalIncomeTax(salary, TaxYear.Current)).toEqual(12000);

    salary.salary = 150000;
    salary.hasCar = true;
    expect(SalaryCalculation.getPersonalIncomeTax(salary, TaxYear.Current)).toEqual(23775);
    salary.hasCar = false;
    expect(SalaryCalculation.getPersonalIncomeTax(salary, TaxYear.Current)).toEqual(22500);

    salary.salary = 180000;
    salary.hasCar = true;
    expect(SalaryCalculation.getPersonalIncomeTax(salary, TaxYear.Current)).toEqual(30223.48);
    salary.hasCar = false;
    expect(SalaryCalculation.getPersonalIncomeTax(salary, TaxYear.Current)).toEqual(28948.48);
  });

  test('should get tax credit', () => {
    expect(SalaryCalculation.getTaxCredit(TaxYear.Current)).toEqual(2570);
  });

  test('should calculate tax benefits', () => {
    expect(SalaryCalculation.getTaxBenefits(salary, TaxYear.Current)).toEqual(0);

    salary.student = true;
    expect(SalaryCalculation.getTaxBenefits(salary, TaxYear.Current)).toEqual(335);

    salary.student = false;
    salary.ztp = true;
    expect(SalaryCalculation.getTaxBenefits(salary, TaxYear.Current)).toEqual(1345);

    salary.ztp = false;
    salary.disabilityType = DisabilityTypeEnum.FIRST_DEGREE;
    expect(SalaryCalculation.getTaxBenefits(salary, TaxYear.Current)).toEqual(210);

    salary.disabilityType = DisabilityTypeEnum.THIRD_DEGREE;
    expect(SalaryCalculation.getTaxBenefits(salary, TaxYear.Current)).toEqual(420);

    salary.disabilityType = DisabilityTypeEnum.NONE;
    salary.numberOfKids = 1;
    expect(SalaryCalculation.getTaxBenefits(salary, TaxYear.Current)).toEqual(1267);

    salary.numberOfKids = 4;
    expect(SalaryCalculation.getTaxBenefits(salary, TaxYear.Current)).toEqual(7767);
    salary.numberOfKids = 4;
    expect(SalaryCalculation.getTaxBenefits(salary, TaxYear.Previous)).toEqual(6918);

    salary.numberOfKids = 3;
    salary.disabilityType = DisabilityTypeEnum.FIRST_DEGREE;
    salary.ztp = true;
    salary.student = true;
    expect(SalaryCalculation.getTaxBenefits(salary, TaxYear.Current)).toEqual(7337);
  });

  test('should calculate net salary without car', () => {
    salary = {
      salary: 180000,
      student: false,
      numberOfKids: 0,
      disabilityType: DisabilityTypeEnum.NONE,
      ztp: false,
      hasCar: false,
      priceOfCar: 0,
    };
    expect(SalaryCalculation.getNetSalary(salary, TaxYear.Current)).toEqual(133821.52);
  });

  test('should calculate net salary with car', () => {
    salary = {
      salary: 180000,
      student: false,
      numberOfKids: 0,
      disabilityType: DisabilityTypeEnum.NONE,
      ztp: false,
      hasCar: true,
      priceOfCar: 850000,
    };
    expect(SalaryCalculation.getNetSalary(salary, TaxYear.Current)).toEqual(131611.52);
  });

  test('should calculate net salary from 2021', () => {
    salary = {
      salary: 80000,
      student: false,
      numberOfKids: 0,
      disabilityType: DisabilityTypeEnum.NONE,
      ztp: false,
      hasCar: false,
      priceOfCar: 0,
    };
    expect(SalaryCalculation.getNetSalary(salary, TaxYear.Previous)).toEqual(61520);

    salary.salary = 180000;
    expect(SalaryCalculation.getNetSalary(salary, TaxYear.Previous)).toEqual(132461.12);

    salary.salary = 150000;
    expect(SalaryCalculation.getNetSalary(salary, TaxYear.Previous)).toEqual(112661.12);

    salary.hasCar = true;
    salary.priceOfCar = 850000;
    expect(SalaryCalculation.getNetSalary(salary, TaxYear.Previous)).toEqual(110451.12);

    salary.salary = 80000;
    expect(SalaryCalculation.getNetSalary(salary, TaxYear.Previous)).toEqual(59310);
  });
});

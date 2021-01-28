import { DisabilityTypeEnum } from '@app/salary/model/disabilityType.enum';
import SalaryCalculation from '@app/salary/salary-calculation';

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
    expect(SalaryCalculation.getNetSalary(salary)).toEqual(59310);
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
    expect(SalaryCalculation.getPersonalIncomeTax(salary)).toEqual(13275);
    salary.hasCar = false;
    expect(SalaryCalculation.getPersonalIncomeTax(salary)).toEqual(12000);

    salary.salary = 150000;
    salary.hasCar = true;
    expect(SalaryCalculation.getPersonalIncomeTax(salary)).toEqual(24433.879999999997);
    salary.hasCar = false;
    expect(SalaryCalculation.getPersonalIncomeTax(salary)).toEqual(23158.879999999997);
  });

  test('should get tax credit', () => {
    expect(SalaryCalculation.getTaxCredit()).toEqual(2320);
  });

  test('should calculate tax benefits', () => {
    expect(SalaryCalculation.getTaxBenefits(salary)).toEqual(0);

    salary.student = true;
    expect(SalaryCalculation.getTaxBenefits(salary)).toEqual(335);

    salary.student = false;
    salary.ztp = true;
    expect(SalaryCalculation.getTaxBenefits(salary)).toEqual(1345);

    salary.ztp = false;
    salary.disabilityType = DisabilityTypeEnum.FIRST_DEGREE;
    expect(SalaryCalculation.getTaxBenefits(salary)).toEqual(210);

    salary.disabilityType = DisabilityTypeEnum.THIRD_DEGREE;
    expect(SalaryCalculation.getTaxBenefits(salary)).toEqual(420);

    salary.disabilityType = DisabilityTypeEnum.NONE;
    salary.numberOfKids = 1;
    expect(SalaryCalculation.getTaxBenefits(salary)).toEqual(1267);

    salary.numberOfKids = 4;
    expect(SalaryCalculation.getTaxBenefits(salary)).toEqual(6918);

    salary.numberOfKids = 3;
    salary.disabilityType = DisabilityTypeEnum.FIRST_DEGREE;
    salary.ztp = true;
    salary.student = true;
    expect(SalaryCalculation.getTaxBenefits(salary)).toEqual(6791);
  });

  test('should calculate net salary without car', () => {
    salary = {
      salary: 150000,
      student: false,
      numberOfKids: 0,
      disabilityType: DisabilityTypeEnum.NONE,
      ztp: false,
      hasCar: false,
      priceOfCar: 0,
    };
    expect(SalaryCalculation.getNetSalary(salary)).toEqual(112661.12);
  });

  test('should calculate net salary with car', () => {
    salary = {
      salary: 150000,
      student: false,
      numberOfKids: 0,
      disabilityType: DisabilityTypeEnum.NONE,
      ztp: false,
      hasCar: true,
      priceOfCar: 850000,
    };
    expect(SalaryCalculation.getNetSalary(salary)).toEqual(110451.12);
  });

  test('should calculate net salary from 2020', () => {
    salary = {
      salary: 110000,
      student: false,
      numberOfKids: 0,
      disabilityType: DisabilityTypeEnum.NONE,
      ztp: false,
      hasCar: false,
      priceOfCar: 0,
    };
    expect(SalaryCalculation.getNetSalaryFrom2020(salary)).toEqual(77893);

    salary.salary = 150000;
    expect(SalaryCalculation.getNetSalaryFrom2020(salary)).toEqual(104718.8);

    salary.hasCar = true;
    salary.priceOfCar = 850000;
    expect(SalaryCalculation.getNetSalaryFrom2020(salary)).toEqual(101482.85);

    salary.salary = 80000;
    expect(SalaryCalculation.getNetSalaryFrom2020(salary)).toEqual(54573.05);
  });
});

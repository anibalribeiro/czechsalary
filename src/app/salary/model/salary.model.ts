import { DisabilityTypeEnum } from '@app/salary/model/disabilityType.enum';

export interface SalaryModel {
  salary: number;
  student: boolean;
  numberOfKids: number;
  disabilityType: DisabilityTypeEnum;
  ztp: boolean;
  hasCar: boolean;
  priceOfCar: number;
}

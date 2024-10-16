import {Point} from './Point';

type Restaurant = {
  _id: string;
  companyId: number;
  name: string;
  address: string;
  postalCode: String;
  city: string;
  phone: string;
  location: Point;
  company: string;
};

export type {Restaurant};
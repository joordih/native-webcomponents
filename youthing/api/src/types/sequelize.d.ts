export interface BaseAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface BaseCreationAttributes {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export enum UserType {
  USER = "user",
  CUSTOMER = "customer",
  PROMOTER = "promoter",
}

export enum Environment {
  INDOOR = "indoor",
  OUTDOOR = "outdoor",
  MIXED = "mixed",
}

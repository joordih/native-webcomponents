import { BaseEntity } from "@/redux/types/state";

export interface User extends BaseEntity {
  name: string;
  email: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

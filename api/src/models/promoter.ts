import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "promoters",
  timestamps: true,
  paranoid: true,
})
export default class Promoter extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id",
  })
  id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "name",
  })
  name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "email",
  })
  email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: "password",
  })
  password?: string;

  @Column({
    type: DataType.BOOLEAN,
    field: "published",
  })
  published?: boolean;

  @Column({
    type: DataType.ENUM("active", "inactive", "pending"),
    defaultValue: "pending",
    field: "status",
  })
  status?: string;

  @Column({
    type: DataType.ENUM("admin", "user", "moderator"),
    defaultValue: "user",
    field: "role",
  })
  role?: string;

  @Column({ type: DataType.DATE, field: "createdAt" })
  readonly createdAt?: Date;

  @Column({ type: DataType.DATE, field: "updatedAt" })
  readonly updatedAt?: Date;

  @Column({ type: DataType.DATE, field: "deletedAt" })
  readonly deletedAt?: Date;
}

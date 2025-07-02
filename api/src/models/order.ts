import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'orders',
  timestamps: true,
  paranoid: true,
})
export default class Order extends Model {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
  })
  id?: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'name',
  })
  name?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'email',
  })
  email?: string;

  @Column({
    type: DataType.BOOLEAN,
    field: 'published'
  })
  published?: boolean;

  @Column({ type: DataType.DATE, field: 'createdAt' })
  readonly createdAt?: Date;

  @Column({ type: DataType.DATE, field: 'updatedAt' })
  readonly updatedAt?: Date;

  @Column({ type: DataType.DATE, field: 'deletedAt' })
  readonly deletedAt?: Date;
}
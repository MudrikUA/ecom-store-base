import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from '../order/order.model';
import { PaymentMethod } from '../payment-method/payment-method.model';

interface PaymentAttr {
  order_id: number;
  // customer_first_name: string;
  // customer_last_name: string;
  // customer_phone: string;
  // address: string;
  // city: string;
  // postal_code: string;
  // country: string;
  payment_method_id: number;
  transaction_id: string;
  status: string;
  paid_at: Date;
}

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment, PaymentAttr> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Order)
  @Column({allowNull: false})
  order_id: number;

  // @Column({ type: DataType.STRING, allowNull: false })
  // customer_first_name: string;

  // @Column({ type: DataType.STRING, allowNull: false })
  // customer_last_name: string;

  // @Column({ type: DataType.STRING, allowNull: false })
  // customer_phone: string;

  // @Column({ type: DataType.STRING, allowNull: false })
  // address: string;

  // @Column({ type: DataType.STRING, allowNull: false })
  // city: string;

  // @Column({ type: DataType.STRING, allowNull: false })
  // postal_code: string;

  // @Column({ type: DataType.STRING, allowNull: false })
  // country: string;

  @ForeignKey(() => PaymentMethod)
  @Column({allowNull: false})
  payment_method_id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  transaction_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @Column({ type: DataType.DATE })
  paid_at: Date;

  @BelongsTo(() => Order)
  order: Order;

  @BelongsTo(() => PaymentMethod)
  paymentMethod: PaymentMethod;
}

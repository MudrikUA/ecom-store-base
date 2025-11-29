import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { BrandModule } from './brand/brand.module';
import { PricebookModule } from './pricebook/pricebook.module';
import { RoleModule } from './role/role.module';
import { OrderModule } from './order/order.module';
import { ShippingModule } from './shipping/shipping.module';
import { ShippingMethodModule } from './shipping-method/shipping-method.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { CategoryModule } from './category/category.module';
import { StockModule } from './stock/stock.module';
import { Brand } from './brand/brand.model';
import { Category } from './category/category.model';
import { OrderItem } from './order/order-item.model';
import { Order } from './order/order.model';
import { PaymentMethod } from './payment-method/payment-method.model';
import { Payment } from './payment/payment.model';
import { PriceBook } from './pricebook/pricebook.model';
import { Product } from './product/product.model';
import { Role } from './role/role.model';
import { UserRole } from './role/user-role.model';
import { ShippingMethod } from './shipping-method/shipping-method.model';
import { Shipping } from './shipping/shipping.model';
import { Stock } from './stock/stock.model';
import { User } from './user/user.model';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: `${process.env.POSTGRESS_PASSWORD}`,
      database: process.env.POSTGRES_DB,
      models: [Brand, Category, OrderItem, Order,
        Payment, PaymentMethod, PriceBook,
        Product, Role, UserRole, Shipping,
        ShippingMethod, Stock, User
      ],
      autoLoadModels: true,
    }),
    UserModule,
    ProductModule,
    BrandModule,
    PricebookModule,
    RoleModule,
    OrderModule,
    ShippingModule,
    ShippingMethodModule,
    PaymentModule,
    PaymentMethodModule,
    CategoryModule,
    StockModule,
    AuthModule,
    FilesModule,
  ],
})
export class AppModule { }

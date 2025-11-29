import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [
    SequelizeModule.forFeature([Product]),
    FilesModule,
    CategoryModule,
    forwardRef(() => AuthModule),
  ],
  exports: []
})
export class ProductModule { }

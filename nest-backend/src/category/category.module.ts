import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  imports: [
    SequelizeModule.forFeature([Category]),
    forwardRef(() => AuthModule),
  ],
  exports: [CategoryService]
})
export class CategoryModule { }

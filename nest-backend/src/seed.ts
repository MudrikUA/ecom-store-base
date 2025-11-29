import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { AddRoleDto } from './user/dto/AddRoleDto';
import { CreateUserDto } from './user/dto/CreateUserDto';
import { CategoryService } from './category/category.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userService = app.get(UserService);
    const roleService = app.get(RoleService);
    const categoryService = app.get(CategoryService);


    const isRoleExist = await roleService.getRoleByValue('ADMIN');
    if (!isRoleExist) {
        await roleService.createRole({ name: 'ADMIN', description: 'Administrator role' });
        console.log('Seed OK: created ADMIN role.');
        await roleService.createRole({ name: 'USER', description: 'User role' });
        console.log('Seed OK: created USER role.');
        await roleService.createRole({ name: 'MANAGER', description: 'Manager role' });
        console.log('Seed OK: created MANAGER role.');
    }

    const isRootCatExist = await categoryService.getAllActiveChildCategoriesByParentAlias('root');
    if (!isRootCatExist || isRootCatExist === null || isRootCatExist.alias === undefined) {
        await categoryService.createCategory({ name: 'Root', alias: 'root', isActive: true });
        console.log('Seed OK: created root category.');
    }

    let isUserExists = await userService.getUserByEmail('admin@default.com', false);
    if (!isUserExists || isUserExists === null || isUserExists.id === undefined) {
        isUserExists = await userService.createUser({
            email: 'admin@default.com',
            password: 'admin123456',
            first_name: 'Admin',
            last_name: 'Admin',
            phone: '0000000000'
        } as CreateUserDto);
        console.log('Seed OK: created default admin.');
    } else {
        console.log('Seed skipped: admin exists.');
    }

    await userService.addRole({
        userId: isUserExists.id,
        value: 'ADMIN'
    } as AddRoleDto);
    console.log('Seed OK: assigned ADMIN role to default admin.');

    await app.close();
}

bootstrap();

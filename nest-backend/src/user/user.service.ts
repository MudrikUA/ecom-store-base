import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { RoleService } from 'src/role/role.service';
import { AddRoleDto } from './dto/AddRoleDto';
import { CreateUserDto } from './dto/CreateUserDto';
import { ChangeUserDto } from './dto/ChangeUserDto';
import { Role } from 'src/role/role.model';
import * as bcrypt from 'bcryptjs';
import { ChangeUserPasswordDto } from './dto/ChangeUserPasswordDto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userRepo: typeof User,
        private roleService: RoleService) { }

    async createUser(dto: CreateUserDto) {
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userRepo.create({ ...dto, password: hashPassword });
        const role = await this.roleService.getRoleByValue("USER")
        if (!role) {
            throw new HttpException('[ERR-9]: Role not found', HttpStatus.NOT_FOUND);
        }
        await user.$set('roles', [role.id])
        user.roles = [role]
        return user;
    }

    async changeUser(id, dto: ChangeUserDto) {
        const user = await this.userRepo.findByPk(id, { include: [Role] });
        if (!user) throw new NotFoundException("[ERR-4]: User not found");

        let hashPassword = user.password;
        if (user.password !== dto.password) {
            hashPassword = await bcrypt.hash(dto.password, 5);
        }

        await user.update({ ...dto, password: hashPassword });

        if (dto.roles) {
            await user.$set("roles", dto.roles);
        }
        return user;
    }

    async updateUser(dto: ChangeUserDto) {
        const isPasswordValid = await this.validateUserPassword(dto.id, dto.password);
        if (isPasswordValid) {
            const userByEmail = await this.getUserByEmail(dto.email, false);
            if (userByEmail && userByEmail.id !== dto.id) {
                throw new UnauthorizedException({ message: '[ERR-5]: Email already taken' });
            }
            await this.userRepo.update({ ...dto, password: userByEmail?.password }, { where: { id: dto.id } });
            const updatedUser = await this.userRepo.findByPk(dto.id, {
                include: [{
                    model: Role,
                    attributes: { exclude: ['UserRole'] },
                    through: { attributes: [] },
                }], attributes: { exclude: ['password'] }
            });
            return updatedUser;
        }
        throw new UnauthorizedException({ message: '[ERR-6]: Incorrect password' });
    }

    async changeUserPassword(dto: ChangeUserPasswordDto) {
        const isPasswordValid = await this.validateUserPassword(dto.id, dto.oldPassword);
        if (isPasswordValid) {
            const hashPassword = await bcrypt.hash(dto.newPassword, 5);
            await this.userRepo.update({ password: hashPassword }, { where: { id: dto.id } });
            const updatedUser = await this.userRepo.findByPk(dto.id, {
                include: [{
                    model: Role,
                    attributes: { exclude: ['UserRole'] },
                    through: { attributes: [] },
                }], attributes: { exclude: ['password'] }
            });
            return updatedUser;
        }
        throw new UnauthorizedException({ message: '[ERR-6]: Incorrect password' });
    }

    async getAllUsers() {
        const user = await this.userRepo.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Role,
                    attributes: { exclude: ['UserRole'] },
                    through: { attributes: [] },
                },
            ],
        });
        return user;
    }

    async getAllByFilter(query: any) {
        const { filter, range, sort } = query;

        const filters = filter ? JSON.parse(filter) : {};
        const [sortField, sortOrder] = sort ? JSON.parse(sort) : ['id', 'ASC'];
        const [offset, limit] = range ? JSON.parse(range) : [0, 10];

        const whereClause: any = {};
        if (filters.id) whereClause.id = { [Op.in]: filters.id };
        if (filters.name) whereClause.name = { [Op.iLike]: `%${filters.name}%` };

        const { rows, count } = await this.userRepo.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[sortField, sortOrder]],
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Role,
                    attributes: { exclude: ['UserRole'] },
                    through: { attributes: [] },
                },
            ],
        });

        return { rows, count };
    }

    async getUserByEmail(email: string, isFullType: boolean) {
        const searchParams = isFullType ? {
            where: { email },
            include: [
                {
                    model: Role,
                    attributes: { exclude: ['UserRole'] },
                    through: { attributes: [] },
                },
            ],
        } : {
            where: { email },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Role,
                    attributes: { exclude: ['UserRole'] },
                    through: { attributes: [] },
                },
            ],
        }
        const user = await this.userRepo.findOne(searchParams);
        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepo.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }
        throw new HttpException('[ERR-8]: User or role not found', HttpStatus.NOT_FOUND);
    }

    private async validateUserPassword(userId, password) {
        const user = await this.userRepo.findByPk(userId);
        if (!user) {
            throw new UnauthorizedException({ message: '[ERR-4]: User not found' });
        }
        const passwordEquals = await bcrypt.compare(password, user.password);
        if (passwordEquals) {
            return true;
        }
        return false;
    }

    async deleteUser(id) {
        const result = await this.userRepo.destroy({ where: { id } });
        if (result === 0) {
            throw new NotFoundException('[ERR-4]: User not found');
        }
        return result;
    }

    async getById(id: string): Promise<{ id: number; roles: number[] }> {
        const user = await this.userRepo.findByPk(id, {
            include: [{ model: Role, through: { attributes: [] } }]
        });

        if (!user) {
            throw new HttpException('[ERR-4]: User not found', HttpStatus.NOT_FOUND);
        }
        return {
            ...user.get(),
            roles: user.roles.map(role => role.id)
        };
    }
}

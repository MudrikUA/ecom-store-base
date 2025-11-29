import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
        private jwtService: JwtService) { }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto, []);
        const result = {
            token: await this.generateToken(user),
            user: await this.userService.getUserByEmail(userDto.email, false)
        };
        return result;
    }

    async adminLogin(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto, ['ADMIN', 'MANAGER']);
        const result = {
            token: await this.generateToken(user),
            user: await this.userService.getUserByEmail(userDto.email, false)
        };
        return result;
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email, true);
        if (candidate) {
            throw new HttpException('[ERR-1]: A user with this email already exists', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.createUser(userDto);
        const result = {
            token: await this.generateToken(user),
            user: await this.userService.getUserByEmail(userDto.email, false)
        };
        return result;
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.roles }
        return this.jwtService.sign(payload)
    }

    private async validateUser(userDto: CreateUserDto, roles: string[]) {
        const user = await this.userService.getUserByEmail(userDto.email, true);
        if (!user) {
            throw new UnauthorizedException({ message: '[ERR-2]: Incorrect email or password' });
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (passwordEquals && (roles.length === 0 || user?.roles.some(role => roles.includes(role.name)))) {
            return user;
        }
        if (roles.length !== 0 && !user?.roles.some(role => roles.includes(role.name))) {
            throw new UnauthorizedException({ message: '[ERR-3]: No rights' });
        }
        throw new UnauthorizedException({ message: '[ERR-2.1]: Incorrect email or password' });
    }
}

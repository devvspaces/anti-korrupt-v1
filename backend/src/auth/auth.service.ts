import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../database/schema';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(lastName: string): Promise<{ user: User; token: string }> {
    // Find or create user
    let user = await this.usersService.findByLastName(lastName);

    if (!user) {
      user = await this.usersService.create({
        lastName,
        knowledgeTokens: 0,
      });
    }

    // Generate JWT token
    const payload: JwtPayload = { sub: user.id, lastName: user.lastName };
    const token = this.jwtService.sign(payload);

    return {
      user,
      token,
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    const user = await this.usersService.findById(userId);
    return user || null;
  }
}

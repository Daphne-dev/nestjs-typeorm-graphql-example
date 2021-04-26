import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const emailExists = await this.users.findOne({ email });

      if (emailExists) {
        return { ok: false, error: '이미 존재하는 이메일입니다.' };
      }

      await this.users.save(this.users.create({ email, password }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: '계정 생성을 할 수 없습니다.' };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
      console.log(user);
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: '유저를 찾을 수 없습니다.' };
    }
  }
}

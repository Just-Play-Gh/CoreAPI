import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    create(createUserDto: CreateUserDto): Promise<User>;
    paginate(options: IPaginationOptions, searchParams?: {}): Promise<Pagination<User>>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<User>;
}

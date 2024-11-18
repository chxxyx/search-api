import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InsertUserDto } from './dto/insert.user.dto';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService
    ) {}

    /**
     * 유저 정보 등록 
     * @param dto (email, age, gender, region)
     * @returns statusCode, message
     */
    async insertUser(dto: InsertUserDto) {

        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if(user) {
            throw new ConflictException();
        }

        await this.prismaService.user.create({
            data: {
                email: dto.email,
                userInfo: {
                    create: {
                        age: dto.age,
                        gender: dto.gender,
                        region: dto.region
                    }
                }
            },
            include: {
                userInfo: true
            }
        })

        return {
            statusCode: 201,
            message: "유저가 성공적으로 등록되었습니다.",
        }
    }
}

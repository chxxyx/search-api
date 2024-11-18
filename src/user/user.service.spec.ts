import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { InsertUserDto } from './dto/insert.user.dto';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService, 
        { provide: PrismaService, useValue: mockPrismaService }, // PrismaService 모킹 (실제 디비 반영 안 되려고 )
      ],
    })
    .compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('insert user', async () => {
    const createUserDto: InsertUserDto = { 
      email: "scy@test.com",
      age: "50",
      gender: "M",
      region: "KOREA"
    };
  
    // 유저 존재 하지 않는다고 설정해줌 
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    // create 함수 모킹, 성공 반환 값
    mockPrismaService.user.create.mockResolvedValue({
      email: createUserDto.email, 
      userInfo: {
        "age": createUserDto.age,
        "gender": createUserDto.gender,
        "region": createUserDto.region
      },
    });
  
    const result = await service.insertUser(createUserDto);
  
    // 성공 시 예상 반환 값 
    const expectedResult = {
      statusCode: 201,
      message: "유저가 성공적으로 등록되었습니다.",
    };
    
    // 결과 비교
    expect(result).toEqual(expectedResult);
  
    // 호출 확인 검증 
    expect(mockPrismaService.user.create).toHaveBeenCalledWith({
      data: {
        email: createUserDto.email, 
        userInfo: {
          create: {
            "age": createUserDto.age,
            "gender": createUserDto.gender,
            "region": createUserDto.region
          },
        },
      },
      include: {
        userInfo: true,
      },
    });
  });
  
});

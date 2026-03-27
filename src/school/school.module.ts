import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolYear } from 'src/entities/school-year.entity';
import { School } from 'src/entities/school.entity';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';

@Module({
    imports : [
       // TypeOrmModule.forFeature([SchoolYear, School])
    ],
    providers: [SchoolService],
    controllers: [SchoolController]
})
export class SchoolModule {}

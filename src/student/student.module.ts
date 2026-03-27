import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from 'src/entities/section.entity';
import { Student } from 'src/entities/student.entity';
import { StudentService } from './student.service';

@Module({

    imports : [
        TypeOrmModule.forFeature([Student, Section]),
    ],
    providers : [StudentService],
    exports : [StudentService], // 🔁 Para poder usarlo desde otros módulos

})
export class StudentModule {}

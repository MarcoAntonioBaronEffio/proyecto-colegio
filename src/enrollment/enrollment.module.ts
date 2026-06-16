import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollement } from 'src/entities/enrollment.entity';
import { SchoolYear } from 'src/entities/school-year.entity';
import { Section } from 'src/entities/section.entity';
import { Student } from 'src/entities/student.entity';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';

@Module({
    imports: [
        // 📦 Registramos las entidades que usa el servicio
        TypeOrmModule.forFeature([
            Enrollement,
            Student,
            SchoolYear,
            Section,
        ]),
    ],
    controllers: [EnrollmentController], // 🎮 Controller
    providers: [EnrollmentService], // 🧠 Servicio
    exports: [EnrollmentService], // 🔄 Por si luego otro módulo lo necesita
})
export class EnrollmentModule {}

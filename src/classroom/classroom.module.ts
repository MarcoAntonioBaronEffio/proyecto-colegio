import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { Classroom } from 'src/entities/classroom.entity';
import { School } from 'src/entities/school.entity';

@Module({
    imports:[
        // 🗄️ Registramos las entidades cuyos repositorios serán usados dentro de este módulo
        // ✅ Classroom -> para trabajar con la tabla classrooms
        TypeOrmModule.forFeature([Classroom]),
    ],

    // 🎮 Registramos el controlador que manejará las rutas HTTP de classrooms
    controllers: [ClassroomController],

    // 🧠 Registramos el servicio que contiene la lógica de negocio
    providers: [ClassroomService],

    // 📤 Exportamos el servicio por si otro módulo necesita reutilizar su lógica
    exports: [ClassroomService],
})

// 🧩 Módulo de classrooms
export class ClassroomModule {}

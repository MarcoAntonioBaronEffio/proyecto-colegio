import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from 'src/entities/school.entity';
import { SchoolService } from './school.service';


// 🧩 Decorador que marca esta clase como un módulo de NestJS.
// 👉 Aquí se configura qué controladores, servicios, repositorios y otros módulos formarán parte de este módulo
@Module({

    // 📦 Módulos que este módulo necesita para funcionar
    imports: [

        // 🏫 Registramos el repositorio de la entidad School
        // 👉 Esto permite inyectar Repository<School> mediante @InjectRepository(School) dentro de los providers de este módulo
        //   (por ejemplo, SchoolService)
        TypeOrmModule.forFeature([School]),
    ],

    // 🌐 Controladores que exponen los endpoints HTTP
    // 👉 Reciben las solicitudes del cliente, validan los DTO, llaman a los servicios y devuelven la respuesta
    controllers: [SchoolController],

    // 🔧 Providers: clases administradas por el sistema de inyección de dependencias de NestJS
    // 👉 Aquí registramos SchoolService para que NestJS pueda crear una instancia e inyectarla donde sea necesaria
    // 👉 En este módulo, SchoolController utilizará SchoolService para ejecutar la lógica de negocio
    providers: [SchoolService],

    // 🔁 Elementos que este módulo comparte con otros módulos
    // 👉 Cualquier módulo que importe SchoolModule podrá inyectar SchoolService
    exports: [SchoolService],
})

// 🏷️ Módulo encargado de toda la gestión de colegios
// 📚 Responsabilidades:
// 🔹 Registrar colegios
// 🔹 Consultar colegios
// 🔹 Actualizar información institucional
// 🔹 Gestionar configuración general del colegio
export class SchoolModule {}

import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from 'src/entities/school.entity';
import { SchoolService } from './school.service';

@Module({
    // 📦 imports: módulos o integraciones que este módulo necesita
    // 🔹 TypeOrmModule.forFeature([School])
    // 👉 Registra el repositorio de la entidad School para poder inyectarlo mediante @InjectRepository(School) dentro de SchoolService
    imports: [
        TypeOrmModule.forFeature([School]),
    ],

    // 🚪 controllers: clases que reciben las peticiones HTTP
    // 👉 Aquí vive la capa web
    // 👉 Se encarga de recibir DTOs, validar datos de entrada, llamar al servicio y devolver la respuesta al cliente
    controllers: [SchoolController],

    // 🔧 providers: clases inyectables administradas por NestJS
    // 👉 SchoolService contiene la lógica de negocio: Crear colegios, listar colegios, buscar colegios, actualizar colegios, eliminar colegios
    providers: [SchoolService],

    // 🔁 exports : elementos que este módulo pone a disposición de otros módulos que lo importen
    // 👉 Exportamos SchoolService para que otros módulos puedan inyectarlo si necesitan consultar información de colegios
    exports: [SchoolService],
})

// 🏷️ Módulo encargado de toda la gestión de colegios
// 📚 Responsabilidades:
// 🔹 Registrar colegios
// 🔹 Consultar colegios
// 🔹 Actualizar información institucional
// 🔹 Gestionar configuración general del colegio
export class SchoolModule {}

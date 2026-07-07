import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SchoolService } from './school.service';
import { RoleName } from 'src/entities/users.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { School } from 'src/entities/school.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

// 🏫 Controlador encargado de gestionar los colegios del sistema
// 👉 Todas las rutas definidas aquí comenzarán con /schools
// 👉 Ejemplo: 🔹 POST /schools | 🔹 GET /schools | 🔹 GET /schools/:id

// 🔐 Todo este controlador solo puede ser utilizado por usuarios con el rol SYSTEM_ADMINISTRATOR
@Roles(RoleName.SYSTEM_ADMINISTRATOR)
@Controller('schools')
export class SchoolController {

    // 🏗️ Inyectamos SchoolService
    // 👉 El controlador delega toda la lógica de negocio al servicio
    constructor(private readonly service : SchoolService){}

    // 🏫 Crear un nuevo colegio
    // 📍 Endpoint: POST /schools
    // 📤 Devuelve el colegio recién registrado
    @Post()
    // 📥 Recibe la información enviada por el cliente
    // 👉 NestJS valida automáticamente el DTO antes de ejecutar este método
    async create(
        @Body() dto: CreateSchoolDto
    ) : Promise<ApiResponse<School>>{

        // 🚀 Delegamos la creación del colegio al servicio
        const created = await this.service.create(dto);

        // 📨 Devolvemos una respuesta utilizando el formato estándar ApiResponse
        return{
            // ✅ La operación se realizó correctamente
            success: true,
            // 💬 Mensaje descriptivo para el cliente
            message: 'Colegio creado correctamente ✅',
            // 📦 Colegio recién registrado
            data : created
        }
    }


    // 📋 Obtener todos los colegios
    // 📍 Endpoint: GET /schools
    // 📤 Devuelve la lista completa de colegios registrados
    @Get()
    async findAll() : Promise<ApiResponse<School[]>>{

        // 🚀 Solicitamos al servicio todos los colegios registrados
        const schools = await this.service.findAll();
        
        // 📨 Devolvemos la respuesta utilizando el formato estándar ApiResponse
        return{
            // ✅ La operación se realizó correctamente
            success: true,
            // 💬 Mensaje descriptivo para el cliente
            message: 'Listado de colegios obtenido correctamente',
            // 📦 Lista de colegios
            data: schools,
        };
    }


    // 🔍 Obtener un colegio por su identificador
    // 📍 Endpoint: GET /schools:/:id
    // 📥 Devuelve el colegio solicitado
    @Get(':id')
    async findOne(
        // 📥 Identificador único (UUID) del colegio
        @Param('id') id: string,
    ) : Promise<ApiResponse<School>>{

        // 🚀 Solicitamos al servicio buscar el colegio
        const school = await this.service.findOne(id);

        // 📨 Devolvemos la respuesta utilizando el formato estándar ApiResponse
        return{
            // ✅ La operación se realizó correctamente
            success : true,
            // 💬 Mensaje descriptivo para el cliente
            message: 'Colegio obtenido correctamente',
            // 📦 Colegio encontrado
            data: school,
        }


    }

}

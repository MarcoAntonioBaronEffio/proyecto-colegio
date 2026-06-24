import { Body, Controller, Get, Post } from '@nestjs/common';
import { SchoolService } from './school.service';
import { RoleName } from 'src/entities/users.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { School } from 'src/entities/school.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

// 🏫 @Controller('schools') -> Prefijo de ruta del controlador
// 🔹 Todas las rutas aqui comenzarán con /schools
// 🔹 Ejemplos: POST /schools | GET /schools
@Roles(RoleName.SYSTEM_ADMINISTRATOR)
@Controller('schools')
export class SchoolController {

    // 🧩 Inyección de dependencias
    // 🔹 Nest crea una instancia de SchoolService y la inyecta en el constructor.
    // 🔹 "private readonly service" guarda la referencia como propiedad inmutable.
    constructor(private readonly service : SchoolService){}

    // 🏫1️⃣ Crear colegio (Solo System Administrator)
    // 🔹 Endpoint: POST http://localhost:3000/api/schools
    // 🔹 Seguridad
    
    @Post()
    // 📦 Extraemos el cuerpo de la petición y lo validamos según el DTO
    async create(
        @Body() dto: CreateSchoolDto
    ) : Promise<ApiResponse<School>>{

        // 🚀 Llamamos al servicio para crear el nuevo colegio
        const created = await this.service.create(dto);

        // 📨 Retornamos una respuesta uniforme con formato ApiResponse
        return{
            // ✅ Indica que la operación fue exitosa
            success: true,
            // 🗒️ Mensaje informativo
            message: 'Colegio creado correctamente ✅',
            // 📦 Colegio recién creado
            data : created
        }
    }


    // 📚2️⃣ Listar todos los colegios
    // 📋 Endpoint: GET http://localhost:3000/api/schools
    // 🔹 Devuelve todos los colegios registrados en la plataforma
    // 🔹 Ideal para mostrarlos en el panel de System Administrator
    @Get()
    async findAll() : Promise<ApiResponse<School[]>>{

        // 🔎 Llamamos al servicio para traer todos los colegios
        const schools = await this.service.findAll();
        
        // 📨 Devolvemos la lista con el formato ApiResponse
        return{
            success: true,
            message: 'Listado de colegios obtenido correctamente',
            data: schools,
        };
    }

}

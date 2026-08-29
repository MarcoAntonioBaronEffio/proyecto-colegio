import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SchoolService } from './school.service';
import { RoleName } from 'src/entities/users.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { School } from 'src/entities/school.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SchoolForAdministratorRegistrationResponse } from './response/school-for-administrator-registration.response';

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


    // 📋 Obtener colegios para registrar un administrador
    // 📍 Endpoint: GET /schools/administrator-registration
    // 📥 Devuelve únicamente el ID y nombre de los colegios registrados
    // 👉 Esta información será utilizada para seleccionar el colegio disponibles y permitir seleccionar uno al momento de registrar un nuevo administrador.
    @Get('administrator-registration')
    async findSchoolsForAdministratorRegistration() 
        : Promise<ApiResponse<SchoolForAdministratorRegistrationResponse[]>>{

        // 🚀 Solicitamos al servicio los colegios necesarios para registrar un administrador
        // 👉 El servicio devolverá una lista de: SchoolForAdministratorRegistrationResponse
        // 📌 Cada colegio contendrá únicamente:
        //
        // 🆔 id -> Indentificador único del colegio
        // 🏫 name -> Nombre del colegio.
        //
        // 🔥 Por ejemplo:
        /*
            [
        
                {
                    id: "550e8400-e29b-41d4-a716-446655440000",
                    name : "I.E San Joaquín"          
                },
                {
                    id: "660e8400-e29b-41d4-a716-446655440000",
                    name : "I.E Betel"
                }
            ]
        */
        const schools = await this.service.findSchoolForAdministratorRegistration();

        // 📨 Devolver respuesta
        // 👉 Devolvemos la información utilizando nuestro formato estándar ApiResponse
        return {

            // ✅ success
            // 👉 Indica que la operación terminó correctamente
            success : true,

            // 💬 message
            // 👉 Mensaje descriptivo que podrá recibir el cliente
            message : 'Colegios obtenidos correctamente',

            // 📦 data
            // 👉 Contiene la lista de colegios obtenida desde el servicio
            // 📌 Cada elemento cumple con la estructura definida en: 
            // 👉 SchoolForAdministratorRegistrationResponse
            //
            // 📌 Si no existen colegios registrador:
            // 👉 dara contendrá un arreglo vacío [].
            data : schools,
        }

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

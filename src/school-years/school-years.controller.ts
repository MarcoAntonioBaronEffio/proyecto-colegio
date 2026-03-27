// 🧩 Decoradores/utilidades de Nest para construir controladores HTTP
import {
    Controller, // 🏠 Declara esta clase como controlador (agrupa endpoints con un prefijo).
    Post,       // ➕ Manejará solicitudes HTTP POST.
    Body,       // 📦 Extrae el cuerpo JSON de la solicitud
    Get,        // 📥 Manejará solicitudes HTTP GET
    Param,      // 🏷️ Lee parámetros dinámicos de la URL (ej: /:id)
    Patch,      // 🔁 Manejará solicitudes HTTP PATCH (actualizaciones parciales)
    UseGuards,  // 🛡️ Aplica guardias de seguridad (JWT, roles) a métodos o a toda la clase
} from '@nestjs/common';

// 🧠 Capa de negocio específica de Años escolares (CRUD + reglas)
import { SchoolYearsService } from './school-years.service';
// 📝 Contrato de entrada para crear un año escolar
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
// 🌐 Interfaz de respuesta uniforme para toda la API
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
// 🧩 Entidad para tipar las respuestas 'data'
import { SchoolYear } from 'src/entities/school-year.entity';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';

// 🔐 Autenticación + Autorización por roles
//import { JwtAuthGuard } from 'src/auth/jwt-auth-guard'; // 🔑 Verifica que el token JWT sea válido 
//import { RolesGuard } from 'src/auth/guards/roles.guard';  // 🎫 Verifica que el usuario tenga el/los rol(es) requeridos
//import { Roles } from 'src/auth/decorators/roles.decorator'; // 🏷️ Decorador para declarar roles requeridos (ej: @Roles('admin))


// 📚 @Controller('school-years') -> Prefijo de ruta del controlador:
// - Todas las rutas aquí comenzarán con /school-years (ej: POST /school-years, GET /school-years/:id, etc.)
@Controller('school-years')
export class SchoolYearsController {
    // 🧩 Inyección de dependencias:
    // - Nest crea una instancia de SchoolYearsService y la inyecta en el constructor.
    // - "private readonly service" guarda la referencia como propiedad inmutable.
    constructor (private readonly service : SchoolYearsService){}

    // 🧾 1️⃣ Crear año escolar (Solo admin)
    // - Endpont: POST http://localhost:3000/api/school-years
    // - Body: CreateSchoolYearDto (ej: {year, startsOn?, endsOn?})
    // - Seguridad (recomendada): JWT + Roles('admin')
    @Post()
    //@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ Primero autentica (JWT), luego autoriza (roles).
    //@Roles('admin')                      // 👑 Solo usuarios con rol "admin".
    // 📦 Extraemos el cuerpo de la petición y lo validamos según el DTO
    async create(@Body() dto: CreateSchoolYearDto) : Promise<ApiResponse<SchoolYear>>{ 
      
        // 🚀 Llamamos al servicio para crear el nuevo año escolar
        const created = await this.service.create(dto);

        // 📨 Retornamos una respuesta uniforme con el formate ApiResponse
        return{
            success : true,  // ✅ Indica que la operación fue exitosa
            message : 'Año escolar creado correctamente ✅', // 🗒️ Mensaje informativo.
            data : created, // 📦 El año escolar recién creado (objeto completo).
        }
    }

    // 📚 2️⃣ Listar todos los años
    // 📋 Endpoint: GET http://localhost:3000/api/school-years
    // - Devuelve todos los años escolares existentes en la base de datos.
    // - Ideal para mostrarlos en el panel del administrador.
    @Get() // 📥 Escucha peticiones HTTP GET en /school-years
    async findAll() : Promise<ApiResponse<SchoolYear[]>>{
        // 🔎 Llamamos al servicio para traer todos los años escolares.
        const years = await this.service.findAll();

        // 📨 Devolvemos la lista con el formato ApiResponse
        return{
            success: true,
            message : 'Listado de años escolares obtenidos correctamente',
            data : years,
        }
        
    }

    // ✏️ Actualizar un año escolar existente
    // 📋 Endpoint: PATCH http://localhost:3000/api/school-years/:id
    // - Permite corregir el año, la fecha de inicio o la fecha de fin
    // - Ideal cuando el administrador se equivocó al registrar esos datos
    @Patch(':id') // 📌 Escucha peticiones PATCH en /school-years/:id
    async update(

        // 🆔 Extraemos el id enviado por la URL
        @Param('id') id : string,
        // 📦 Extraemos el body y lo validamos según UpdateSchoolYearDto
        @Body() dto: UpdateSchoolYearDto,
    ) : Promise<ApiResponse<SchoolYear>>{

        // 🚀 Llamamos al servicio para actualizar el año escolar
        const update = await this.service.update(id, dto);

        // 📨 Retornamos una respuesta uniforme con formato ApiResponse
        return{
            success : true, // ✅ La operación salió bien
            message : 'Año escolar actualizado correctamente',  // 🗒️ Mensaje informativo
            data : update, // 📦 Retornamos el año escolar ya actualizado
        }; 
    }


    // 🟢 3️⃣ Obtener el año activo (si existe)
    // 🟢 Endpoint: GET http://localhost:3000/api/school-years/status/active/now
    // - Devuelve el año con isActive = true, o null si no hay.
    // - ⚠️ Importante: Este endpoint específico debe declararse ANTES que "@Get(':id')" para evitar que
    // "status" se interprete como un :id.
    @Get('status/active/now') // 📍 Ruta específica (más "estrecha" que :id)
    async getActive() : Promise<ApiResponse<SchoolYear>>{
      
        // 🧠 Busca isActive = true
        const active = await this.service.getActive();

        return{
                success : true,
                message : 'Año escolar activo encontrado ✅',
                data : active,
            }
    }

    // 🔎 4️⃣ Obtener un año por id
    // 🔎 Endpoint: GET http://localhost:3000/api/school-years/78af2796-b1fe-4730-9a6a-fce842b3fe89
    // - Busca un año por su UUID
    @Get(':id') // 🏷️ Ruta dinámica que captura el parámetro :id
    async findOne(@Param('id') id: string) : Promise<ApiResponse<SchoolYear>>{
      
        // 🧠 Consulta en BD
        const year = await this.service.findOne(id);
            
        return{
            success: true, 
            message: 'Año escolar encontrado',
            data : year,
        }
    }

    // ✅ 5️⃣ Activar un año escolar (solo admin)
    // ✅ Endpoint: PATCH http://localhost:3000/api/school-years/78af2796-b1fe-4730-9a6a-fce842b3fe89/activate
    // - Deja este año como activo y desactiva cualquier otro.
    // - Requiere JWT y rol admin.
    @Patch(':id/activate') // 🔁 Actualiza parcialmente el recurso objetivo (estado activo)
    //@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ Protegido
    //@Roles('admin')  // 👑 Solo admin
    async activate(@Param('id') id: string) : Promise<ApiResponse<SchoolYear>>{
     
        // ⚙️ Aplica la regla de negocio "único activo"
        const update = await this.service.setActive(id);

        return{
            success : true, 
            message : 'Año escolar activado correctamente ✅',
            data : update,
        }
 
    }

    // 🔒 6️⃣ Cerrar año (solo año)
    // 🔒 Endpoint: PATCH http://localhost:3000/api/school-years/78af2796-b1fe-4730-9a6a-fce842b3fe89/close
    // - Marca el año como cerrado (isClosed = true) -> bloquea operaciones de ciclo.
    // - Requiere JWT y rol admin.
    @Patch(':id/close') // 🔁 Actualiza el estado "cerrado"
    //@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ Protegido
    //@Roles('admin')                      // 👑 Solo admin
    async close(@Param('id') id: string) : Promise<ApiResponse<SchoolYear>>{

      // 🚪 Ejecuta la transición a "cerrado"
        const closed = await this.service.close(id);

         return{
            success: true,
            message : 'Año escolar cerrado correctamente',                
            data: closed,
        }
    }
}

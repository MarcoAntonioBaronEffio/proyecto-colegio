import { 
    Body,  // 📥 Decorador para obtener el cuerpo (body) del request HTTP.
    Controller, // 🧭 Permite definir una clase como controlador en NestJS. 
    HttpException, // ⚠️ Clase base para excepciones controladas (400, 404, 409, etc).
    InternalServerErrorException, // 💥 Excepción 500 (error interno del servidor)
    Post,  // ➕ Decorador para definir rutas tipo POST.
    Get,   // 📤 Decorador para definir rutas tipo GET .
    Param, // 🏷️ Decorador para leer parámetros de la URL (ej: /grades/:id)
    Delete // ❌ Decorador para definir rutas tipo DELETE
} from '@nestjs/common';

// 🧠 Importamos el servicio donde se encuentra la lógica de base de datos
import { GradesService } from './grades.service';
// 📝 Importamos el DTO que valida la estructura de los datos de entrada
import { CreateGradeDto } from './dto/create-grade.dto';
// 📄 Importamos la interfaz que define el formato de las respuestas del servidor
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
// 🧱 Importamos la entidad que representa la tabla "grado" en la base de datos
import { Grade } from 'src/entities/grade.entity';

// 🏫 Controlador principal de "Grades"
// 👉🏼 Todas las rutas aquí comienzan con /grades
@Controller('grades')           // 📍 Define el prefijo de ruta: /grades
export class GradesController { // 🏷️ Declaramos la clase del controlador
    // 💉 Inyectamos el servicio que contiene toda la lógica de base de datos
    constructor(private readonly gradesService : GradesService){} // NesiJS inyecta automáticamente el servicio GradeService

    // 🔹 Método create
    // ➕ ruta: POST /grades -> para crear un nuevo grado
    @Post()
    // 📦 Extraemos el cuerpo de la petición y lo validamos según el DTO
    async create (@Body() dto : CreateGradeDto) : Promise<ApiResponse<Grade>>{
    
        // Delegamos la lógica de creación al servicio correspondiente
        const data = await this.gradesService.create(dto); // 🏗️ Creamos el grado y esperamos la respuesta

        // 📦 Retornamos una respuesta con formato estándar
            return{
                success : true, // ✅ Indicamos que la operación fue exitosa
                message : 'Grado creado correctamente', // 🗣️ Mensaje descriptivo
                data : data, // 📊 Retorna el objeto creado (Grade)
            };
        // ⭐️ Promise<ApiResponse<Grade>> solo tipa el caso exitoso, y cuando algo falla, no devuelves nada, 
        // si no que lanzas una excepción (throw). Nest se encarga de interceptar una excepción y enviar la
        // respuesta de error automáticamente (con su respectivo statusCode, message, error)
    }



    // 🔹 Método findAll
    // 📤 Ruta: GET /grades -> obtiene todos los grados
    @Get()
    // 📊 Devuelve una lista de grados envuelta en ApiResponse
    async findAll() : Promise<ApiResponse<Grade[]>>{

        const data = await this.gradesService.findAll(); // 🧠 Pedimos al servicio todos los registros

        // 📦 Devolvemos la respuesta exitosa
        return{                
            success : true ,  // ✅ Operación existosa
            message: 'Listado de grados obtenido', // 🗣️ Mensaje descriptivo 
            data : data,    // 📋 Lista de grados
        };
}

    // 🔹 Método find one
    // 🔍 Ruta: GET /grades/:id -> obtiene un grado por su ID
    @Get(':id')
    // @Param('id') -> Extraemos el parámetro "id" de la URL
    async findOne(@Param('id') id: string) : Promise<ApiResponse<Grade>>{
        
        // 🎯 Buscamos el grado por su ID
        const data = await this.gradesService.findOne(id);

        // 📦 Devolvemos la respuesta exitosa
        return{
            success: true, // ✅ Indica que se encontró correctamente
            message : 'Grado encontrado', // 🗣️ Intentamos buscar el registro
            data: data, // 📊 Retorna el registro encontrado
        };
    }
 

    
    // 🔹 Método remove
    // ❌ Ruta: DELETE /grades/:id -> elimina un grado por su ID
    @Delete(':id')
    // 🏷️ Leemos el parámetro "id"
    async remove (@Param('id') id: string) : Promise<ApiResponse<Grade>>{
 
        // 🧹 Llamamos al servicio para eliminar el grado
        // Si no existe, el servicio lanzará NotFoundException.
        const data = await this.gradesService.remove(id);

        // 📦 Devolvemos la respuesta exitosa
        return{
            success: true, // ✅ Éxito 
            message: 'Grado eliminado', // 🗣️ Mensaje descriptivo
            data : data, // 🧾 Retorna el registro eliminado
        };
    }
}

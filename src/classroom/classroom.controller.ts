import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Classroom } from 'src/entities/classroom.entity';

// 🧭 Controlador principal para manejar rutas relacionadas a "classrooms"
// 🛣️ La ruta base para todos los endpoints de este controlador será /classrooms
@Controller('classrooms')
export class ClassroomController {


    // 🧱 Inyección de dependencias:
    // Nest crea automáticamente una instancia de ClassroomService y la entrega aqui.
    constructor(
        // 🧠 ¿Qué es el constructor?
        // El constructor es un método especial que se ejecuta automáticamente cuando se crea automáticamente
        // una instancia de esta clase "ClassroomController"
        // Su función principal es inicializar la clase y recibir dependencias necesarias.
        // En NestJS, el constructor se usa para recibir servicios mediante inyección de dependencias.
        // Nosotros no creamos el servicio manualmente; NestJS nos lo entrega listo para usar 
        private readonly classroomService : ClassroomService,
    ){}

    // ✅ POST
    @Post() // 📤 Endpoint POST -> /classroom
    //@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ (Opcional) Primero autentica y luego valida roles
    // 📦 Extraemos el body y lo validamos con el DTO
    async create(
        @Body()dto : CreateClassroomDto, // 📤 Datos que llegan desde el frontend
    ) : Promise<ApiResponse<Classroom>>{ // 📤 Respuesta tipada con el aula creada

        // 🚀 Llamamos al servicio para crear el aula
        const created = await this.classroomService.create(dto);

        // 📨 Retornamos respuesta uniforme
        return{
            success: true, // ✅ Operación exitosa
            message: 'Aula creada correctamente', // 🗒️ Mensaje para el frontend
            data : created, // 📦  Objeto Classroom creado
        };
    }

    // 📤 Endpoint para obtener TODAS las aulas
    // 🔹 async -> hace que la función devuelva un Promise automáticamente y permite usar await dentro
    // 🔥 Una función asíncrona inicia una operación cuyo resultado llegará en el futuro
    // 🔥 La Promise representa ese resultado futuro: puede resolverse (fullfilled ✅) o fallar (rejected ❌)
    // 🔹 await pausa esta función hasta recibir el valor final de la Promise
    @Get() // 🏷️ Ruta: GET /classroom
    async findAll() : Promise<ApiResponse<Classroom[]>>{

        // 🚀 Llamamos al servicio para traer todas las aulas
        // Qué sucede aquí:
        // 🐘 La consulta a la base de datos ya empezó
        // 📦 La Promise ya existe
        // ⌛️ Estado inicial: pending
        // ✅ Si todo sale bien -> fulfilled
        // ❌ Si ocurre un error -> rejected
        const classroom = await this.classroomService.findAll();

        // 📨 Retornamos respuesta uniforme
        return{
            success: true, // ✅ Operación exitosa
            message: 'Aulas obtenidas correctamente', // 🗒️ Mensaje descriptivo
            data: classroom, // 📦 Aula encontrada
        }
    }

    // ✅ DELETE /classrooms/:id (desactivar aula por UUID)
    // 🏷️ @Delete(':id') -> ruta dinámica: /classroom/UUID
    @Delete(':id')
    async remove(
        @Param('id') id : string, // 🆔 Capturamos el id desde la URL
    ): Promise<ApiResponse<Classroom>>{

        // 🚀 Llamamos al servicio para desactivar el aula
        const removed = await this.classroomService.remove(id);

        // 📨 Respuesta uniforme
        return{
            success: true, // ✅ Operación exitosa
            message: 'Aula desactivada correctamente', // 🗒️ Mensaje descriptivo
            data: removed, // 📦 Aula desactivada
        }



    }

}

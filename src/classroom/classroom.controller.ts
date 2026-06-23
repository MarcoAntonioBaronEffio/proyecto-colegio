import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Classroom } from 'src/entities/classroom.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ChangeClassroomsStatusDto } from './dto/change-status-classroom.dto';
import { RoleName } from 'src/common/enums/user-role.enum';

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
    @Roles(RoleName.ADMINISTRATOR)
    @Post() // 📤 Endpoint POST -> /classroom
    
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
    @Roles(RoleName.ADMINISTRATOR)
    @Get() // 🏷️ Ruta: GET /classroom
    async findAll() : Promise<ApiResponse<Classroom[]>>{

        // 🚀 Llamamos al servicio para traer todas las aulas
        // Qué sucede aquí:
        // 🐘 La consulta a la base de datos ya empezó
        // 📦 La Promise ya existe
        // ⌛️ Estado inicial: pending
        // ✅ Si todo sale bien -> fulfilled
        // ❌ Si ocurre un error -> rejected
        const classrooms = await this.classroomService.findAll();

        // 📨 Retornamos respuesta uniforme
        return{
            success: true, // ✅ Operación exitosa
            message: 'Aulas obtenidas correctamente', // 🗒️ Mensaje descriptivo
            data: classrooms, // 📦 Aula encontrada
        }
    }

    // 🔍 OBTENER AULA POR ID 
    // 👉 GET /classrooms/:id
    @Get(':id')
    async findOne(
        // 🆔 Capturamos ID desde URL
        @Param('id') id: string
    ): Promise<ApiResponse<Classroom>>{

        // 🚀 Buscamos el aula
        const classroom = await this.classroomService.findOne(id);

        // 📨 Retornamos respuesta uniforme
        return{
            success: true,
            message: 'Aula encontrada',
            data: classroom
        };
    }

    // ✏️ ACTUALIZAR AULA
    // 🏷️ PATCH /classroom/:id
    @Patch(':id')
    async update(
        // 🆔 ID desde URL
        @Param('id') id: string,
        // 📦 Datos nuevos
        @Body() dto : UpdateClassroomDto
    ) : Promise<ApiResponse<Classroom>>{

        // 🚀 Actualizamos aula
        const updated = await this.classroomService.update(
            id, dto
        );

        // 📨 Retornamos respuesta uniforme
        return{
            success : true,
            message: 'Aula actualizada correctamente',
            data: updated
        };
    }

    // 🔄 CAMBIAR ESTADO DEL AULA
    // 🏷️ PATCH /classroom/:id/status
    @Patch(':id/status')
    async changeStatus(
        // 🆔 ID del aula
        @Param('id') id: string,
        // 📦 Body validado
        @Body() dto : ChangeClassroomsStatusDto
    ) : Promise<ApiResponse<Classroom>>{

        // llamamos al servicio
        const updated = await this.classroomService.changeStatus(
            id, 
            dto.status
        );

        // 📨 Retornamos respuesta uniforme
        return{
            // ✅ Operación exitosa
            success: true,
            // 📄 Mensaje
            message : 'Estado del aula actualizado correctamente',
            // 📦 Aula actualizada
            data : updated
        };
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
            message: 'Aula eliminada correctamente', // 🗒️ Mensaje descriptivo
            data: removed, // 📦 Aula desactivada
        }
    }

}

import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Section } from 'src/entities/section.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

// 🧭 Controlador principal para manejar rutas relacionadas a "sections"
// 🛣️ La ruta base para todos los endpoints de este controlador será /sections
@Controller('sections')
export class SectionController {

    // 🧱 Inyección de dependencias:
    // NestJS crea automáticamente una instancia de SectionService y la entrega aquí. No tienes que crear nada a mano.
    constructor(
        // 🧠 ¿Qué es el constructor?:
        // El constructor es un método especial que se ejecuta automáticamente cuando se crea una instancia de esta clase "SectionController".
        // Su función principal es INICIALIZAR la clase: recibir dependencias, valores o configuraciones necesarias para que la clase funcione.
        // En NestJS, el constructor se usa para recibir servicios a través de inyección de dependencias.
        // Nosotros no creamos nada mano; 
        // Nest envía las dependencias listas y el controlador las recibe aquí.
        private readonly sectionService : SectionService,
    ){} 

    // ✅ POST

    @Post() // 📤 Endpoint POST -> /sections
    //@UseGuards(JwtAuthGuard, RolesGuard) // 🛡️ (Opcional) Primero autentica y luego valida roles
    //@Roles('admin') // 👑 (Opcional) Solo usuarios con rol admin
    // 📦 Extraemos el body y lo validamos con el DTO
    async create(
        @Body() dto: CreateSectionDto, // 📤 Datos que vienen del frontend
    ): Promise<ApiResponse<Section>>{  // 📤 Respuesta tipada 

        // 🚀 Llamamos al servicio para crear la sección
        const created = await this.sectionService.create(dto);

        // 📨 Retornamos respuesta uniforme
        return{
            success: true, // ✅ Operación exitosa
            message: 'Sección creada correctamente', // 🗒️ Mensaje para el frontend 
            data: created, // 📦 Objeto Section
        }
    }

    // 📤 Endpoint para obtener TODAS las secciones
    // 🔹 async -> palabra clave que hace que la función devuelva una Promise automáticamente y permite usar await dentro de ella
    // 🔥 Una función asíncrona inicia una operación cuyo resultado llegará en el futuro y devuelve inmediatamente un Promise en estado "pending" que representará dicho resultado.
    // 🔥 Una promesa es un objeto que representa el resultado futuro de una operación asíncrona (fulfulled ✅ o rejected ❌). Inicialmente tiene un estado "pending".
    // 🔹 Importante, "Pending" NO significa que la función async no se ha ejecutado, significa que la Promise ya empezó, pero aún no termina, y tampoco
    //.   significa que tenga un valor la promise, solo indica que la operación sigue en progreso
    // 🔥 await pausa la función async hasta que la Promise se resuelve.
    // ✅ En la variable "sections" obtenemos el valor real de ese resultado
    @Get() // 🏷️ Ruta: GET /sections
    async findAll(): Promise<ApiResponse<Section[]>>{
        // 🚀 Llamamos al servicio para traer todas las secciones
        // Qué sucede en ese mismo instante:
        // 🐘 la consulta a BD ya empezó
        // 📦 la Promise ya exuste
        // ⌛️ Estado inicial: pending (la operación está en progreso)
        // ✅ Si todo sale bien -> fulfilled
        // ❌ si ocurre un error -> rejected
        // 💥 No es que primero ocurra todo yt luego aparezca la promise
        const sections = await this.sectionService.findAll();

        // 📨 Retornamos respuesta uniforme
        return{
            success : true, // ✅ Operación exitosa
            message: 'Secciones obtenidas correctamente', // 🗒️ Mensaje obtenido
            data: sections, // 📦 Lista de todas las secciones
        }
    }



    // ✅ GET /sections/:id (buscar sección por UUID)
    // 🏷️ @Get(':id') -> ruta dinámica: /sections/UUID
    @Get(':id')
    async findOne(
        @Param('id') id : string, // 🆔 Capturamos el id de la URL
    ): Promise<ApiResponse<Section>>{

        // 🧠 Buscamos la sección en BD (en el service)
        const section = await this.sectionService.findOne(id);

        // 📨 Respuesta uniforme
        return{
            success: true,
            message: 'Sección encontrada',
            data: section,
        }

    }
 
}

import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnrollmentService } from "./enrollment.service";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { ApiResponse } from "src/common/interfaces/api-response.interface";
import { Enrollement } from "src/entities/enrollment.entity";

// 🎮 Controlador de Matrículas
// 👉 Se encarga de recibir las peticiones HTTP relacionadas con las matrículas
// 👉 Delega toda la lógica de negocio al EnrollmentService
@Controller('enrollments')
export class EnrollmentController{

    // 🧠 Inyección del servicio
    // 👉 El controlador utilizará este servicio para ejecutar las operaciones
    constructor(
        private readonly enrollmentService : EnrollmentService
    ){}

    // ========================================================================

    // ✚ Crear una nueva matrícula
    // 📌 Endpoint:
    // POST /enrollments
    @Post()
    async create(

        // 📦 Datos enviados desde el cliente
        // 👉 Contienen studentId y sectionId
        @Body()
        dto: CreateEnrollmentDto
    ): Promise<ApiResponse<Enrollement>>{

        // 🚀 Creamos la matrícula
        const created = await this.enrollmentService.create(dto);

        // 📨 Respuesta uniforme
        return{
            success: true, // ✅ Operación exitosa
            message: 'Matrícula creada correctamente', // 📄 Mensaje para el frontend 
            data : created // 📦 Matrícula creada
        };
    }


    // ========================================================================

    // 📋 Obtener todas las matrículas
    @Get() // 📥 Endpoint GET -> /enrollments
    async findAll() : Promise<ApiResponse<Enrollement[]>>{

        // 🔍 Consultamos todas las matrículas
        const enrollments = await this.enrollmentService.findAll();

        // 📨 Respuesta uniforme
        return{
            success: true, // ✅ Consulta exitosa
            message: 'Matrículas obtenidas correctamente', // 📄 Mensaje informativo
            data: enrollments, // 📦 Lista de matriculas
        }

    }


}
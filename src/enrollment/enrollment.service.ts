import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolYear } from 'src/entities/school-year.entity';
import { Section, SectionStatus } from 'src/entities/section.entity';
import { Student } from 'src/entities/student.entity';
import { Repository } from 'typeorm';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { SchoolYearStatus } from 'src/school-years/school-year-status.enum';
import { Enrollement } from 'src/entities/enrollment.entity';

@Injectable()
export class EnrollmentService {

    constructor(
        @InjectRepository(Enrollement)
        private readonly enrollementRepo : Repository<Enrollement>,

        @InjectRepository(Student)
        private readonly studentRepo : Repository<Student>,

        @InjectRepository(SchoolYear)
        private readonly schoolYearRepo : Repository<SchoolYear>,

        @InjectRepository(Section)
        private readonly sectionRepo : Repository<Section>,
    ){}


    // ✚ Crear una nueva matrícula
    async create(
        // 📦 DTO recibido desde el controlador
        // 👉 Contiene: 🔹 studentId | 🔹 sectionId
        dto : CreateEnrollmentDto
    ): Promise<Enrollement>{


        // =====================================
        // 🧑‍🎓 BUSCAR ESTUDIANTE
        // =====================================

        // 🔍 Buscamos el estudiante usando el UUID recibido
        const student = await this.studentRepo.findOne({

            // 🎯 Condición de búsqueda
            where: {
                // 🔹 El id debe coincidir con el enviado por el cliente
                id : dto.studentId
            }
        });

        // ❌ Si no existe el estudiante
        if(!student){
            // 🚨 Lanzamos excepción HTTP 404
            throw new NotFoundException('Estudiante no encontrado');
        }

    
        // =====================================
        // 🏫 BUSCAR SECCIÓN
        // =====================================

        // 🔍 Buscamos la sección seleccionada
        const section = await this.sectionRepo.findOne({

            // 🎯 Buscamos por UUID
            where:{
                id : dto.sectionId
            },
            // 🔗 Cargamos las relaciones necesarias
            relations: {

                // 📚 Traemos el grado
                grade:{
                    // 📆 Y dentro del grado traemos el año escolar
                    schoolYear: true
                }
            }
        });

        // ❌ Si la sección no existe
        if(!section){

            // 🚨 Error 404
            throw new NotFoundException('Sección no encontrada');
        }

        // =====================================
        // 🚫 VALIDAR SECCIÓN ACTIVA
        // =====================================

        // 🔍 Verificamos el estado actual de la sección
        if(
            section.status !== SectionStatus.ACTIVE
        ){
            // 🚨 Solo se puede matricular en secciones activas
            throw new BadRequestException('La sección se encuentra inactiva');
        }

        // =====================================
        // 📚 OBTENER AÑO ESCOLAR 
        // =====================================

        // 🔗 Gracias a las relaciones cargadas:
        // ✅ Section -> Grade -> SchoolYear , podemos obtener el año escolar automáticamente
        const schoolYear = section.grade.schoolYear;

        // =====================================
        // 🚫 VALIDAR AÑO ESCOLAR ACTIVO
        // =====================================

        // 🔍 Solo permitimos matrículas en años escolares
        if(
            schoolYear.status !== SchoolYearStatus.ACTIVE
        ){
            throw new BadRequestException('El año escolar no se encuentra activo')
        };

        // =====================================
        // 🚫 EVITAR MATRÍCULA DUPLICADA
        // =====================================

        // 🔍 Buscamos si ya existe una matrícula para este estudiante en este mismo año escolar
        const exists = await this.enrollementRepo.findOne({
            where: {
                // 🧑‍🎓 Estudiante
                student: {
                    id : student.id
                },
                // 📚 Año escolar
                schoolYear: {
                    id : schoolYear.id
                }
            }
        });

        // ❌ Si ya existe matrícula
        if(exists){

            // 🚨 Evitamos duplicados
            throw new ConflictException('El estudiante ya está matriculado en este año escolar');
        }

        // =====================================
        // ✨ CREAR ENTIDAD
        // =====================================

        // 🏗️ Creamos la entidad en memoria
        const enrollment = this.enrollementRepo.create({
            // 🧑‍🎓 Estudiante encontrado
            student,
            // 📚 Año escolar obtenido desde la sección
            schoolYear,
            // 🏫 Sección seleccionada
            section
        });

        // =====================================
        // 💾 GUARDAR EN BASE DE DATOS
        // =====================================

        // 💾 Persistimos la matrícula
        return await this.enrollementRepo.save(enrollment);

    }


    // 📋 Obtener todas las matriculas registradas
    async findAll() : Promise<Enrollement[]>{

        // 🔍 Consultamos todas las matrículas de la base de datos
        const enrollments = await this.enrollementRepo.find({

            // 🔗 Cargamos las relaciones necesarias para devolver información completa
            relations:{
                // 🧑‍🎓 Estudiante matriculado
                student:{
                    // 👤 También cargamos el usuario asociado al estudiante
                    // 👉 Aquí se encuentran nombres, apellidos, correo, estado
                    user: true
                },

                // 📆 Año escolar al que pertenece la matrícula
                schoolYear: true,

                // 🏫 Sección asignada al estudiante
                section: {

                    // 📚 También cargamos el grado de la sección
                    grade : true
                }
            },
            
            // 📌 Ordenamos por fecha de creación descendente 
            // 👉 Las matrículas más recientes aparecerán primero
            order:{
                createdAt: 'DESC'
            } 
        });
        // 📤 Retornamos la lista completa de matrículas
        return enrollments;
    }
}

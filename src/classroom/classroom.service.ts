import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classroom } from 'src/entities/classroom.entity';
import { School } from 'src/entities/school.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Injectable() // 💉 Indicamos que esta clase puede ser inyectada por Nest
export class ClassroomService { // 🏫 Servicio encargado de la lógica de negocio de classrooms

    // 🧱 Constructor (DI)
    constructor(
        // 🗄️  Inyectamos el repositorio de Classroom
        @InjectRepository(Classroom)
        private readonly classroomRepo: Repository<Classroom>, // 📚 Acceso a la tabla de classrooms

    ){} // ✅ Fin del constructor

    // ✅ CREATE: Crear Classroom

    // 🧠 Método para crear una nueva aula física
    // 📤 Devuelve el aula creada
    async create(dto: CreateClassroomDto) : Promise<Classroom>{
 
        // 🧼 Normalizamos el nombre del aula
        // 🧠 Ejemplo: "   Aula 101 "  -> "Aula 101"
        const normalizedName = dto.name.trim();
        
        // 🧼 Normalizamos el código del aula
        // 🧠 Ejemplo: " a101" -> "A101"
        const normalizedCode = dto.code.trim().toUpperCase();

        // 🔁 Validamos si ya existe un aula con ese código 
        const existByCode = await this.classroomRepo.findOne({
            where:{ 
                // 🔠 Código normalizado
                code: normalizedCode,  
            },
        });

        // 🚫 Si ya existe un aula con ese código en el mismo colegio, lanzamos 400
        if(existByCode){
            throw new BadRequestException(
              `Ya existe un aula con el código "${normalizedCode}" en este colegio.`,  
            );
        }

        // 🔁 Validamos si ya existe un aula con ese nombre en el colegio activo
        const existByName = await this.classroomRepo.findOne({
            where:{ 
                // 🏷️ Nombre normalizado
                name : normalizedName, 
            },
        });

        // 🚫 Si ya existe un aula con ese nombre en el mismo colegio, lanzamos 400
        if(existByName){
            throw new BadRequestException(
                `Ya existe un aula con el nombre "${normalizedName}".`,
            );
        }

        // 🏗️ Creamos la entidad en memoria(AÚN NO se guarda en la BD)
        const entity = this.classroomRepo.create({
            name : normalizedName, // 🏷️ guardamos el nombre limpio
            code: normalizedCode, // 🔠 guardamos el código limpio y en mayúscula
            capacity: dto.capacity, // 👥 capacidad la capacidad del aula
            floor: dto.floor, // 🏢 Piso donde se encuentra el aula
            isActive: true, // 🟢 Por defecto el aula nace activa

            // 🔗 Alternativa opcional si quieres setear la relación completa
            //school: {id: dto.schoolId} as any,

        });
        
        try{ // 🛡️ Bloque para capturar posibles errores al guardar
            // 💾 Intentamos guardar el aula en la base de datos
            return await this.classroomRepo.save(entity);
        }catch(error){ // 🚨 Capturamos cualquier error lanzado por la BD

            // 🧨 Si la BD lanza un error SQL (ej: UNIQUE constraint - restricción)
            if(error instanceof QueryFailedError){
                // 🚫 Traducimos el error a un mensaje amigable para el cliente
                throw new BadRequestException(
                    'No se pudo crear el aula (posible duplicado).'
                );
            }

            // 🚨 Si es otro error inesperado, lo relanzamos
            // NestJS lo convertirá en 500 automáticamente
            throw error;
        }
    }

    // 📚 READ: Listar todas las aulas

    // 🧠 Método para obtener TODAS las aulas físicas
    // 📤 Devuelve un arreglo de Classroom
    async findAll(): Promise<Classroom[]>{

        // 🔎 Consultamos todas las aulas en la base de datos
        const classrooms = await this.classroomRepo.find({
            // 🔤 Ordenamos por nombre para mantener consistencia visual
            order:{
                name : 'ASC', // 🔤 Ordenamos alfabéticamente por nombre
            },
        });

        // ✅ Retornamos la lista completa de aulas
        return classrooms;


    }

    // 📚 READ: Buscaar una sola aula por ID

    // 🧠 Método asíncrono para buscar UNA aula por su ID (uuid)
    async findOne(id : string) : Promise<Classroom>{
        // 🔎 Buscamos en la BD un aula cuyo campo "id" sea igual al id recibido
        const classroom = await this.classroomRepo.findOne({
            where: {id} , // 🎯 Filtramos por id
        });

        // 🚫 Si NO se encontró ninguna aula con ese id
        if(!classroom){
            // ❌ Lanzamos 404 para decirle al frontend que ese recurso no existe
            throw new NotFoundException('El aula no existe.');
        }

        // ✅ Si si existe, devolvemos el aula encontrada
        return classroom;
    }

    // 🗑️ REMOVE LÓGICO: Desactivar aula

    // 🧠 Método para desactivar un aula sin borrarla físicamente
    async remove (id : string): Promise<Classroom>{

        // 🔎 Buscamos el aula por id
        const classroom = await this.classroomRepo.findOne({
            where: {id}, // Buscamos por id
        });

        // 🚫 Si el aula no exise, lanzamos 404

        if(!classroom){
            throw new NotFoundException('El aula no existe.');

        }


        // 🔴 Marcamos el aula como inactiva
        classroom.isActive = false;

        // 💾 Guardamos el cambio en la base de datos
        return await this.classroomRepo.save(classroom);


    }


}

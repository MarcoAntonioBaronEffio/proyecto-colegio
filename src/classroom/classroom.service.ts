import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classroom, ClassroomStatus } from 'src/entities/classroom.entity';
import { School } from 'src/entities/school.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import e from 'express';

@Injectable() // 💉 Indicamos que esta clase puede ser inyectada por Nest
export class ClassroomService { // 🏫 Servicio encargado de la lógica de negocio de classrooms

   // 🧩 Repository<Classroom>
   // 👉 Es el puente entre este servicio y la tabla "classroom"
   // 👉 Permite usar métodos de TypeORM como: find(), findOne(), save(), remove(), update()
   constructor(
        // 🏫 Inyectamos el repositorio de Classroom
        @InjectRepository(Classroom)
        private readonly repo: Repository<Classroom> 
   ){}

   // 🏗️ CREAR AULA
   async create (dto : CreateClassroomDto) : Promise<Classroom>{

        try{

            // 🔍 Verificamos si ya existe un aula con el mismo código
            // 👉 El código es UNIQUE en la base de datos
            // 👉 Ejemplo : LAB01, A101
            const duplicate = await this.repo.findOne({
                where: {
                    code: dto.code
                }
            });

            // ❌ Si ya existe un aula con ese código
            // 👉 Lanzamos error de conflicto HTTP 409
            if(duplicate){
                throw new ConflictException(
                    `Ya existe un aula con el código "${dto.code}"`
                );
            }

            // 🧱 Creamos una nueva instancia de Classroom
            // 👉 repo.create() NO guarda todavía en la BD
            // 👉 Solo crea el objeto entidad en memoria

            // 👉 create() solo crea una instancia/objeto de la entidad en memoria utilizando los datos recibidos (dto)
            // ❌ NO guarda en PostgreSQL
            const classroom = this.repo.create({
                // 📦 Expandimos todos los datos del DTO
                // 👉 name, code, description, capacity, floor
                ...dto,
                // 🟢 Estado inicial automático
                // 👉 Toda aula nueva inicia activa
                status: ClassroomStatus.ACTIVE
            });

            // 💾 Guardamos el aula en PostgreSQL
            // 👉 save() hace INSERT automáticamente
            return await this.repo.save(classroom);


        }catch (error){

            // 🎯 Errores controlados
            // 👉 Ya tienen mensaje y códigos HTTP correcto
            if(
                error instanceof ConflictException ||
                error instanceof BadRequestException
            ){
                throw error;
            }

            // 🗄️ Error SQL / Base de datos
            if(error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al crear el aula'
                );
            }

            // 💥 Error inesperado
            throw new InternalServerErrorException(
                'Error inesperado al crear el aula'
            );

        }

   }

   // 📚 OBTENER TODAS LAS AULAS
   async findAll() : Promise<Classroom[]>{

        try{

            // 🔎 Obtenemos todas las aulas
            const classrooms = await this.repo.find({
                // 📊 Ordenamos por nombres ASC
                // Ejemplo: Aula 101 , Aula 102
                order:{
                    name : 'ASC'
                },
                // NO VAMOS A CARGAR LA RELACIÓN CON SECTIONS. tendremos esa opción en el detalle del classrooms y ver 
                // cuantas secciones tiene.
                /*relations :{
                    sections : true
                }*/
            });

            // ✅ Retornamos arreglo
            // 👉 Si no hay registros devuelve []
            return classrooms;

        }catch(error){

            // 💥 Error inesperado
            throw new BadRequestException(
                'Error inesperado al obtener las aulas'
            );
        }

   }


   // 🔍 OBTENER AULA POR ID
   async findOne(id : string) : Promise<Classroom>{

        try{

            // 🔎 Buscamos el aula por ID
            const classroom = await this.repo.findOne({
                // 📦 Condición WHERE
                where: {id},
                // 🔗 Cargamos las secciones relacionadas
                // 👉 Hace JOIN automático
                relations: {
                    sections : true
                }
            });

            // ❌ Si no existe
            if(!classroom){
                throw new NotFoundException(
                    'Aula no encontrada'
                );
            }

            // ✅ Retornamos aula
            return classroom;


        }catch(error){

            // 🎯 Error controlado
            if(error instanceof NotFoundException){
                throw error;
            }

            // 💥 Error inesperado
            throw new BadRequestException(
                'Error inesperado al buscar aula'
            )

        }


   }


   // ✏️ ACTUALIZAR AULA
   async update(
    id : string,
    dto : UpdateClassroomDto
   ) : Promise<Classroom>{

        
        try{

            // 🔍 Buscamos el aula actual
            // 👉 Reutilizamos findOne()
            const classroom = await this.findOne(id);

            // 🧠 Validamos si el código está cambiando
            // 👉 Solo validamos duplicado si realmente cambió
            if(
                dto.code != undefined &&
                dto.code != classroom.code
            ){

                // 🔎 Buscamos si ya existe otra aula con ese código
                const exist = await this.repo.findOne({
                    where : {
                        code: dto.code
                    }
                });

                // ❌ Si existe otro registro con ese código
                // 👉 Y NO es el mismo registro actual
                if(exist && exist.id !== classroom.id){
                    throw new ConflictException(
                        `Ya existe un aula con el código "${dto.code}"`
                    );
                }

            }

            // ✏️ ACTUALIZACIÓN PARCIAL

            // 🏷️ Actualizar nombre
            if(dto.name !== undefined){
                classroom.name = dto.name;
            }

            // 🔢 Actualizar código
            if(dto.code !== undefined){
                classroom.code = dto.code;
            }

            // 📝 Actualizar descripción
            if(dto.description !== undefined){
                classroom.description = dto.description;
            }

            // 👥 Actualizar capacidad
            if(dto.capacity !== undefined){
                classroom.capacity = dto.capacity;
            }

            // 🏢 Actualizar piso
            if(dto.floor !== undefined){
                classroom.floor = dto.floor;
            }

            // 💾 Guardamos cambios
            // 👉 save() detecta que existe ID
            // 👉 Entonces hace UPDATE automáticamente
            return await this.repo.save(classroom);


        }catch(error){

            // 🎯 Errores controlados
            if(
                error instanceof NotFoundException ||
                error instanceof ConflictException ||
                error instanceof BaseAudioContext
            ){
                throw error;
            }

            // 🗄️ Error SQL
            if (error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al actualizar el aula'
                );
            }

            // 💥 Error inesperado
            throw new InternalServerErrorException(
                'Error inesperado al actualizar el aula'
            );
        }
   }

   // 🔄 CAMBIAR ESTADO DEL AULA
   async changeStatus(
        // 🆔 ID del aula
        id: string,
        // 📊 Nuevo estado
        status : ClassroomStatus
   ) : Promise<Classroom>{


        try{

            // 🔎 Buscamos el aula
            const classroom = await this.repo.findOne({

                where : {
                    id
                }

            });

            // ❌ Si no existe 
            if(!classroom){
                throw new NotFoundException(
                    'Aula no encontrada'
                );
            }

            // 🔄 Cambiamos estado
            classroom.status = status;

            // 💾 Guardamos cambios
            return await this.repo.save(classroom);

        }catch(error){

            // 🎯 Error controlado
            if(error instanceof NotFoundException){
                throw error;
            }

            // 💥 Error inesperado
            throw new BadRequestException(
                'Error al cambiar estado del aula'
            );
        }
   }

   // 🗑️ ELIMINAR AULA
   async remove (id : string) : Promise<Classroom>{

        try{

            // 🔎 Buscamos el aula
            const classroom = await this.repo.findOne({

                // 📦 WHERE
                where: {id},
                // 🔗 Incluimos sections
                relations: ['sections']

            });

            // ❌ Si no existe
            if( !classroom){
                throw new NotFoundException(
                    'Aula no encontrada'
                );
            }

            // ⚠️ Validación importante
            // 👉 No permitir eliminar aulas que tengan secciones asociadas
            if(classroom.sections.length > 0){
                throw new BadRequestException(
                    'No se puede eliminar el aula porque tiene secciones asociadas'
                );
            }

            // 🧹 Eliminamos el aula
            await this.repo.remove(classroom);

            // ✅ Retornamos aula eliminada
            return classroom;
            
        }catch(error){

            // 🎯 Errores controlados
            if(
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ){
                throw error;
            }

            // 💥 Error inesperado
            throw new InternalServerErrorException(
                'Error inesperado al eliminar el aula'
            );
        }
   }
}

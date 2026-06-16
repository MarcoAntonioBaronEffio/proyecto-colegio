import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grade, GradeStatus } from 'src/entities/grade.entity';
import { Section, SectionStatus } from 'src/entities/section.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Classroom, ClassroomStatus } from 'src/entities/classroom.entity';

// ‼️ FALTA DOCUMENTAR

@Injectable()
export class SectionService {

    // 🧱 Constructor (DI)

    constructor(

        // 🗄️ Inyectamos el repositorio de Classroom
        @InjectRepository(Classroom)
        private readonly classroomRepo : Repository<Classroom>, // 🎓 Acceso a la tabla classrooms

        // 🗄️ Inyectamos el repositorio de Section
        @InjectRepository(Section)
        private readonly sectionRepo: Repository<Section>, // 📚 Acceso a tabla sections

        // 🗄️ Inyectamos el repositorio de Grade para validar FK
        @InjectRepository(Grade)
        private readonly gradeRepo: Repository<Grade>, // 🎓 Acceso a tabla grades

    ){}

    // ✅ CREATE: Crear Section

    // 🧠 Método para crear una nueva sección
    // 📤 Devuelve la sección creada
    async create (
        dto: CreateSectionDto
    ) : Promise<Section>{

        try{

            // 🎓 BUSCAR GRADE
            // 🔎 Buscamos el grado para evitar guardar un gradeId enválido
            const grade = await this.gradeRepo.findOne({
                // 🔍 where
                // 👉 Filtramos por id del grado
                where: { id : dto.gradeId }, // 🎯 Buscamos por id del grado
                //relations: [], // 🚀 No necesitamos relaciones aquí, porque solo queremos validar existencia 
            });

            // 🚫 Si el grado no existe, lanzamos 404
            if(!grade){
                throw new NotFoundException('El grado (gradeId) no existe');
            }

            // 🧠 VALIDAR ESTADO DEL GRADE

            // ❌ No permitir crear secciones en grados INACTIVE o CLOSED
            if(grade.status !== GradeStatus.ACTIVE){
                throw new BadRequestException(
                    'No se pueden crear secciones en grados inactivos o cerrados'
                );
            }

            //******************************* */


            // 🏫 BUSCAR CLASSROOM

            // 🔎 Buscamos el aula para evitar guardar un classroomId inválido
            const classroom = await this.classroomRepo.findOne({
                // 🔍 Filtramos por id del aula
                where : {
                    id : dto.classroomId
                }
            });

            // 🚫 Si el aula no existe lanzamos 404
            if(!classroom){
                throw new NotFoundException(
                    'El aula (classroomId) no existe'
                );
            }

            // 🧠 VALIDAR ESTADO DEL CLASSROOM

            // ❌ No permitir asignar secciones a aula inactivas
            if(classroom.status !== ClassroomStatus.ACTIVE){
                throw new BadRequestException(
                    'No se pueden asignar secciones a aulas inactivas'
                )
            }

            // 🧼 NORMALIZAR NOMBRE

            // 🧼 Eliminamos espacios innecesarios y convertimos el nombre a mayúsculas
            // 🧠 Ejemplo: " a" -> "A"
            const normalizedName = dto.name.trim().toUpperCase();

            // 🔁 VALIDAR DUPLICADO DE SECCIÓN

            // 🔍 Verificamos si ya existe
            // 👉 (misma sección + mismo turno + mismo grade)
            const existSection = await this.sectionRepo.findOne({
                where:{
                    name : normalizedName, // 🏷️ Mismo nombre de sección
                    shift : dto.shift,      // 🕔 Mismo turno
                    grade : { id: grade.id}, // 🆔 Mismo grado
                },
                // 🔹 Solo necesario si luego necesitas acceder a existSection.grade
                /*relations: {
                    grade: true
                }*/
            });

            // 🚫 Si ya existe una sección igual, lanzamos ERROR 400
            if(existSection){
                throw new BadRequestException(
                    `Ya existe la sección "${normalizedName}" en este grado para el turno ${dto.shift}.`,
                );
            }

            // 🚫 VALIDAR AULA OCUPADA EN EL MISMO TURNO
            // 🔍 Buscamos si otra sección ACTIVA ya usa esta aula en el mismo turno
            const occupiedClassroom = 
                await this.sectionRepo.findOne({
                    // ⚠️ No me queda claro
                    where: {
                        // 🏫 Aula
                        classroom : {
                            
                            id : classroom.id
                        },
                        // ⏱️ Mismo turno
                        shift: dto.shift,
                        // ✅ Solo secciones activas
                        status : SectionStatus.ACTIVE,
                    },
                    // 🔹 Necesario para usar classroom.id
                    relations: {
                        classroom : true
                    }
                });

            // 🚫 Si el aula ya está ocupada
            if(occupiedClassroom){
                throw new ConflictException(
                    'El aula ya está ocupada en este turno'
                );
            }

            // 🏗️ CREAR ENTIDAD
            // 🏗️ Creamos la entidad
            // ⚠️ AÚN NO se guarda en PostgreSQL
            const section = this.sectionRepo.create({
                name: normalizedName, // 🏷️ Nombre limpio y normalizado
                shift: dto.shift, // 🕓 Turno (MORNING/AFTERNOON)
                status: SectionStatus.ACTIVE, // 🟢 Estado inicial por defecto
                // 🎓 Relación hacia Grade
                // 👉 TypeORM automáticamente llenará: grade y grade_id
                grade, 
                // 🏫 Relación hacia Classroom
                // 👉 TypeORM automáticamente llenará: classroom y classroom_id
                classroom
            });

            // 💾 GUARDAR EN BD

            // 💾 save()
            // 👉 Inserta realmente el registro en PostgreSQL
            return await this.sectionRepo.save(section);

        
        } catch(error){

            // 🚫 ERRORES CONTROLADOS
            // 🔀 Relanzamos errores conocidos
            if(
                error instanceof NotFoundException ||
                error instanceof ConflictException ||
                error instanceof BadRequestException){
                    throw error;
                }

            // 🚫 ERRORES DE POSTGRESL

            // 🚫 Error SQL / constraints / UUID / etc
            if(error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al crear la sección'
                );
            }

            // 🚫 Error inesperado
            throw new InternalServerErrorException(
                'Error inesperado al crear la sección'
            );
        }

    }

    // 🧠 Método para obtener TODAS las secciones (Sin filtros)
    // 📤 Devuelve un arreglo de Section
    async findAll(): Promise<Section[]>{

        try{

            // 🔎 Consultamos todas las secciones en la base de datos
            const sections = await this.sectionRepo.find({
            // Evitamos cargar el objeto relacionado
            // Para cargar todo el objeto con el get, simplemente pasalo a true
                relations: {
                grade : true,
                classroom : true
            },
            // 🔤 Ordenamos por nombre para mantener consistencia visual (A, B, C ...)
            order:{
                name : 'ASC',
            }
        });

        // ✅ Retornamos la lista completa 
        return sections;

        }catch (error){

            throw new BadRequestException('Error inesperado al obtener las secciones')

        }

       
    }

    // 🧠 Método asíncrono para buscar UNA sección por su ID (UUID)
    async findOne(id : string) : Promise<Section>{

        try{
            // 🔎 Buscamos en la BD una sección cuyo campo "id" sea igual al id recibido
            // 📌 findOne devuelve: Section | null (undefined) dependiendo de si encontró o no
            const section = await this.sectionRepo.findOne({ 
                // 🔹 where NO carga relaciones automáticamente
                // 🔹 Por eso es importante usar @RelationId() para exponer gradeId sin necesidad de cargar todo el objeto grade 
                // ✨ Importante, si bien es cierto que where no carga relaciones, si nos permite FILTRAR usando relaciones, como
                //   lo es en el caso de UPDATE.
            
            where: {id} ,
            // 🔗 Cargamos relaciones necesarias
            relations:{
                grade: true,
                classroom : true
            }
        });

            // 🚫 Si NO se encontró ninguna sección con ese id
            if(!section){
                // ❌ Lanzamos 404 para decirle al frontend que ese recurso no existe
                throw new NotFoundException('La sección no existe.');
            }

            // ✅ Si sí existe, devolvemos la sección encontrada
            return section;

        }catch (error){

            
            if (error instanceof NotFoundException) throw error;
           
            throw new BadRequestException('Error inesperado al buscar la sección');

        }

        
    } 

    // 📚 READ: Listar Sections por Grade
    // 🧠 Método para obtener las secciones de un grado
    async findByGrade(gradeId: string) : Promise<Section[]>{

        try{

            // 🔎 Validamos que el grado exista
            const grade = await this.gradeRepo.findOne({
                where : {id : gradeId}, // 🎯 buscamos por id
            });

            // 🚫 Si no existe el grado, devolvemos 404
            if(!grade){
                throw new NotFoundException('El grado (gradeId) no existe.');
            }

            return await this.sectionRepo.find({
                where : {
                    gradeId : gradeId,
                    status : SectionStatus.ACTIVE
                },
                order : {
                    name : 'ASC',
                }
            });

        }catch (error){
            if(error instanceof NotFoundException) throw error;

            throw new BadRequestException(
                'Error al obtener secciones por grado'
            );
        }        
    }


    // ✏️ ACTUALIZAR SECCIÓN
    async update(
        id : string,
        dto : UpdateSectionDto
    ) : Promise<Section>{

        try{

            // 🔍 Buscamos sección actual
            // 👉 Reutilizamos findOne()
            const section = await this.findOne(id);

            // 🎓 VALIDAR NUEVO GRADE
            // 🧠 Por defecto usamos el grade actual
            let finalGrade = section.grade;

            // 🔄 Si viene nuevo gradeId
            if(dto.gradeId){
                // 🔍 Buscamos el nuevo grade
                const grade = await this.gradeRepo.findOne({
                    where : {
                        id: dto.gradeId
                    }
                });

                // 🚫 Si no existe
                if(!grade){
                    throw new NotFoundException(
                        `No existe un grado con ID "${dto.gradeId}"`
                    );
                }

                // 🚫 No permitir mover sección a grados inactivos o cerrados
                if(grade.status !== GradeStatus.ACTIVE){
                    throw new BadRequestException(
                        'No se puede mover la sección a un grado inactivo o cerrado'
                    );
                }

                // ✅ Actualizamos referencia final
                finalGrade = grade;
            }

            //********************************************+ */
 
            // 🏫 VALIDAR NUEVO CLASSROOM

            // 🧠 Por defecto usamos classroom actual
            let finalClassroom = section.classroom;

            // 🔄 Si viene nuevo classroomId
            if(dto.classroomId){

                    // 🔍 Buscamos aula
                    const classroom = await this.classroomRepo.findOne({
                        where : {
                            id : dto.classroomId
                        }
                    });

                    // ❌ Si no existe
                    if(!classroom){
                        throw new NotFoundException(
                            `No existe un aula con ID "${dto.classroomId}"`
                        );
                    }

                    // 🚫 No permitir aulas inactivas
                    if (classroom.status !== ClassroomStatus.ACTIVE){
                        throw new BadRequestException(
                            'No se puede asignar una sección a un aula inactiva'
                        );
                    }

                    // ✅ Actualizamos referencia final
            }

            // 🧠 OBTENER VALORES FINALES

            // 🏷️ Nombre final
            // 🧠 Si viene name:
            // 👉 Limpiamos espacios
            // 👉 Convertimos a mayúsculas
            const finalName = 
                dto.name?.trim().toUpperCase()
                ?? section.name;

            // ⏱️ Turno final
            // 🧠 Si no viene shit, usamos el actual
            const finalShift = 
                dto.shift ?? section.shift;

          

            // 🔍 VALIDAR DUPLICADO DE SECCIÓN
            // 🧠 Regla: 
            // 👉 grade + name + shift debe ser único
            const existSection = await this.sectionRepo.findOne({
                where : {
                    name : finalName,
                    shift : finalShift,
                    grade: {
                        id : finalGrade.id
                    }
                },
                // 🔹 Además de traer la sección, también carga la relación "grade"
                relations: {
                   grade : true,
                   classroom : true
                }
            });

            // ❌ Validamos si existe otro registro
            if(existSection && existSection.id != section.id){
                throw new ConflictException(
                    'Ya existe una sección con ese nombre y turno en ese grado'
                );
            }

            // 🚫 VALIDAR AULA OCUPADA EN EL MISMO TURNO

            const occupiedClassroom = 
                await this.sectionRepo.findOne({
                    where: {
                        // 🏫 Aula final
                        classroom: {
                            id : finalClassroom.id
                        },
                        // ⏱️ Turno final
                        shift: finalShift,
                        // ✅ Solo activas
                        status: SectionStatus.ACTIVE
                    },
                    relations:{
                        classroom: true
                    }
                });

            // 🚫 Evitamos comparar consigo misma
            if(
                occupiedClassroom &&
                occupiedClassroom.id !== section.id
            ){
                throw new ConflictException(
                    'El aula ya está ocupada en este turno'
                );
            }

            // ✏️ ACTUALIZACIÓN PARCIAL

            // 🏷️ Actualizar nombre
            section.name = finalName;

            // ⏱️ Actualizar turno
            section.shift = finalShift;

            // 🎓 Actualizar grade
            section.grade = finalGrade;

            // 🏫 Actualizar classroom
            section.classroom = finalClassroom;


            // 💾 GUARDAMOS LOS CAMBIOS
            return await this.sectionRepo.save(section);


        }catch(error){

            console.log(error);

            // 🎯 Errores controlados
            if(
                error instanceof NotFoundException ||
                error instanceof ConflictException ||
                error instanceof BadRequestException
            ){
                throw error;
            }

            // 🗄️ Error SQL
            if(error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al actualizar la sección'
                );
            }

            // 💥 Error inesperado
            throw new InternalServerErrorException(
                'Error inesperado al actualizar la sección'
            )

        }


    }

    async remove(id : string) : Promise<Section>{
        try{
            // 🔍 Buscamos la sección por ID
            const section = await this.sectionRepo.findOne({
                where : { id },
            });

            // ❌ Si no existe, lanzamos 404
            if(!section){
                throw new NotFoundException('Sección no encontrada');
            }

            // ❌ Evitar eliminar si ya está inactive 
            // 🔹 section.status -> es la sección encontrada a través de nuestro id
            if(section.status === SectionStatus.INACTIVE){
                throw new BadRequestException(
                    'No se puede eliminar una sección inactiva'
                );
            }

            // 🧹 Eliminamos físicamente
            await this.sectionRepo.remove(section);

            // 📦 Retornamos la sección eliminada
            return section;

        }catch(error){

            // 🎯 Errores controlados
            if(
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ){
                throw error;
            }

            // 💥 Error inesperado
            throw new BadRequestException(
                'Error inesperado al eliminar la sección'
            );

        }
    }

    async changeStatus(
        id : string,
        status : SectionStatus
    ): Promise<Section>{

        try{

            const section = await this.sectionRepo.findOne({
                where: {id},
                relations : {
                    grade: true,
                    classroom : true 
                }
            });

            if(!section){
                throw new NotFoundException('Sección no encontrada');
            }

            section.status = status;

            return await this.sectionRepo.save(section);

        }catch(error){
            if(error instanceof NotFoundException) throw error;

            throw new BadRequestException(
                'Error al cambiar estado de la sección'
            );
        }

    }
 
   

}

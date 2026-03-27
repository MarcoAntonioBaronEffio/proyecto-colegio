import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grade } from 'src/entities/grade.entity';
import { Section } from 'src/entities/section.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';

@Injectable()
export class SectionService {

    // 🧱 Constructor (DI)

    constructor(
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
    async create (dto: CreateSectionDto) : Promise<Section>{

        // 🔎 Buscamos el grado para evitar guardar un gradeId enválido
        const grade = await this.gradeRepo.findOne({
            where: { id : dto.gradeId }, // 🎯 Buscamos por id del grado
            relations: [], // 🚀 No necesitamos relaciones aquí
        });

        // 🚫 Si el grado no existe, lanzamos 404
        if(!grade){
            throw new NotFoundException('El grado (gradeId) no existe');
        }

        // 🧼 Normalizamos el nombre de la sección
        // 🧠 Ejemplo: " a" -> "A"
        const normalizedName = dto.name.trim().toUpperCase();

        // 🔁 Validamos duplicado a nivel de aplicación
        // 🧠 Regla de negocio: (gradeId + name + shift) debe ser único
        const exists = await this.sectionRepo.findOne({
            where:{
                grade : {id: grade.id}, // 🆔 mismo grado
                name : normalizedName, // 🏷️ mismo nombre de sección
                shift : dto.shift      // 🕔 mismo turno
            }
        });

        // 🚫 Si ya existe una sección igual, lanzamos 400
        if(exists){
            throw new BadRequestException(
                `Ya existe la sección "${normalizedName}" en este grado para el turno ${dto.shift}.`,
            );
        }

        // 🏗️ Creamos la entidad (AÚN NO se guarda en la BD)
        const entity = this.sectionRepo.create({
            grade : grade, // 🆔 FK hacia grade
            name: normalizedName, // 🏷️ nombre limpio
            shift: dto.shift, // 🕓 turno (MORNING/AFTERNOON)
            isActive: true, // 🟢 por defecto la sección nade activa

            // 🔗 Alternativa opcional si quieres setear la relación completa
            //grade : {id : dto.gradeId} as any,
        });


        try{

            // 💾 Intentamos guardar en la base de datos
            return await this.sectionRepo.save(entity);

        }catch(error){

            // 🧨 Si la BD lanza un error SQL (ej: UNIQUE constraint)
            if(error instanceof QueryFailedError){
                // 🚫 Traducimos un mensaje amigable para el cliente
                throw new BadRequestException(
                    'No se pudo crear la sección (posible duplicado).',
                );
            }

            // 🚨 Si es otro error inesperado, lo relanzamos
            // NestJS lo convertirá en 500 automáticamente
            throw error;

        }

    }

    // 🧠 Método para obtener TODAS las secciones (Sin filtros)
    // 📤 Devuelve un arreglo de Section
    async findAll(): Promise<Section[]>{
        // 🔎 Consultamos todas las secciones en la base de datos
        const sections = await this.sectionRepo.find({
            // 🔤 Ordenamos por nombre para mantener consistencia visual (A, B, C ...)
            order:{
                name : 'ASC',
            }
        });

        // ✅ Retornamos la lista completa 
        return sections;
    }

    // 🧠 Método asíncrono para buscar UNA sección por su ID (UUID)
    async findOne(id : string) : Promise<Section>{
        // 🔎 Buscamos en la BD una sección cuyo campo "id" sea igual al id recibido
        // 📌 findOne devuelve: Section | null (undefined) dependiendo de si encontró o no
        const section = await this.sectionRepo.findOne({ where: {id} });

        // 🚫 Si NO se encontró ninguna sección con ese id
        if(!section){
            // ❌ Lanzamos 404 para decirle al frontend que ese recurso no existe
            throw new NotFoundException('La sección no existe.');
        }

        // ✅ Si sí existe, devolvemos la sección encontrada
        return section;
    } 

    // 📚 READ: Listar Sections por Grade

    // 🧠 Método para obtener las secciones de un grado
    async findByGrade(gradeId: string) : Promise<Section[]>{
        // 🔎 Validamos que el grado exista
        const grade = await this.gradeRepo.findOne({
            where : {id : gradeId}, // d🎯 buscamos por id
        });

        // 🚫 Si no existe el grado, devolvemos 404
        if(!grade){
            throw new NotFoundException('El grado (gradeId) no existe.');
        }

        // 📚 Buscamos secciones ACTIVAS de ese grado
        const sections = await this.sectionRepo.find({
            where: {
                gradeId : gradeId, // 🆔 filtramos por grado
                isActive: true, // 🟢 solo secciones activas
            },
            order:{
                name : 'ASC', // 🔤 orden alfabético: A, B, C ...
            },
        });

        // ✅ Retornamos la lista al controlador
        return sections;
    }

 
   

}

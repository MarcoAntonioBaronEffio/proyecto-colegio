import { 
    BadRequestException,
    ConflictException, // 🚫 Se lanza cuando ocurre un conflicto de datos (por ejemplo: grado duplicado)
    Injectable,        InternalServerErrorException,        // 💉 Decorador que marca la clase como inyectable (para usar en otros módulos)
    NotFoundException  // ❌ Se lanza cuando no se encuentra un recurso (ej: ID inexistente)
} from '@nestjs/common';
// 🧩 Decorador para inyectar repositorios de TypeORM en nuestro servicio
import { InjectRepository } from '@nestjs/typeorm';
// 🎓 Entidad "Grade" -> representa la tabla de grados escolares en la base de datos
import { Grade, GradeStatus } from 'src/entities/grade.entity';
// 🗃️ Clase genérica de TypeORM para realizar operaciones CRUD sobre entidades
import { QueryFailedError, Repository } from 'typeorm';
// 🧾  DTO para validar y tipar los datos que llegan al crear un nuevo grado
import { CreateGradeDto } from './dto/create-grade.dto';
// 🏫 Entidad "SchoolYear" -> representa la tabla de años escolares en la base de datos 
// Se importa porque los grados tienen una relación ManyToOne con SchoolYear
import { SchoolYear, SchoolYearStatus } from 'src/entities/school-year.entity';
//import { SchoolYearStatus } from 'src/school-years/school-year-status.enum';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {

    // 🧩 Qué es un repositorio -> En TypeORM es el puente entre nuestro servicio y la base de datos para 
    // una entidad específica. Cada entidad (Grade, SchoolYear, User, etc) tiene su propio repositorio
    // con métodos como : find(), findOne(), save(), update(), delete(), count()
    // 
    // 🏗️ Por qué a veces necesitas dos repositorios -> En nuestro caso, el servicio principal es GradesService.
    //Pero al crear el grado, necesitamos validar que el año escolar exista.

    constructor(
        // 🧱 Inyectamos el repositorio de 'Grade'
        @InjectRepository(Grade)
        private readonly repo : Repository<Grade>,

        // 🏫 Inyectamos el repositorio de 'SchoolYear' (para validar existencia)
        @InjectRepository(SchoolYear)
        private readonly syRepo : Repository<SchoolYear>,
    ){}

    // 🧱 Método para crear un nuevo grado
    // 🧩 Recibimos un DTO validado y retorna la entidad guardada en la BD
    async create (dto: CreateGradeDto) : Promise<Grade>{

        try{

            // ✅ Buscamos el año escolar ACTIVO (backend lo manda)
            const activeSchoolYear = await this.syRepo.findOne({
                where : {status : SchoolYearStatus.ACTIVE},
            });

            // ❌ Si no hay año escolar activo, no se puede crear el grado
            if(!activeSchoolYear){
                throw new NotFoundException('No existe un año escolar activo');
            }

            // ❌ No permitir si está cerrado (seguridad extra)
            if(activeSchoolYear.status === SchoolYearStatus.CLOSED){
                throw new BadRequestException('El año escolar está cerrado');
            }

            
             // ✅ Validar duplicados en el AÑO ACTIVO
             const duplicate = await this.repo.findOne({
                where:{
                    gradeNumber: dto.gradeNumber,
                    level : dto.level,
                    schoolYear: {id : activeSchoolYear.id}
                },
             });

             if(duplicate){
                throw new ConflictException(
                    `Ya existe el grado "${dto.gradeNumber}" de ${dto.level.toLocaleLowerCase()} en el año escolar ${activeSchoolYear.year}.`,
                );
             }

             // ✅ Crear entidad y enlazar el año activo
             const grade = this.repo.create({
                ...dto, // ✅ level + gradeNumber (y otros defaults del entity se aplican solos)
                schoolYear : activeSchoolYear, // ✅ asingnamos el objeto activo
                status: GradeStatus.ACTIVE,
             });

             // ✅ Guardar y devolver
             return await this.repo.save(grade);

        }catch(error){
            console.log(error);
            // 🎯 Atrapamos errores CONTROLADOS
            // Estos errores los lanzamos a propósito
            // - NotFoundException -> 404
            // - ConflictException -> 409
            // Comoo ya tienen código y mensaje correcto -> solo los re-lanzamos
            if(
                error instanceof NotFoundException ||
                error instanceof ConflictException ||
                error instanceof BadRequestException
            ){
                // 🔁 Nest devuelve el json correcto sin modificar
                throw error;
            }

            // 💥 Si el error NO es controlado (error de TypeORM, conexión, etc.) lanzamos un 400 genérico
            throw new BadRequestException('Error inesperado al crear el grado')

        }    
    }

    // ✏️ Método update
    // 📌 Sirve para actualizar un grado existente en la base de datos
    // 📌 Recibe:
    // 1️⃣ id -> identificador del grado
    // 2️⃣ dto -> datos nuevos que podrían llegar (gradeNumber, level)
    // 📌 Devuelve el grado actualizado
    async update (id : string, dto : UpdateGradeDto) : Promise<Grade>{

        try{

            // ✅ Buscamos el grado actual por ID
            // 📌 Usamos findOne para reutilizar tu lógica (y lanzar NotFound si no existe)
            const grade = await this.findOne(id);

            // 🧠 Validación importante
            // 🔍 Este if valida si hay cambios en los campos importantes del grado
            // 👉 El número de grado (gradeNumber)
            // 👉 O el nivel (level)
            if(

                // 🧠 Primera condición (lado izquierdo del OR "!!")
                // 📌 Verificamos si el gradeNumber viene en el DTO (es decir, el usuario lo está enviando)
                // 📌 Y además, que sea diferente al que ya existe en la base datos
                // 👉 Si ambas se cumplen, significa que el número de grado está cambiando
                (dto.gradeNumber !== undefined && dto.gradeNumber !== grade.gradeNumber) ||

                // 🧠 Segunda condición (lado derecho del OR "!!")
                // 📌 Verificamos si el level viene en el DTO (el usuario lo está enviando)
                // 📌 Y además, que sea diferente al nivel actual del grado en la BD
                // 👉 Si ambas se cumplen, significa que el nivel está cambiando
                (dto.level !== undefined && dto.level !== grade.level)
            ){

                // 🔎 Buscamos si ¿ya existe otro grado con los mismos datos?
                // 👉 Es decir: mismo número + mismo nivel + mismo año escolar
                // ⭐️ Verificamos si ya existe un registro que entraría en conflicto con lo que queremos actualizar
                // ⭐️ Busca si ya existe un grado con los mismos datos (gradeNumber + level + schoolYear)
                const exists = await this.repo.findOne({

                    // 📦 Condiciones de búsqueda
                    where:{

                        // 🧠 Si el usuario mandó gradeNumber -> usamos ese nuevo valor
                        // 🧠 Si NO lo mandó -> usamos el valor actual del grado
                        // 👉 Esto evita que falle la validación cuando solo se cambia uno de los campos
                        // ⭐️ ?? -> Usa el nuevo valor si existe, sino el actual
                        gradeNumber : dto.gradeNumber ?? grade.gradeNumber,

                        // 🧠 Igual que arriba pero con el nivel
                        // 👉 Si viene con el DTO usamos el nuevo
                        // 👉 Si no, usamos el actual
                        level: dto.level ?? grade.level,

                        // 🏫 Filtramos por el mismo año escolar
                        // 👉 Esto es CLAVE para no comparar con grados de otros años
                        // 👉 Usamos schoolYearId gracias a @RelationId
                        schoolYear : {id : grade.schoolYearId},

                    },
                });

            

                // 💫 IMPORTANTE: "where" ya te dice si existe un registro igual
                // 💫 PERO NO te dice si es el mismo registro que estás editando
                
                // 🔍 Verificamos si ya existe un registro con esos mismos datos
                // ⭐️ Este bloque sirve exactamente para detectar si estás intentando crear un duplicado al actualizar 
                // ⭐️ En otras palabras: "Si encontré un registro con esos datos y NO es el mismo que estoy editando... entonces hay duplicado -> error"
                // 📌  exist -> significa que la BD encontró un grado con ese gradeNumber + level + schoolYear
                // 📌  exist.id !== grade.id -> significa que el registro encontrado (osea uno ya guardado) NO es el mismo que estamos editando
                // 👉 Esto evita que el propio registro se detecte como duplicado (falso positivo)
                
                // 🔹 exists -> es una variable que guarda el resultado de la búsqueda (grade)
                // 🔹 exist.id -> el ID del registro que encontré en la base de datos
                // 🔹 grade.id -> el registro que estás editando
                
                // 💫 Si de diera el caso : exists.id === grade.id 
                // 👉 Significa que el registro exontrado el es MISMO que estamos editando
                // 👉 Es decir, no hay conflicto real de duplicado
                // 👉 Por lo tanto , la actualización si estaría permitida
                if(exists && exists.id !== grade.id){
                    // 🚨 Lanzamos un error de conflicto (400)
                    // 👉 Significa que ya existe un grado con esos mismos datos
                    throw new ConflictException(`Ya existe ese grado en este año escolar`);
                }
            }

            // ✅ Actualización parcial

            // 🔢 Actualizamos gradeNumber si vino
            if(dto.gradeNumber !== undefined){
                grade.gradeNumber = dto.gradeNumber;
            }

            // 🏷️ Actualizamos level si vino
            if(dto.level !== undefined){
                grade.level = dto.level;
            }

            // 💾 Guadamos cambios
            return await this.repo.save(grade);

        }catch (error){

            // ✅ Errores controlados -> se relanzan
            if(
                error instanceof NotFoundException ||
                error instanceof BadRequestException ||
                error instanceof ConflictException
            ){
                throw error;
            }

            // 🗄️ Error en la base de datos
            if(error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al actualizar el grado',
                );
            }

            // 💥 Error inesperado
            throw new InternalServerErrorException(
                'Error inesperado al actualizar el grado'
            );

        }



    }

    // 📚 Obtenemos todos los grados
    async findAll () : Promise<Grade[]>{
        try{
            // 🔍 1️⃣ Buscamos todos los grados de la tabla "grades".
            // this.repo.find() viene de TypeORM y devuelve un array de entidades Grade.
            // Incluimos la relación con el año escolar para tener el contexto completo
            const grades = await this.repo.find({
                // Hace referencia directamente al nombre de la propiedad que tienes declarada en tu entidad
                // "Grade", la cual define la relación ManyToOne con la entidad SchoolYear.
                // 🔹 relations solo sirve para cargar (seleccionar) la data relacionada en el resultado, así evitamos hacer otra consulta para ver el año escolar 
                // del grado
                //relations : ['schoolYear'], // 🔗 Carga los datos del año escolar asociado
                order: {
                    level : 'ASC',
                    gradeNumber : 'ASC',
                },  

                // select * from grades order by level ASC , grade_number ASC;

            });

            // ⚠️ 2️⃣ Si no hay registro, devolvemos un arreglo vacío (sin lanzar error)
            // (Esto permite al frontend simplemente mostrar "sin resultados")
            return grades;

        }catch(error){
            // ❌ Si ocurre cualquier error inesperado (problema de conexión, error de BD, etc.)
            // lanzamos una excepción de tipo BadRequestException
            // Nest convertirá esto en una respuesta HTTP 400
            throw new BadRequestException('Error inesperado al obtener los grados');
        }
        
    }

    // 🔍 Obtener un grado por su ID
    async findOne(id: string) : Promise<Grade>{
        try{
            // 🔎 1️⃣ Buscamos un registro en la tabla "grades" cuyo campo "id" coincida con el ID recibido.
            // Además, cargamos la relación con schoolyear para obtener el año escolar del grado.
            const grade = await this.repo.findOne({
                where : { id },
                // relations: [schoolYear] -> carga la relación ManyToOne con schoolyear 
                // 🔹 Traeme también el registro que tiene relación con este registro.
                // 👉🏼 Le decimos a TypeOrm: Además del grado (Grade), haz el JOIN con la tabla school_years y 
                // tráeme el objeto completo del año escolar (SchoolYear) que esté vinculado por la relación @ManyToOne
                relations: ['schoolYear'], // 🔗 Incluimos el año escolar
            });

            // ⚠️ 2️⃣ Si no encuentra el grado, lanzamos un error 404
            // Esto es un error "controlado" porque sabemos exactamente que pasó
            if(!grade){
                throw new NotFoundException('Grado no encontrado ❌');
            }

            // ✅ 3️⃣ Si existe, lo retornamos tal cual
            return grade;

        }catch(error){
            // 🎯 Si el error que vino desde el try es un NotFoundException
            // lo RE-LANZAMOS tal cual, sin modificarlo
            // ¿Por qué? Porque:
            // - Ya tiene el código correcto 404
            // - Ya tiene un mensaje claro ("Grado no encontrado")
            // - NestJS sabe cómo evitarlo al cliente automáticamente
            if(error instanceof NotFoundException) throw error;

            // 💥 Si llegó CUALQUIER otro tipo de error (problema de conexión, error SQL, etc).
            // entonces devolvemos un error genérico 400 para no revelar detalles internos.
            throw new BadRequestException('Error inesperado al buscar el grado');
        }
        
    }

    // 🗑️ Eliminar un grado por ID
    async remove (id: string) : Promise<Grade>{
        try{
            // 🔍 1️⃣ Buscamos el grado que queremos eliminar
            // Esto es importante porque:
            // - Necesitamos saber si existe antes de borrarlo.
            // - Queremos devolverlo después (aunque ya esté eliminado)
            //
            // - Incluimos la relación 'schoolYear' para poder devolver el año escolar asociado.
            // - Si no incluimos 'relations', solo obtendríamos los campos del grado.
            const grade = await this.repo.findOne({
                where: {id},    // 🔎 Filtro: buscamos por ID único
                //relations: ['schoolYear'], // 🔗 Incluimos el año escolar relacionado (JOIN automático), carga la relación con schoolYear
            });

            // ⚠️ 2️⃣ Si el grado no existe, lanzamos una excepción 404 (NotFound)
            if(!grade){
                // 🚫 Esto corta la ejecución y Nest devuelve automáticamente una respuesta 404 al cliente.
                throw new NotFoundException('Grado no encontrado ❌');
            }

            // 🧹 3️⃣ Si existe, eliminamos el registro usando 'remove'.
            // TypeORM usa remove() para eliminar una entidad completa.
            // - Importante: 'remove()' recibe la entidad completa (no solo el ID)
            // - TypeORM internamente genera un DELETE con el ID del objeto.
            await this.repo.remove(grade);

            // 📦 4️⃣ Retornamos el objeto grado eliminado
            // - Ojo: aunque ya no existe en la base de datos, la variable 'grade' sigue teniendo
            // los datos cargados en memoria.
            // - Esto nos permite devolver al cliente la información del registro eliminado.
            return grade; // ✅ Devuelve solo los datos del grado eliminado. 

        }catch(error){

            // 🎯 Si el error es un NotFoundException, lo re - lanzamos
            // NestJS lo convertirá en un HTTP 404 automáticamente
            if(error instanceof NotFoundException) throw error;

            // 💥 Si ocurre cualquier otro error inesperado (problemas de BD , conexión, etc.)
            // lanzamos un error genérico sin revelar detalles internos
            throw new BadRequestException('Error inesperado al elminar el grado');

        }
        
    }

    // 🔁 Método para cambiar el estado de un grado (ACTIVE / INACTIVE / CLOSED)
    async changeStatus(

        // 🆔 Id del grado que queremos modificar
        id : string,
        // 📊 Nuevo estado que queremos asignar (enum GradeStatus)
        status : GradeStatus

    ) : Promise<Grade>{ // 📦 Retorna el grado actualizado

        try{
            // 🔍 Buscamos el grado en la base de datos por su ID
            // 👉 findOne devuelve el registro o null si no existe
            const grade = await this.repo.findOne({ where : { id }});

            // ❌ Si no encontramos el grado, lanzamos error 404
            // 👉 Esto evita trabajar con datos inexistentes
            if(!grade){
                throw new NotFoundException('Grado no encontrado');
            }

            // 🔄 Asignamos el nuevo estado al grado encontrado
            // 👉 Aqui NO guardamos nada todavía, solo modificamos en memoria
            grade.status = status;

            // 💾 Guardamos los cambios en la base de datos
            // 👉 save() hace UPDATE automáticamente porque la entidad ya tiene ID
            // 👉 También actualiza updatedAt automáticamente
            return await this.repo.save(grade);

        }catch(error){

            // 🎯 Si el error ya es NotFoundException, lo re-lanzamos tal cual
            // 👉 NestJS ya sabe cual convertirlo en respuesta http 404
            if(error instanceof NotFoundException) throw error;

            // 💥 Si ocurre cualquier otro error (BD, conexión, etc)
            // 👉 Lanzamos un error genérico para no exponer detalles internos
            throw new BadRequestException('Error al cambiar estado del grado'); 

        }

    }
    
}

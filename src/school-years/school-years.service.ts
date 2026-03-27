import { 
    ConflictException,  // 🚫 Excepción para conflictos (ej: año duplicado)
    Injectable,         // 💉 Decorador que indica que la clase se puede inyectar como dependencia
    NotFoundException,  // ❌ Excepción para cuando no se encuentre un recurso (404)
    BadRequestException, // ⚠️ Excepción para solicitudes inválidas o no permitidas
    InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // 🧩 Permite a Nest inyectar un repositorio TypeOrm
import { QueryFailedError, Repository } from 'typeorm'; // 🗃️ Clase genérica para acceder a métodos CRUD
import { SchoolYear } from 'src/entities/school-year.entity'; // 🏫 Entidad que representa la tabla 'school_years' 
import { CreateSchoolYearDto } from './dto/create-school-year.dto'; // 🧾 DTO que define la forma esperada de los datos de creación
import { School } from 'src/entities/school.entity';
import { SchoolYearStatus } from './school-year-status.enum';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';

// 💉 Hace que esta clase pueda ser inyectada en controladores u otros servicios
@Injectable()
export class SchoolYearsService {
    // ⚙️ Constructor donde inyectamos el repositorio de la entidad
    constructor(
        // 🏗️  Inyección del repositorio que maneja la tabla school_years
        @InjectRepository(SchoolYear)
        // 🧩 repo nos da acceso a métodos como find, save, update, etc.
        private readonly repo : Repository<SchoolYear>,
        

         // 🏗️ Inyección del repositorio que maneja la tabla school
        @InjectRepository(School)
        // 🧩 repo de colegio
        private readonly schoolRepo : Repository<School>,
    ){}

    // 🧠 Método para crear un nuevo año escolar
    // 📤 Devuelve una promesa que resolverá un objeto SchoolYear (la entidad creada) 
    async create(dto: CreateSchoolYearDto) : Promise<SchoolYear>{
        try{

        // ✅0️⃣ Buscamos el colegio ÚNICO (DEFAULT) para ligar el año escolar automáticamente
        const school = await this.schoolRepo.findOne({
            where: {code: 'DEFAULT'}, // 🏫 Buscamos el colegio sembrado por tu seed (code fijo) 
        });

        // 🚫 Si no existe, significa que no corriste el seed o se borró el registro
        if(!school){
            // ❌ Lanzamos 404 porque "no existe el recurso requerido para continuar"
            throw new NotFoundException(
                'No existe el colegio DEFAULT. Ejecuta: npm run seed:school',
            );
        }

        // 🔎 Comprobamos si ya existe un año con el mismo número (para evitar duplicados)
        // ✅ Como tu unique ideal es (school + year) , validamos con ambos
        const exists = await this.repo.findOne({
            where: {
                year: dto.year, // 📅 Año
                school : {id : school.id}, // 🏫 Mismo colegio  
            }});

        // 🚫 Si existe, lanzamos un error 400 Confict
        if(exists){
            throw new ConflictException(`El año ${dto.year} ya existe`);
        }
 

        // 🏗️ Creamos el nuevo año escolar como PLANNED (planificado)
        // ✅ No tocamos el año ACTIVE actual; solo lo planificamos
        const entity = this.repo.create({
            ...dto,          // 📦 Copiamos todas las propiedades del DTO (año, fechas, etc). 
            status: SchoolYearStatus.PLANNED,  // 📝 Estado por defecto realista
            school : { id: school.id }, // 🏫  Relación ManyToOne por id
        });
        
        // 💾 Guardamos la entidad en la base de datos y devolvemos el resultado completo.
        return await this.repo.save(entity);

        // 🔹 Atrapamos el error
        }catch(error){

            // ✅ Re-lanzamos los errores controlados

            // 🔹 Detectamos si el error es un Conflict, BadRequest o NotFound
            // 🧱 Este bloque 'catch' se ejecuta si algo falla dentro de 'try'.
            // Es decir, si en el 'try' se lanzó un 'throw' (ya sea nuestro, o un error de TypeORM, o cualquier cosa que lance una excepción).
            // 🎯 Aquí hacemos una PRIMERA PREGUNTA :
            // 👉 ¿Este error es uno de los que YO lancé a propósito?
            if(
                error instanceof ConflictException || // ❗ Si el error es un conflicto (ej: año duplicado)
                error instanceof BadRequestException || // ⚠️ Si es un error de petición inválida (ej: datos malos)
                error instanceof NotFoundException    // ❌ Si es un "no encontrado" (ej: año no existe)
            ){
                // 🔹 throw error -> Lo vuelve a lanzar el error ya atrapado, para que NESTJS construya y envíe el JSON con el código y mensaje correctos..
                // 🔁 En este caso NO lo tocamos, NO lo cambiamos.
                // Simplemente lo volvemos a lanzar tal cual.
                // ¿Por qué? porque:
                // - Ya trae su código HTTP correcto (404, 409, 400)
                // - Ya trae un mensaje claro que tú definiste.
                // 🔹 entonces 
                throw error;
            }
            // Si es error SQL/TypeORM 
            if(error instanceof QueryFailedError){
                throw new BadRequestException('Error de base de datos al crear el año escolar');
            }

            // 💥 Cualquier otro error raro -> 500
            throw new InternalServerErrorException('Error inesperado al crear el año escolar');
        }
    }

    // ✏️ Método update 
    // 📌 Este método sirve para actualizar un año escolar existente en la base de datos
    // 📌 Recibe 2 cosas:
    // 1️⃣ id -> el identificador del año escolar que queremos modificar
    // 2️⃣ dto -> un objeto con los nuevos datos que podrían llegar para actualizar
    // 📌 Devuelve una Promesa que, si todo sale bien,  resolverá con un objeto SchoolYear actualizado
    async update(id : string, dto : UpdateSchoolYearDto) : Promise<SchoolYear>{

        // 🛡️ Iniciamos un bloque try
        // 📌 Todo el proceso de actualización irá dentro de este bloque
        // 📌 Si ocurre algún error en cualquier parte, saltará automáticamente el catch
        try{

            // ✅ Buscamos el año escolar actual usando su id
            // 📌 Antes de actualizar, primero necesitamos verificar que el registro exista
            // 📌 this.findOne(id) normalmente busca en la base de datos un SchoolYear con ese id
            // 📌 Si no existe, muy probablemente este método lanzará un NotFoundException
            // 📌 Guardamos el resultado en la constante schoolYear
            const schoolYear = await this.findOne(id);

            // ✅ Validamos si el campo year vino en el DTO y además es distinto al actual
            // 📌 dto.year !== undefined
            //   significa que el cliente si envió un nuevo valor para year
            // 📌 dto.year !== schoolYear.year
            //   significa que el nuevo año es diferente al que ya tiene guardado el registro
            // 📌 Esto evita validar de más cuando el usuario no quiere cambiar el año o cuando manda el mismo valir que ya estaba
            if(dto.year !== undefined && dto.year !== schoolYear.year){

                // 🔎 Buscamos en la base de datos si ya existe otro registro con ese mismo año
                // 📌 this.repo.findOne(...) intenta encontrar un SchoolYear cuyo campo year sea igual al nuevo valor enviado en dto.year
                // 📌 Si encuentra uno, lo guardará en exists.
                // 📌 Si no encuentra nada, exists será null o undefined
                const exists = await this.repo.findOne({

                    // 📌 where indica la condición de búsqueda en la base de datos
                    // 📌 Aqui estamos diciendo: "busca un año escolar cuyo year sea igual a dto.year"
                    where:{
                        // 📌 year : dto.year
                        // ✅ Comprobamos el campo year en la base de datos con el nuevo año enviado por el cliente
                        year: dto.year,
                    },
                });


                // ❌ Verificamos si se encontró un registro con ese mismo año
                // 📌 exists: significa que si se encontró un año escolar con ese valor
                // 📌 exists.id !== schoolYear.id: significa que el registro encontrado NO es el mismo que estamos editando
                // 📌 esto es importante porque si encontramos el mismo registro actual, no sería un conflicto real
                if(exists && exists.id !== schoolYear.id){

                    // 🚨 Lanzamos una excepión de conflicto
                    // 📌 ConflictException se usa cuando intentamos guardar algo que rompe una regla lógica del sistema, como duplicar ela año
                    // 📌 El mensaje indica claramente qué año ya existe 
                    throw new ConflictException(`El año ${dto.year} ya existe`);
                }
               }

                // ✅ Verificamos si el campo year llegó en el DTO
                // 📌 Solo actualizamos este campo si el cliente realmente lo envío
                // 📌 Esto permite hacer actualizaciones parciales
                if(dto.year !== undefined){

                    // ✏️ Reemplazamos el valor actual del año por el nuevo valor
                    // 📌 Estamos modificando directamente la propiedad year del objeto schoolYear que recuperamos antes
                    schoolYear.year = dto.year;
                }

                // ✅ Verificamos si llegó el campo startsOn en el DTO
                // 📌 Si no vino, no tocamos la fecha de inicio actual
                if(dto.startsOn !== undefined){
                    // 📅 Actualizamos la fecha de inicio
                    // 📌 Asignamos el nuevo valor recibido en dto.startsOn al objeto schoolYear
                    schoolYear.startsOn = dto.startsOn;
                }

                // ✅ Verificamos si llegó el campo endsOn en el DTO
                // 📌 Igual que con los otros campos, solo se modifica si vino de la petición
                if(dto.endsOn != undefined){
                    // 📅 Actualizamos la fecha de fin
                    // 📌 Asignamos el nuevo valor recibido en dto.endsOn al objeto schoolYear
                    schoolYear.endsOn = dto.endsOn;
                }

                // 💾 Guardamos los cambios en la base de datos
                // 📌 this.repo.save(schoolYear) toma el objeto modificado y persiste los cambios
                // 📌 Como schoolYear ya existe, TypeORM interpreta que esto es un UPDATE y no un INSERT
                // 📌 await espera a que la operación termine
                // 📌 return devuelve el objeto ya actualizado
                return await this.repo.save(schoolYear);
            
        } catch (error){
            // 🚨 Iniciamos el bloque catch
            // 📌 Aqui capturamos cualquier error que ocurra dentro del try
            // 📌 El parámetro error contiene la excepción lanzada

            // ✅ Verificamos si el error ya es uno de los errores controlados por nosotros
            // 📌 NotFoundException: cuando no se encuentra el año escolar por id
            // 📌 BadRequestException: cuando hay un problema con la petición o con la lógica manejada como bad request
            // 📌 ConflictException: cuando intentan duplicar un año que ya existe
            // 📌 Si el error ya es uno de estos, simplemente lo volvemos a lanzar
            if(
                error instanceof NotFoundException ||
                error instanceof BadRequestException ||
                error instanceof ConflictException
            ){

                // 🔄 Relanzamos el mismo error
                // 📌 No lo transformamos porque ya es un error válidoy claro
                throw error;
            }

            // 🗄️ Verificamos si el error proviene directamente de la base de datos
            // 📌 QueryFailedError suele aparecer cuando algo falla al ejecutar la consulta SQL en la base de datos
            if(error instanceof QueryFailedError){
                // 🚫 Lanzamos un BadRequestException personalizado
                // 📌 en lugar de exponer detalles técnicos de la base de datos, devolvemos un mensaje mas limpio y entendible
                throw new BadRequestException(
                    'Error de base de datos al actualizar el año escolar',
                );
            }

            // 💥 Si el error no fue ninguno de los anteriores asumimos que es un error inesperado del servidor
            // 📌 esto sirve como 'ultima barrera' para no dejar errores sin manejar
            throw new InternalServerErrorException(
                // 📌 Mensaje genérico para indicar que ocurrió un problema no previsto
                'Error inesperado al actualizar el año escolar'
            )
        }
    }

    // 📋 Método para obtener todos los años escolares registrados del colegio DEFAULT
    async findAll() : Promise<SchoolYear[]>{
        try{

            // ✅ Buscamos el colegio DEFAULT
            const school = await this.schoolRepo.findOne({
                where: {code : 'DEFAULT'},
            });

            // 🚫 Si no existe el colegio, no tiene sentido listar
            if(!school){
                throw new NotFoundException(
                    'No existe el colegio DEFAULT. Ejecuta: npm run seed:school',
                );
            }

            // 🔎 Traemos todos los años del colegio
            const years = await this.repo.find({
                where: {school: {id: school.id}}, // 🏫 Filtramos por colegio
                order: {year: 'DESC'}, // ⬇️ Orden: más reciente primero
            });

            // ❌ Si no hay registros
            if(years.length === 0){
                throw new NotFoundException('No hay años escolares registrados');
            }

            // ✅ Devolvemos lista
            return years;

        }catch(error){
            // 🎯 1️⃣ Verificamos si el error que llegó es un NotFoundException.
            // 👉 ¿Por qué hacemos esto? -> Porque si el servicio lanzó un: throw new NotFoundException('No existe tal año escolar')
            // Ese error YA VIENE con:
            // - El código HTTP correcto (404)
            // - Un mensaje claro que tú mismo definiste
            // ⚠️ Entonces: NO debemos cambiarlo.
            // Solo lo relanzamos para que NESTJS lo mando tal cual a la respuesta.
            if(error instanceof NotFoundException) throw error;

            //  💥 2️⃣ Si NO es NotFoundException, entonces cayó error desconocido
            // 👉 Puede ser: un error de TypeORM, un error de conexión, un error de lógica que no controlaste
            // 🧯 Para no mostrar detalles internos del servidor, respondemos con un BadRequestException genérico.
            // 🔐 Esto evita filtrar información sensible del servidor y da al usuario final un mensaje entendible.
            throw new BadRequestException('Error inesperado al obtener los años escolares');  

        }
        
    }

    // 📋 Método para buscar un año específico por su ID (UUID)
    async findOne(id : string) : Promise<SchoolYear>{

    
        try{
        
            // ✅ Buscamos el colegio DEFAULT
            const school = await this.schoolRepo.findOne({
                where : {code : 'DEFAULT'},
            });

            // 🚫 Si no existe el colegio DEFAULT
            if(!school){
                throw new NotFoundException(
                    'No existe el colegio DEFAULT. Ejecuta: npm run seed:school'
                );
            }
            
            // 🔎 Buscamos el año por el id + colegio (consistencia)
            const found = await this.repo.findOne({
                where : {
                    id,
                    school: {id : school.id}},
            });

            // ❌ Si no existe
            if(!found){
                throw new NotFoundException('Año escolar no encontrado');
            }

            // ✅ Devolvemos el año
            return found;

        }catch(error){
            // 🎯 4️⃣ Si el error atrapado es específicamente un NotFoundException:
            // -> Lo relanzamos tal cual.
            //💡 ¿Por qué? porque:
            // - Ya trae su código HTTP correcto (404)
            // - Ya trae un mensaje definido por ti
            // - Es un error controlado, NO debemos cambiarlo
            if(error instanceof NotFoundException) throw error

            // 💥 5️⃣ Si el error NO es NotFoundException, entonces es un error desconocido o inesperado.
            // 👉 Para no exponer detalles internos de la BD, devolvemos un BadRequest genérico.
            // 📌 Esto evita mostrar información sensible o compleja al usuario final.
            throw new BadRequestException('Error inesperado al buscar el año escolar');

        }

        
    }

    // 🟢 GET ACTIVE : obtener el año ACTIVE del colegio DEFAULT
    // 🔹 Si no existe, lanza un 404 (NotFoundException)
    async getActive() : Promise<SchoolYear>{
        try{

            // ✅0️⃣ Buscamos el colegio DEFAULT
            const school = await this.schoolRepo.findOne({
                where: { code: 'DEFAULT' }, // 🏫
            });

            // 🚫 Si no existe el colegio
            if (!school) {
                throw new NotFoundException(
                'No existe el colegio DEFAULT. Ejecuta: npm run seed:school',
                );
            }

            // 🔎 Buscamos el año ACTIVE
            const active = await this.repo.findOne({
                where:{
                    status: SchoolYearStatus.ACTIVE,
                    school : {id : school.id}
                },
            });

            // ❌ Si no hay
            if (!active){
                throw new NotFoundException('No hay año escolar activo.')
            }

            // ✅ Retornamos
            return active;

        }catch(error){
            //  🎯 Si el error que entró al catch es un NotFoundException, significa que nosotros mismos lo lanzamos arriba.
            // 👉 Entonces NO lo transformamos, NO le cambiamos mensaje.
            // 👉 Simplemente lo re-lanzamos para que NestJS lo responda con su JSON correcto (status 404, message, etc.)
            // 🔹 instanceof es un operador que sirve par verificar si un objeto pertenece a una clase específica.
            //.  En español simple
            //      👉 ¿Este error es de tipo?
            //      👉 ¿Este objeto fue creado usando esta clase?
            //      👉 ¿Este valor pertenece a esta excepción?
            // 🔹 Esto significa: Si el error que atrapamos es específicamente un NotFoundException
            if(error instanceof NotFoundException) throw error;

            // 💥 Cualquier otro error (problemas con la base de datos, errores inesperados, valores inválidos, etc.) es un error NO controlado.
            // 🔄 Lo transformamos en un BadRequestException(400) porque no es culpa del usuario, pero tampoco es un caso de "no encontrado"
            throw new BadRequestException('Error inesperado al obtener el año activo');
        }
    }

    // 🔄 SET ACTIVE: activar un año (solo 1 ACTIVE)
    // 🧠 Política de negocio: solo puede haber un año activo a la vez
    async setActive(id: string) : Promise<SchoolYear>{

        try{

            // ✅0️⃣ Buscamos el colegio DEFAULT
            const school = await this.schoolRepo.findOne({
                where: { code: 'DEFAULT' }, // 🏫
            });

            // 🚫 Si no existe el colegio
            if (!school) {
                throw new NotFoundException(
                'No existe el colegio DEFAULT. Ejecuta: npm run seed:school',
                );
            }

            // 🔎 Buscamos el año que queremos activar (id + colegio)
            const toActivate = await this.repo.findOne({
                where:{
                    id, 
                    school: {id : school.id}
                },
            });

            // ❌ Si no existe
            if(!toActivate){
                throw new NotFoundException('Año escolar no encontrado');
            }

            // 🚫 Si está CLOSED, no se puede activar
            if(toActivate.status === SchoolYearStatus.CLOSED){
                throw new BadRequestException('No puedes activar un año cerrado.')
            }

            // 🔎 Buscamos el ACTIVE actual (si existe)
            const currentActive = await this.repo.findOne({
                where:{
                    status: SchoolYearStatus.ACTIVE,
                    school: {id : school.id},
                },
            });

            // ✅ Si existe un ACTIVE y NO es el mismo, lo cerramos
            // 🔹 Ambos deben ser true
            // 🔹 currentActive es el año activo actual encontrado en la base de datos = true
            // 🔹 toActive.id es el año que queremos activar
            // 🔹 currentActive.id !== toActivate.id significa "Ok si existe un año activo, pero diferente al que quiero activar" = true
            if(currentActive && currentActive.id !== toActivate.id){
                currentActive.status = SchoolYearStatus.CLOSED; // 🔐Cerramos el anterioe
                await this.repo.save(currentActive); // 💾 Guardamos
            }

            // ✅ Activamos el seleccionado
            toActivate.status = SchoolYearStatus.ACTIVE;

            // 💾 Guardamos y devolvemos
            return await this.repo.save(toActivate);

        }catch(error){
            // 🎯 7️⃣ Manejo de errores Controlados
            // Si el error que se lanzó dentro del try es:
            // - NotFoundException (404: no existe el año)
            // - BadRequestException (400: año cerrado, etc)
            //
            // Entonces NO lo cambiamos. Simplemente lo re-lanzamos
            // NestJS ya sabe cómo convertir esas excepciones en una respuesta HTTP con:
            // - código de estado correcto (404, 400)
            // - mensaje que tú pusiste arriba
            if(
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ){
                // 🔁 Re - lanzamos el mismo error para que llegue tal cual al cliente
                throw error;
            }

            // 💣 8️⃣ Cualquier otro error no esperado
            // Si llegamos aquí, significa que pasó algo raro:
            // - Error de conexión a la BD
            // - Error interno de TypeORM
            // - Algún bug no contemplado
            //
            // En ese caso, devolvemos una BadRequest genérica (podría ser también un 500), solo informando que hubo
            // un problema al activar el año escolar.
            throw new BadRequestException('Error inesperado al activar el año escolar.');

        }

       
    } 


    // 🔒 CLOSE : cerrar un año (pasa a CLOSED)
    async close (id: string) : Promise <SchoolYear>{
        try{
            // 🔎 Buscamos el año (ya valida colegio DEFAULT)
            const y = await this.findOne(id);

            // 🔐 Cerramos el año
            y.status = SchoolYearStatus.CLOSED;

            // 💾 Guardamos cambios
            return await this.repo.save(y);

        }catch(error){

            // 🛑 5️⃣ Si el error que viene del try es un NotFoundexception, significa que this.findone(id) no encontró el año.
            // 👉 En ese caso, simplemente lo re-lanzamos.
            // NestJS ya sabe cómo convertir esa excepción en una respuesta HTTP.
            if(error instanceof NotFoundException) throw error;

            // 💥 6️⃣ Cualquier otro error NO controlado (ej: conexión db, error raro) lanzamos un BadRequest genérico.
            throw new BadRequestException('Error inesperado al cerrar el año escolar')

        }
        
    }


}

import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School, SchoolStatus } from 'src/entities/school.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SchoolForAdministratorRegistrationResponse } from './response/school-for-administrator-registration.response';

// 🧩 Declaramos el servicio de School
// 👉 Aqui se implementa toda la lógica de negocio relacionada con los colegios
// 👉 También se realizan validaciones y operaciones sobre la base de datos
@Injectable()
export class SchoolService {

    // 🏗️ Inyectamos el repositorio de la entidad School
    // 👉 El repositorio es el encargado de comunicarse con la base de datos
    // 👉 Permite realizar operaciones CRUD (Crear, Consultar, Actualizar y Eliminar) sobre la tabla schools mediante TypeORM
    constructor(
 
        // 🏫 @InjectRepository(School) (Busca e inyecta el repositorio asociado a la entidad School)
        // 👉 Le indica a Nest qué repositorio debe buscar e inyectar
        // 👉 En este caso, solicitamos el repositorio asociado a la entidad School
        @InjectRepository(School)

        // 🎁 Repository<School> (Recibe ese repositorio y lo guarda en "repo" para poder usarlo dentro del servicio)
        // 👉 Representa el repositorio de TypeORM asociado a la entidad School
        // 👉 Como School representa la tabla de colegios, este repositorio nos permitirá consultar, crear, actualizar o eliminar sus registros
        private readonly repo: Repository<School>

        // 🔹 Un repositorio es el objeto que usamos para interactuar con los registros de una entidad en la base de datos
        // 🔹 El repositorio funciona como una especie de intermediario entre nuestro servicio y la tabla
        // 👉 En este caso : Repository<School> está asociado a la entidad School y y nos proporciona métodos ya preparados como:
        // 🔹 repo.find(), repo.findOne(), repo.save(), repo.update(), repo.delete()
        // 👉 Puedes verlo de esta forma: 
        // ✅ Entidad School -> 🎁 Repository<School> -> 🗄️ Base de datos 
    ){}

    // 🏫 Crear un nuevo colegio
    // 📥 Recibe la información validada desde CreateSchoolDto
    // 📤 Devuelve el colegio recién registrado
    async create(
        dto: CreateSchoolDto,
    ) : Promise<School>{

        try{

            // 🔍 VALIDAR CÓDIGO ÚNICO

            // 🔍 Verificamos si ya existe un colegio con el mismo código
            // 👉 El código identifica de forma única a cada institución
            const existingByCode = await this.repo.findOne({
            where:{
                    code : dto.code
                }
            });

            // 🚫 No permitimos registrar códigos repetidos
            if(existingByCode){
                throw new ConflictException(
                    `Ya existe un colegio con el código ${dto.code}`
                );
            }

            // 🔍 VALIDAR NOMBRE ÚNICO
            // 🔍 Verificamos si ya existe un colegio con el mismo nombre
            const existingByName = await this.repo.findOne({
                where: {
                    name : dto.name
                },
            });

            // 🚫 Evitamos registrar dos colegios con el mismo nombre
            if(existingByName){
                throw new ConflictException(
                    `Ya existe un colegio llamado ${dto.name}`,
                );
            }

            // 3️⃣ VALIDAR RUC DUPLICADO

            // 🔍 Solo registramos esta validación si el cliente envió un RUC
            // 👉 El RUC es un dato opcional
            if(dto.ruc){
                const existingByRuc = await this.repo.findOne({
                    where:{
                        ruc: dto.ruc,
                    },
                });

                // 🚫 El RUC debe permanecer únicamente a un colegio
                if(existingByRuc){
                    throw new ConflictException( 
                        `El RUC ${dto.ruc} ya está registrado`,
                    );
                }
            }

            // 🏗️ CREAR ENTIDAD

            // 🏗️ Creamos una nueva instancia de la entidad School
            // 👉 create() solo construye el objeto en memoria
            // 👉 Todavía NO inserta ningún registro en la base de datos
            const school = this.repo.create({
                // 📦 Copiamos todas las propiedades del DTO dentro de esta instancia
                // 🔹 Equivale a: name: dto.name, code: dto.code, ...
                // 👉 Esto inicializa la entidad con los datos enviados por el cliente
                ...dto,
            });

            // 💳 CONFIGURACIÓN INICIAL DEL SAAS

            // 🎁 Todo colegio nuevo inicia en periodo de prueba
            school.status = SchoolStatus.TRIAL;

            // 📅 Calculamos automáticamente la fecha de vencimiento
            // 👉 El periodo de prueba dura 3 meses desde la fecha de registro
            school.subscriptionExpiresAt = this.calculateTrialExpirationDate();


            // 💾 GUARDAR EN BASE DE DATOS
            
            // 💾 Guardamos el colegio en la base de datos
            // 👉 save() ejecuta el INSERT si la entidad es nueva
            // 👉 Si la entidad ya existiera (con un id válido), realizaría un UPDATE
            return await this.repo.save(
                // 🏫 Colegio creado previamente con los datos del DTO
                // 👉 Será almacenado como un nuevo registro en la tabla schools  
                school
            );

        }catch(error){

            // ⚠️ ERRORES DE NEGOCIO

            // 👉 Son excepciones que nosotros mismos lanzamos durante las validaciones anteriores
            if(
                error instanceof ConflictException ||
                error instanceof BadRequestException
            ){
                throw error;
            }

            // 🗄️ ERRORES DE BASE DE DATOS

            // 👉 Capturamos errores provenientes de PostgreSQL y TypeORM
            if(error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al crear el colegio',
                );
            }

            // 💥  ERRORES INESPERADOS

            // 👉 Cualquier error no contemplado llegará aquí
            throw new InternalServerErrorException(
                'Error inesperado al crear el colegio'
            )
        }
    }

    // 🎁 Calcula la fecha de vencimiento del periodo de prueba
    // 👉 Todo colegio nuevo recibe automáticamente 3 meses de acceso
    // 👉 Centralizar esta lógica facilita modificar el periodo de prueba en el futuro
    private calculateTrialExpirationDate() : Date {

        // 📅 Tomamos la fecha y hora actual
        const expiresAt = new Date();
        // ✚ Agregamos 3 meses al periodo de prueba
        expiresAt.setMonth(expiresAt.getMonth() + 3);
        // 📥 Devolvemos la fecha calculada
        return expiresAt;
    }

    // 📋 Obtener todos los colegios
    // 📤 Devuelve una lista con todos los colegios registrados
    async findAll() : Promise<School[]>{

        try{

            // 🔍 OBTENER COLEGIOS
            
            // 🔍 Recuperamos todos los colegios registrados
            // 👉 Se ordenan por fecha de creación descendente, de modo que los más recientes aparezcan primero
            const schools = await this.repo.find({
                order: {
                    createdAt: 'DESC',
                },
            });

            // 📤 DEVOLVER RESULTADO

            // ✅ Si no existen colegios registrados, TypeORM devolverá un arreglo vacío []
            return schools;

        }catch(error){

            // 🗄️ ERRORES DE BASE DE DATOS

            // 👉 Capturamos errores provenientes de PostgresSQL o TypeORM
            if(error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al obtener los colegios',
                );
            }

            // 💥 ERRORES INESPERADOS
            
            // 👉 Cualquier error no contemplado llegará aquí
            throw new InternalServerErrorException(
                'Error inesperado al obtener los colegios',
            );

        }
    }


    // 🔍 Obtener un colegio por su identificador
    // 📥 Recibe el UUID del colegio
    // 📤 Devuelve el colegio encontrado
    async findOne(
        // 🆔 Identificador único (UUID) del colegio a buscar
        id : string,
    ): Promise<School>{


        try{

            // 🔍 BUSCAR COLEGIO

            // 🔍 Buscamos un colegio cuyo id coincida con el recibido
            // 👉 findOne() devuelve: 
            // 🔹 Una instancia de School si existe
            // 🔹 null si no encuentra ningún registro
            const school = await this.repo.findOne({
                // 🔍 Condición de búsqueda
                where: {
                    // 🆔 Filtramos por el identificador único del colegio
                    id, 
                },
            });

            // ✅ VALIDAR EXISTENCIA

            // 🚫 Si no encontró ningún colegio, detenemos la ejecución
            // 👉 Si el colegio no existe, responderemos con un error 404 (Not Found)
            if(!school){
                throw new NotFoundException(
                    `No existe el colegio con id ${id}`,
                );
            }

            // 📤 DEVOLVER RESULTADO

            // ✅ Retornamos el colegio encontrado
            return school;

        }catch(error){

            // ⚠️ ERRORES DE NEGOCIO

            // 👉 Reenviamos las excepciones generadas por nuestras validaciones
            if(error instanceof NotFoundException){
                throw error;
            }

            // 🗄️ ERRORES DE BASE DE DATOS

            // 👉 Capturamos errores provenientes de PostgreSQL o TypeORM
            if( error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al obtener el colegio',
                );
            }

            // 💥 ERRORES INESPERADOS

            // 👉 Cualquier excepción no contemplada termina aquí
            throw new InternalServerErrorException(
                'Error inesperado al obtener el colegio',
            );
        }
    }


    // 📋 Obtener colegios para registrar un administrador
    // 👉 Devuelve únicamente el ID y el nombre de cada colegio
    // 👉 Esta información será utilizada para seleccionar el colegio al momento de registrar un nuevo administrador
    async findSchoolForAdministratorRegistration()
        : Promise<SchoolForAdministratorRegistrationResponse[]>{

        try{

            // 🔍 Obtener colegios

            // 🔍 Recuperamos los colegios registrados 
            // 👉 Solo queremos la información necesaria para seleccionar un colegio al registrar un administrador
            const schools = await this.repo.find({

                // 🔍 find
                // 👉 Es un método de TypeORM que utilizamos para "buscar" y "obtener" registros de una tabla
                // 👉 En este caso, buscamos los colegios registrados en la tabla correspondiente a School
                // 📌 Dentro de find ({ ... }) podemos indicar opciones como:
                // 🔹 select -> Qué campos queremos recuperar
                // 🔹 order -> Cómo queremos ordenar los resultados

                // 📦 Campos a recuperar

                // 👉 No necesitamos recuperar toda la información del colegio
                // 👉 Únicamente necesitamos:
                // 
                // 🆔 id -> Para identificar el colegio seleccionado
                // 🏫 name -> Para mostrar su nombre en la interfaz
                select: {
                    id : true,
                    name : true,
                },
                // 🔤 Ordenar colegios

                // 👉 Ordenamos los colegios alfabéticamente por nombre
                // 📌 ASC -> Desde A hasta Z
                order : {
                    name : 'ASC'
                },
            });

            // 📥 Devolver resultado

            // ✅ Devolvemos los colegios encontrados
            // 👉 Cada colegio contendrá únicamente:
            /* 
                {
                    id: "...",
                    name: "..."
                }
            */

           // 📌 El resultado coincide con la estructura definida en: 
           // 👉 SchoolForAdministratorRegistrationResponse     
           // 📌 Si no existen colegios registrados, TypeORM devolverá un arreglo vacío []
           return schools;
            
        }catch(error){

            // 🛑 Mostrar el error original únicamente en el servidr 
            // 👉 Esto nos permitirá conocer exactamente qué problema está devolviendo PostgreSQL o TypeORM
            console.error('ERROR AL OBTENER COLEGIOS', error);

            // 🗄️ Errores de base de datos

            // 👉 Verificamos si el error capturado pertenece a QueryFailedError
            //
            // 📌 QueryFailedError es una excepción de TypeORM que puede producirse cuando una consulta hacia PostgreSQL no 
            //    puede ejecutarse correctamente.
            //
            // 🔥 Por ejemplo:
            // ❌ Problemas con la estructura de la consulta
            // ❌ Restricciones de la base de datos
            // ❌ Errores relacionados con columnas, tablas o tipos de datos
            if (error instanceof QueryFailedError){

                // ⚠️ BadRequestException
                // 👉 Lanzamos una excepción HTTP 400 hacia el cliente
                // 📌 En lugar de enviar al cliente el mensaje técnico original generado por PostgreSQL o TypeORM, devolvemos un mensaje controlado y
                //    definido por nosotros.
                // 
                // 🔥 Por ejemplo, PostgreSQL podría generar internamente errores como:
                // ❌ "column does not exist"
                // ❌ "relation does not exist"
                // ❌ "duplicate key value violates unique constraint"
                //
                // 👉 Pero el cliente solamente recibirá nuestro mensaje: "Error de base de datos al obtener los colegios"
                 throw new BadRequestException(
                    'Error de base de datos al obtener los colegios',
                );
            }

            // 💥 Errores inesperados

            // 👉 Si el error NO fue un QueryFailedError significa que ocurrió algún problema diferente que no hemos contemplado específicamente.
            // 📌 En ese caso lanzamos un error HTTP 500, indicando que ocurrió un problema interno en el servidor
            throw new InternalServerErrorException(
                'Error inesperado al obtener los colegios',
            );


        }


    }
}
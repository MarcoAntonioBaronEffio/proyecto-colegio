import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School, SchoolStatus } from 'src/entities/school.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';

// 🧩 Declaramos el servicio de School
// 👉 Aqui se implementa toda la lógica de negocio relacionada con los colegios
// 👉 También se realizan validaciones y operaciones sobre la base de datos
@Injectable()
export class SchoolService {

    // 🏗️ Inyectamos el repositorio de la entidad School
    // 👉 El repositorio es el encargado de comunicarse con la base de datos
    // 👉 Permite realizar operaciones CRUD (Crear, Consultar, Actualizar y Eliminar) sobre la tabla schools mediante TypeORM
    constructor(

        // 🏫 Inyectamos el repositorio correspondiente a la entidad School
        @InjectRepository(School)

        // 🎁 Repositorio tipado de TypeORM
        // 👉 Lo utilizaremos en todos los métodos del servicio para interactuar con la tabla schools
        private readonly repo: Repository<School>
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
}
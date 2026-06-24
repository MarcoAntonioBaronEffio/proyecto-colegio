import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from 'src/entities/school.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';

// 🧩 Declaramos el servicio y lo hacemos inyectable en NestJS
@Injectable()
export class SchoolService {

    constructor(
        @InjectRepository(School)
        private readonly repo: Repository<School>
    ){}

    // 🏫 Método para crear un colegio nuevo
    // 📥 Devuelve el colegio recién creado
    async create(
        dto: CreateSchoolDto,
    ) : Promise<School>{

        try{

            // 1️⃣ VALIDAR CÓDIGO DUPLICADO

            // 🔍 Verificamos si ya existe un colegio con el mismo código
            const existingByCode = await this.repo.findOne({
            where:{
                    code : dto.code
                }
            });

            // 🚫 No permitimos códigos repetidos
            if(existingByCode){
                throw new ConflictException(
                    `Ya existe un colegio con el código ${dto.code}`
                );
            }

            // 2️⃣ VALIDAR NOMBRE DUPLICADO
            // 🔍 Verificamos si ya existe un colegio con el mismo nombre
            const existingByName = await this.repo.findOne({
                where: {
                    name : dto.name
                },
            });

            // 🚫 No permitimos nombres repetidos
            if(existingByName){
                throw new ConflictException(
                    `Ya existe un colegio llamado ${dto.name}`,
                );
            }

            // 3️⃣ VALIDAR RUC DUPLICADO

            // 🔍 Solo validamos si el usuario envió RUC
            // 🔹 Realizamos esta condición porque el RUC es opcional
            if(dto.ruc){
                const existingByRuc = await this.repo.findOne({
                    where:{
                        ruc: dto.ruc,
                    },
                });

                // 🚫 El RUC debe ser único
                if(existingByRuc){
                    throw new ConflictException(
                        `El RUC ${dto.ruc} ya está registrado`,
                    );
                }
            }

            // 4️⃣ CREAR ENTIDAD

            // 🏗️ Creamos una nueva instancia de School
            const school = this.repo.create({
                ...dto,
            });

            // 5️⃣ GUARDAR EN BASE DE DATOS
            
            // 💾 Persistimos el registro
            return await this.repo.save(school);

        }catch(error){

            // 6️⃣ ERRORES CONTROLADOS
            if(
                error instanceof ConflictException ||
                error instanceof BadRequestException
            ){
                throw error;
            }

            // 7️⃣ ERRORES DE BASE DE DATOS

            if(error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al crear el colegio',
                );
            }

            // 8️⃣ ERRORES INESPERADOS
            throw new InternalServerErrorException(
                'Error inesperado al crear el colegio'
            )

        }

        

    }

    // 📋 Método para obtener todos los colegios
    async findAll() : Promise<School[]>{

        try{

            // 1️⃣ OBTENER COLEGIOS
            
            // 🔍 Buscamos todos los colegios registrados
            const schools = await this.repo.find({
                order: {
                    createdAt: 'DESC',
                },
            });

            // 2️⃣ DEVOLVER RESULTADOS

            // ✅ Si no existen registros TypeORM devolverá []
            return schools;

        }catch(error){

            // 3️⃣ ERRORES DE BASE DE DATOS

            if(error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al obtener los colegios',
                );
            }

            // 4️⃣ ERRORES INESPERADOS
            throw new InternalServerErrorException(
                'Error inesperado al obtener los colegios',
            );

        }
        
    }


    // 🔍 Método para obtener un colegio por id
    async findOne(
        id : string,
    ): Promise<School>{


        try{

            // 1️⃣ BUSCAR COLEGIO
            const school = await this.repo.findOne({
                where: {
                    id, 
                },
            });

            // 🚫 Si no existe lanzamos excepción
            if(!school){
                throw new NotFoundException(
                    `No existe el colegio con id ${id}`,
                );
            }

            // 2️⃣ DEVOLVER RESULTADO
            return school;

        }catch(error){

            // 3️⃣ ERRORES CONTROLADOS

            if(error instanceof NotFoundException){
                throw error;
            }

            // 4️⃣ ERRORES DE BASE DE DATOS
            if( error instanceof QueryFailedError){
                throw new BadRequestException(
                    'Error de base de datos al obtener el colegio',
                );
            }

            // 5️⃣ ERRORES INESPERADOS
            throw new InternalServerErrorException(
                'Error inesperado al obtener el colegio',
            );
        }
    }
}
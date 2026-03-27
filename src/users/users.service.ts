// ✅ Importamos el decorador Injectable para indicar que esta clase puede ser inyectada como un servicio
// gracias al sistema DI de Nest.
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// ✅ Importamos InjectRepository para poder inyectar el repositorio específico de la entidad 'User'
//dentro del servicio
import { InjectRepository } from '@nestjs/typeorm';
// ✅ Importamos la entidad 'User' que representa la tabla usuarios en la BD.
import { User } from 'src/entities/users.entity';
// ✅ Importamos el tipo Repository que maneja las operaciones CRUD de TypeORM.
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
// ✅ DTO que define qué datos llegan desde el controlador al crear un usuario
import { CreateUserDto } from './dto/create-user.dto';
// ✅ Importamos bcrypt, una librería para encriptar contraseñas de forma segura.
import * as bcrypt from 'bcryptjs';
import { Rol } from 'src/entities/rol.entity';

// ✅ Decorador que marca la clase como un servicio que puede ser utilizado en otros módulos.
@Injectable()
export class UsersService {

    // ✅ Inyectamos el repositorio correspondiente a la entidad User
    constructor(
        // 📌 @InjectRepository(User): Indicamos que este repo es para la entidad User.
        @InjectRepository(User) 
        // 📌 Esto nos dará acceso directo a métodos como find, save, findOne, etc.
        private readonly userRepo : Repository<User>, 

        @InjectRepository(Rol)
        private readonly roleRepo : Repository<Rol>,
    ){}

   
    // ✅ Método asíncrono para crear un usuario nuevo en la base de datos
    // 👉 Este método pertenece al servicio de usuarios y se encarga de registrar un nuevo usuario.
    // 👉 Puede ejecutarse:
    // - normalmente (sin transacción)
    // - dentro de una transacción si recibe "manager"
    async create (
        dto : CreateUserDto, // 📦 DTO limpio (solo datos de User)
        manager?: EntityManager, // 🔄 Manager opcional (para transacciones)
    ) : Promise<User>{ // ↩️ Retorna el usuario creado (sin passwordHash)  

        // 🔹 dto: contiene los datos enviados desde el controlador
        // 🔹 manager: permite ejecutar este método dentro de una transacción (opcional)
        // 🔹 Promise<User>: indica que devolverá un usuario de forma asíncrona

        try{ // 🛡️ Bloque para capturar errores controlados

            // ✅ Elegimos el repositorio según el contexto:
            // Si viene manager -> usamos repositorio dentro de la transacción
            // Si no viene -> usamos repo normal del servicio
            const userRepo = manager ? manager.getRepository(User) : this.userRepo; // 👤 Repositorio de usuarios

            // 1️⃣ Extraemos las propiedades del DTO (solo las del usuario)
            // 👉 Desestructuración para trabajar con variables más claras
            const{
                email,     // 📧 Email del usuario
                firstName, // 👤 Nombre
                lastName,  // 👤 Apellido
                password,  // 🔑 Contraseña en texto plano 
                phone,     // 📱 Teléfono
                avatarUrl, // 🖼️ Avatar
                roleId,    // 🧩 Viene SIEMPRE desde AuthService (rol real en BD)
            } = dto;

            // 2️⃣ Validación de negocio: roleId debe venir sí o sí 
            // 🧠 Aunque el DTO lo valide, lo reforzamos por seguridad
            if(!roleId){
                throw new BadRequestException('Debes enviar roleId');
            }


            // 3️⃣ Validar email duplicado (consulta liviana; solo id)
            // 🔹 Esto significa: Busca en la tabla users si existe un registro con este email
            // 🔹 Esto no devuelve exactamente un User completo, sino un User parcial con el "id" nada mas
            const existingUser = await userRepo.findOne({
                where : { email }, // 🔎 Buscamos usuario cuyp email sea igual al email del DTO
                select : ['id'], // ⚡️ Solo pedimos el id para optimizar la consulta, es decir no necesitamos toda la entidad User, solo el id
                // ⚡️ Esto es buena práctica, es más rápido, una menos memoria, no trae datos sensibles
            });

            // 🔹 Si existingUser contiene un objeto con el id : existingUser = { id :  "b8b7b6c2-1234-4567-89ab-abcdef123456" }
            if(existingUser){
                // ❌ Regla de negocio: email único
                throw new ConflictException('Ya existe un usuario con ese email');
            }

            // 4️⃣ Generamos hash de la contraseña
            // bcrypt generea el salt automáticamente
            const passwordHash = await bcrypt.hash(password, 10);
            // 🔐 Nunca se guarda la contraseña original
            // 🔹 10 = saltRounds (nivel de seguridad)

            // 5️⃣ Creamos la entidad User en memoria
            const newUser = userRepo.create({
                email,                // 📧 Email
                firstName,            // 👤 Nombres
                lastName,             // 👤 Apellidos
                passwordHash,         // 🔐 Hash de contraseña
                phone,                // 📱 Teléfono
                avatarUrl,            // 🖼️ Avatar
                role : { id : roleId }  // ✅ FK directa
            });
            // 🧠 aquí aún NO se guarda en la base de datos

            // 6️⃣ Guardamos en la BD
            // 💾 Inserta el registro en PostgreSQL
            const savedUser = await userRepo.save(newUser);

            // 🧼 Eliminamos passwordHash antes de devolver
            // 🔓 Evitamos exponer información sensible
            delete (savedUser as any).passwordHash;

            // ↩️ Retornamos el usuario creado
            return savedUser;

        }catch(error){ // 🧯 Manejo de errores

            // 🧨 Error UNIQUE de PostgreSQL
            if(error instanceof QueryFailedError && (error as any).code === '23505'){
                throw new ConflictException('Ya existe un usuario con ese email');
            }

            // ♻️ Re-lanzamos errores conocidos
            if(
                error instanceof BadRequestException ||
                error instanceof NotFoundException || 
                error instanceof ConflictException){
                throw error;
            }

            // ❌ Error inesperado
            throw new InternalServerErrorException('Error al crear el usuario');

        }
    }

   

     // ✅ Método para obtener todos los usuarios existentes en la base de datos.
    // 📌 async porque devuelve una Promesa (Promise<User[]>).
    // 📌 Eliminamos 'await' ya que simplemente estamos devolviendo la promesa sin manipular el resultado previamente.
    async findAll() : Promise<User[]>{
        try{
            // 🔍 Pedimos todos los usuarios activos y cargamos también su rol relacionado
            return this.userRepo.find({
            // 📌 relations indica TypeORM que también cargue la relación 'role' para cada usuario,
            //de modo que el resultado venga con su rol incluido.
            //relations: {role : true},
        })
        }catch(error){
            console.log('Error al listar usuarios: ', error);
            // 💣 Cualquier fallo inesperado (problema de conexión, error BD, etc.) lo convertimos en 500 genérico.
            throw new InternalServerErrorException('Error al listar los usuarios')
        }
    }

    // ✅ Método para buscar un usuario por su ID.
    async findById(id: string) : Promise<User|null>{
        try{
            // 🔎 Buscamos un usuario por ID y traemos también su rol.
            const user = await this.userRepo.findOne({ 
            where : {id}, // 📌 Condición para buscar por ID.
            relations:{role: true}, // ✅ Incluimos la relación del rol para obtener la info completa.
        });

        // ❌ Si no existe, lanzamos una excepción 404 controlado, este error va directo al catch
        // 🔹 El throw detiene la ejecución del try y automáticamente pasa al catch
        if(!user){
            throw new NotFoundException(`El usuario con id "${id}" no existe`);
        }

         // 🧼 Eliminamos 'passwordHash' del objeto que regresamos.
        // 👉 Aunque el hash está almacenado en la BD, NO debe viajar al frontend por seguridad (evitar exponer información sensible).
        // 👉 Usamos 'delete' para borrar la propiedad del objeto en memoria
        delete (user as any).passwordHash;

        // ✅ Si existe, lo retornamos.
        return user;
            
        }catch(error){
            console.log('Error al buscar usuario por id:', error);

            // 🔁 Si ya es un NotFoundException, solo lo re-lanzamos (Nest lo convierte en 404).
            if(error instanceof NotFoundException){
                throw error;
            }

            // 💣 Cualquier otra cosa será un 500 genérico.
            throw new InternalServerErrorException('Error al buscar el usuario');
        }
    }

    // ✅ Método para buscar un usuario por email usando QueryBuilder
    // - Devuelve el usuario completo (incluyendo su rol) o null si no existe.
    // - IMPORTANTE: Esto asume que en la entidad User tienes:
    // @Column({type: 'varchar', length: 200, select: false})
    // passwordHash: string;
    // De ese modo el hash NO se trae por defecto y solo lo pedimos aquí.
    // 🔹 IMPORTANTE: aquí NO lanzamos NotFoundException a propósito.
    //.  Para login normalmente queremos devolver null y que AuthService responda con "credenciales inválidas" sin revelar si el email existe o no.
    async findByEmail(email : string) : Promise<User|null>{
        try{
        // 🔧 Empezamos una consulta "manual" con el QueryBuilder del repositorio.
        // 🔹 QueryBuilder del repositorio es una herramienta avanzada que viene integrada en TypeORM y te permite
        // construir consultas SQL complejas de una forma programática, segura y tipada, sin tener que
        // escribir SQL directamente.
        // 'user' es un alias (apodo) para referirnos a la tabla/entidad User en el resto de la consulta (user.email,
        // user.passwordHash, etc).
        return await this.userRepo
        .createQueryBuilder('user')

        //🔐 Por seguridad, passwordHash está marcado con {select:false} en la entidad.
        // Eso significa que NUNCA se trae automáticamente.
        // Con .addSelect('user.passwordHash') decimos explícitamente:
        // "en ESTA consulta sí quiero incluir también la columna passwordHash".
        .addSelect('user.passwordHash')

        // 🤝 Hacemos un LEFT JOIN hacia la relación 'role' definida en la entidad User.
        // - 'user.role' es el path de la relación (propiedad en User).
        // - 'role' es el alias que le damos a la tabla/entidad Role en esta consulta.
        // - AND SELECT: además de unir, también selecciona (incluye) las columnas del rol.
        // Resultado: el objeto User vendrá con user.role ya cargado.
        .leftJoinAndSelect('user.role', 'role')

        // 🎯 Filtro WHERE con parámetro nombrado (:email) para evitar SQL injection.
        // 1️⃣ 'user.email =: email':
        // - Esto es la condición del WHERE en SQL.
        // 🔹 'user' es el alias que le dimos a la tabla User al iniciar el QueryBuilder.
        // 🔹 'email' después del punto es la columna en la base de datos.
        // 🔹 ':email' es un "parámetro nombrado". No se inserta texto directamente en el SQL.
        // ⭐️ Esto significa: "Haz un WHERE donde la columna user.email sea igual a un parámetro llamado :email", :email no es el valor, es solo el nombre del
        // parámetro (placeholder)
        // ❗️ Esto significa que jamás harás algo inseguro como: WHERE user.email = '${email}' ❌ (vulnerable a SQL injection)
        //
        // 2️⃣ :email -> Es el nombre del parámetro
        // - No es el valor
        // - Es un placeholder dentro de SQL
        // - Representa un "hueco" que se llenará después.

        // 3️⃣ {email} -> Es el objeto con el valor real
        // - Es igual a escribir {email : email}
        // - La clave "email" coincide con el parámetro :email
        // - El valor "email" viene del parámetro recibido por la función
        // - Ambos deben tener el mismo nombre para que TypeORM los conecte. Si no coinciden TypeORM no sabrá qué poner en :email
        .where('user.email = :email', {email})

        // 🧾 Ejecutamos la consulta y pedimos un SOLO registro (o null si no hay).
        // getOne() respeta los selects y joins que configuraste arriba.
        .getOne();
            
        }catch(error){
            console.log('Error al buscar usuario por email: ', error);
            // 💣 Si algo falla a nivel BD, devolvemos 500
            throw new InternalServerErrorException(
                'Error al buscar el usuario por email'
            )
        }

        
    }
}

// ✅ Importamos decoradores y excepciones de Nest
import { 
    BadRequestException, 
    ConflictException, 
    Injectable, 
    InternalServerErrorException, 
    NotFoundException, 
    UnauthorizedException } from '@nestjs/common'; 
// ✅ Servicio de firma y verifica JWT
import { JwtService } from '@nestjs/jwt';
// ✅ Servicio de usuarios (acceso a DB para buscar por email, etc.)
import { UsersService } from 'src/users/users.service';
// ✅ Importamos bcrypt para comparar contraseñas en texto plano vs hash
import * as bcrypt from 'bcrypt'
import { RegisterDto } from 'src/users/dto/register.dto';
import { DataSource, EntityManager, QueryFailedError} from 'typeorm';
import { Rol, RoleStatus } from 'src/entities/rol.entity'; 
import { Student } from 'src/entities/student.entity';
import { Administrator } from 'src/entities/administrator.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Teacher } from 'src/entities/teacher.entity';
import { Guardian } from 'src/entities/guardian.entity';
import { CodeGenerator } from 'src/common/utils/code-generator.util';
import { SystemAdministrator } from 'src/entities/system_administrator.entity';
import { AuthUser } from './interfaces/auth-user.interface';
import { RoleName } from 'src/entities/users.entity';
import { use } from 'passport';
import { JwtPayload } from './types/jwt-payload-type';
import { School } from 'src/entities/school.entity';
import { CreateSystemAdministratorDto } from 'src/users/dto/create-system-administrator.dto';
import { CreateAdministratorDto } from 'src/users/dto/create-administrator.dto';
import { CreateTeacherDto } from 'src/users/dto/create-teacher.dto';
import { CreateStudentDto } from 'src/users/dto/create-student.dto';
import { CreateGuardianDto } from 'src/users/dto/create-guardian.dto';


// 🔹 Indicamos que esta clase es un "servicio" inyectable en NestJS.
// 🔹 Es decir, Nest puede crear una instancia y pasarla automáticamente a otras clases que la necesiten.
@Injectable()
export class AuthService {

    // 🧩 Constructor: aquí recibimos las dependencias que este servicio necesita.
    // 🔹 UsersService -> para consultar la base de datos (buscar usuario por email), no está ligado a una transacción
    // 🔹 JwtService -> para generar el token JWT cuando las credenciales son correctas
    constructor(
        private readonly users : UsersService, // Acceso a la capa de datos
        private readonly jwt : JwtService,      // Manejo de tokens JWT
        // ⭐️ DataSource es el objeto que mantiene la conexión con la base de datos y permite crear repositorios y transacciones.
        // ⭐️ DataSource es la conexión principal a la base de datos que TypeOrm usa para trabajar. Nada más:
        // 🔹 Es como esto : PostgreSQL -> DataSource <-> Tu aplicación NEST
        // 🔹 Analogía simple: Imagina un banco
        // - La base de datos = el banco 🏦
        // - DataSource = la puerta principal del banco 🚪
        // - Repository = una ventanilla de atención 🪟
        // - transacción = una operación bancaria segura 🔐
        private readonly dataSource : DataSource,
    ){}

    // ✅ Método validate
    // Este método se encarga de verificar las credenciales del usuario.
    // Recibe un email y una contraseña (en texto plano), busca al usuario en la BD, compara el hash, y si todo está
    // correcto, lo devuelve.
    async validate (email : string, password : string) : Promise<AuthUser>{

        try{
            // 1️⃣ Buscamos al usuario en la base de datos por su email
            // 🔍 Este método internamente  hace SELECT del passwordHash usando addSelect
            // 👉🏼 Este método debe usar QueryBuilder con .addSelect('user.passwordHash) ya que
            // en la entidad User marcaste password con select:false
            const user = await this.users.findByEmail(email);

            // 2️⃣ Si no se encontró el usuario -> credenciales inválidas, lanzamos una excepción de tipo UnauthorizedException (401)
            // Esto corta el flujo inmediatamente, evitando revelar información sensible.
            if(!user) throw new UnauthorizedException('Credenciales inválidas');

            // 3️⃣ Comparamos la contraseña ingresada con el hash almacenado en la BD usando bcrypt.compare()
            // 🔹 El primer argumento es la contraseña que el usuario escribió (texto plano)
            // 🔹 El segundo argumento es el hash guardado en la BD
            const isPasswordValid = await bcrypt.compare(
                password, 
                user.passwordHash);

            // 4️⃣ Si la comparación del hash NO coincide devuelve false, las credenciales son incorrectas y volvemos a lanzar UnauthorizedException
            if(!isPasswordValid){
                throw new UnauthorizedException('Credenciales inválidas');
            } 

            const authUser : AuthUser = {
                sub : user?.id, // Ej: "uuid-del-usuario"
                email : user?.email, // Ej: "correo@ejemplo.com"
                roleId : user?.role.id,  // Ej: "uuid-del-rol" , rol lo traemos porque usamos eager: true
                roleName : user?.role.name as RoleName, // Ej: "ADMINISTRATOR", "STUDENT"
                schoolId : user.school?.id 
            }

            return authUser;
  

        } catch(error){
            // 🎯  Si el error es UnauthorizedException (401) lo volvemos a lanzar sin modificarlo.
            // NestJS ya sabe cómo devolver esta excepción al cliente
            if(error instanceof UnauthorizedException){
                throw error;
            }

            // 💣 Cualquier otro error raro o inesperado -> 500 (Error interno)
            throw new InternalServerErrorException('Error al validar las credenciales')
        }
    }







    // ✅ Método: signToken - Firmar Token
    // 🔹 Se encarga de generar un Token JWT a partir de los datos del usuario.
    // 🔹 Este token luego se devuelve al frontend para que pueda acceder a rutas protegidas.
    //
    // 🔹 Recibe como parámetro un objeto con las propiedades necesarias para identificar al usuario y aplicar reglas de 
    //    autorización dentro del sistema.

    // 🔹 sub [Subject]  -> Identificador único del usuario
    // 🔹 email          -> Correo electrónico
    // 🔹 roleId         -> ID del rol
    // 🔹 roleName       -> Nombre del rol (SYSTEM_ADMINISTRATOR , ADMINISTRATOR, PARENT, GUARDIAN, STUDENT)
    // 🔹 schoolId       -> Colegio al que pertenece el usuario (opcional). Los SYSTEM_ADMINISTRATOR no pertenecen a ningún colegio
    async signToken (
        // 📦 Información que se almacenará dentro del JWT
        user: JwtPayload
    ) 
    // 🔑 Devuelve una promesa que contendrá el JWT generado como texto
    : Promise<string>{

        try{
            // 1️⃣ Construimos el payload, el payload es la información que se guardará dentro del JWT
            // 🔹 "sub" es una claim estándar en JWT que significa "subject" (sujeto del token)
            // 🧠 Una claim es una declaración o afirmación que el token hace sobre el usuario o el contexto de autenticación.
            // 👉 Cuando un servidor genera un JWT, en su interior hay un payload (carga útil) que contiene un conjunto de claims.
            // 👉 Cada claim es una pequeña afirmació como:
            // "Este token pertenece a este usuario, con este rol, y fue emitido en tal fecha"
            // 🔹 Incluimos información útil para identificar al usuario y aplicar autorizaciones dentro de la aplicación
            // 🔹 schoolId solo se agrega cuando existe. Esto evita enviar "schoolId: undefined" para usuarios SYSTEM_ADMINISTRATOR
            const payload : JwtPayload = {
                sub : user.sub, 
                email : user.email, 
                roleId : user.roleId,
                roleName : user.roleName,
                // 🔹 "&"  -> Evalúa la expresión de izquierda a derecha
                // 👉 Si user.schoolId tiene valor (ej: "abc-123"), el resultados será: { schoolId: "abc-123" } 
                // 👉 Si user.schoolId es undefined, null, "", etc., el resultado será false y no se agregará nada
                //
                // 🔹 "..." (spread operator)
                // 👉 Inserta las propiedades del objeto dentro de payload
                //
                // 🔹 Patrón: ...(condición && { propiedad: valor})
                // Permite agregar propiedades de forma condicional
                ...(user.schoolId && { schoolId : user.schoolId })
            };
            
            // 2️⃣ Firmamos el payload y generamos el JWT
            // Usamos el JwtService (inyectado en el constructor) para firmar el token JWT.
            // Este servicio forma parte del paquete @nestjs/jwt y facilita todo el proceso de generación y 
            // validación de tokens de forma segura.

            // 🔐 Internamente, JwtService realiza todo el proceso de creación del token JWT:

            // 🔹 Genera el HEADER (encabezado):
            // - Define el tipo de token (type : "JWT").
            // - Especifica el algoritmo de firma (alg: "HS256" por defecto, o el que definas en JwtModule).
            //
            // 🔹 Codifica el PAYLOAD (carga útil):
            // - Contiene las claims o afirmaciones del usuario (por ejemplo: sub, email, roleId, roleName, schoolId).
            // - Incluye automáticamente campos estándar como:
            //.  - iat -> fecha de emisión del token (issued at).
            //.  - exp -> fecha de expiración, según el valor de JWT_EXPIRES.
            //
            // 🔹 Firma el token generando la SIGNATURE:
            // - Combina el header + payload + tu clave secreta (JWT_SECRET).
            // - Crea una firma única que garantiza la integridad del token.
            // - Si alguien altera el contenido, la firma deja de coincidir.
            //
            // 🔸 El resultado final es un token compuesto por tres partes codificadas en Base64:
            // HEADER.PAYLOAD.SIGNATURE -> Token completamente listo para enviarse al cliente. 
            return await this.jwt.signAsync(payload);

        }catch(error){
            // ❌ Si ocurre un problema al firmar el JWT, lanzamos un error interno del servidor
            throw new InternalServerErrorException(
                'Error al generar el token JWT'
            );   
        } 
    }


    // ============================================================
    // 👑 REGISTRAR SYSTEM ADMINISTRATOR
    // ============================================================

    // 👑 Esta función registra exclusivamente usuarios con rol SYSTEM_ADMINISTRATOR
    // 🔐 IMPORTANTE:
    // 👉 El rol NO viene desde el frontend
    // 👉 Esta propia función determina que el usuario será SYSTEM_ADMINISTRATOR
    //
    // 🏫 SYSTEM_ADMINISTRATOR:
    // 👉 No pertenece a ningún colegio
    // 👉 Por eso NO recibimos schoolId
    async registerSystemAdministrator(
        dto: CreateSystemAdministratorDto,
    ){


        try{

            // ============================================================
            // 🔁 INICIAR TRANSACCIÓN
            // ============================================================ 

            return await this.dataSource.transaction(
                async (manager) => {

                    // ============================================================
                    // 👑 BUSCAR ROL SYSTEM_ADMINISTRATOR
                    // ============================================================

                    // 👉 El rol NO viene desde el frontend
                    // 👉 Esta propia función determina que el usuario creado será SYSTEM_ADMINISTRATOR
                    const role = await this.findActiveRole(
                        manager,
                        RoleName.SYSTEM_ADMINISTRATOR,
                    );

                    // ============================================================
                    // 👤 CREAR USER
                    // ============================================================

                    // 👉 CreateSystemAdministratorDto hereda de CreateUserDto
                    // 🔹 Por eso dto contiene directamente: 📧 email, 🔐 password, 👤 firstName, 👤 lastName, 📱 phone?, 🖼️ avatarUrl?
                    // 🏫 No enviamos schoolId porque SYSTEM_ADMINISTRATOR no pertenece a un colegio
                    const savedUser = await this.createUserForRegistration(
                        manager,
                        dto,
                        role.id,
                    );


                    // ============================================================
                    // 👑 CREAR PERFIL SYSTEM ADMINISTRATOR
                    // ============================================================

                    // 📦 Obtenemos el repositorio dentro de la transacción
                    const systemAdminRepo = 
                        manager.getRepository(SystemAdministrator);

                    // 🧱 Creamos la entidad SystemAdministrator en memoria
                    const systemAdmin = systemAdminRepo.create({

                        // 🔗 Relacionamos el perfil con el usuario
                        user : {
                            id : savedUser.id,
                        },
                        // 📄 Datos propios del SYSTEM_ADMINISTRATOR
                        // 👉 Ahora vienen DIRECTAMENTE en el DTO
                        documentType: dto.documentType,
                        documentNumber: dto.documentNumber,
                    });

                    // 💾 Primer guardado:
                    // 👉 PostgreSQL genera el UUID
                    const savedSystemAdmin = await systemAdminRepo.save(systemAdmin);

                    // 🏷️ Generamos el código amigable
                    savedSystemAdmin.systemAdminCode = CodeGenerator.generate('SYS', savedSystemAdmin.id);

                    // 💾 Guardamos nuevamente con el código generado
                    await systemAdminRepo.save(savedSystemAdmin);

                    // ✅ Registro completado correctamente
                    return savedUser;
                },
            );


        }catch(error){

            // 🧯 Centralizamos el manejo de errores
            return this.handleRegistrationError(error);
        }


    }





    // ============================================================
    // 🛡️ REGISTRAR ADMINISTRATOR
    // ============================================================

    // 🛡️ Esta función registra exclusivamente usuarios ADMINISTRATOR
    //
    // 🔐 IMPORTANTE:
    // 🔐 El rol es determinado por el backend
    // 👉 El cliente NO puede decidir qué rol crear
    //
    // 🏫 ADMINISTRATOR:
    // 👉 Sí pertenece a un colegio
    // 👉 Por eso necesitamos recibir schoolId                                     
    async registerAdministrator(
        dto : CreateAdministratorDto,

        // 🏫 Colegio al que pertenecerá el administrador
        // 👉 El servicio recibe directamente el schoolId que ya fue determinado previamente por el controller
        // 👑 Si registra SYSTEM_ADMINISTRATOR:
        // 🔹 Puede seleccionar el colegio donde se creará el administrador
        // 🛡️ Si registra otro ADMINISTRATOR
        // 🔹 El schoolId puede obtenerse desde su JWT
        schoolId : string,
    ){

        try{ 

            // ============================================================
            // 🔁 INICIAR TRANSACCIÓN
            // ============================================================

            return await this.dataSource.transaction(

                async(manager) => {


                    // ============================================================
                    // 🛡️ BUSCAR ROL ADMINISTRATOR
                    // ============================================================

                    // 👉 El rol NO viene desde el frontend
                    // 👉 Esta función únicamente registra ADMINISTRATOR
                    // 👉 Por eso el backend determina directamente el rol
                    const role = await this.findActiveRole(
                        manager,
                        RoleName.ADMINISTRATOR
                    );

                    // ============================================================
                    // 🏫 BUSCAR COLEGIO
                    // ============================================================

                    // 🔍 Verificamos que el colegio recibido exista
                    const school = await this.findSchool(
                        manager,
                        schoolId,
                    );


                    // ============================================================
                    // 👤 CREAR USER
                    // ============================================================

                    // 👉 CreateAdmintratorDto hereda de CreateUserDto
                    // 🔹 Por eso dto también contiene: 📧 email , 🔐 password, 👤 firstName, 👤 lastName, 📱 phone?, 🖼️ avatarUrl?
                    // 🏫 Además enviamos school.id porque ADMINISTRATOR sí pertenece a un colegio
                    const savedUser = await this.createUserForRegistration(
                        manager,
                        dto,
                        role.id,
                        school.id,
                    );

                    // ============================================================
                    // 🛡️ CREAR PERFIL ADMINISTRATOR
                    // ============================================================

                    // 📦 Obtenemos el repositorio dentro de la transacción
                    const administratorRepo = 
                        manager.getRepository(Administrator);

                    // 🧱 Creamos la entidad Administrator
                    const administrator = administratorRepo.create({

                        // 🔗 Relacionamos el perfil con el usuario
                        user: {
                            id : savedUser.id,
                        },
                        // 📄 Datos propios del ADMINISTRATOR
                        // 👉 Ahora vienen DIRECTAMENTE en el DTO
                        documentType: dto.documentType,
                        documentNumber: dto.documentNumber,
                    });


                    // 💾 Primer guardado
                    // 👉 PostgreSQL genera el UUID
                    const savedAdministrator = await administratorRepo.save(administrator);

                    // 🏷️ Generamos el código del administrator amigable
                    savedAdministrator.administratorCode = CodeGenerator.generate('ADM', savedAdministrator.id);

                    // 💾 Guardamos nuevamente con el código generado
                    await administratorRepo.save(savedAdministrator);

                    // ✅ Usuario registrado correctamente
                    return savedUser;
                },
            );

        }catch(error){

            // 🧯 Centralizamos el manejo de errores
            return this.handleRegistrationError(error);
        }
    }


    // ============================================================
    // 🧑‍🏫 REGISTRAR TEACHER
    // ============================================================

    // 🧑‍🏫 Esta función solamente puede registrar usuarios TEACHER
    //
    // 🔐 IMPORTANTE:
    // 👉 El rol NO viene desde el frontend
    // 👉 Esta propia función determina que el usuario será TEACHER
    //
    // 🏫 TEACHER:
    // 👉 Si pertenece a un colegio
    // 👉 Por eso necesitamos recibir schoolId
    async registerTeacher(
        dto : CreateTeacherDto,
        // 🏫 Colegio al que pertenecerá el profesor
        // 👉 Normalmente se obtiene desde el JWT del usuario que está realizando el registro
        schoolId : string
    ){
 
        try{ 

            // ============================================================
            // 🔁 INICIAR TRANSACCIÓN
            // ============================================================

            return await this.dataSource.transaction(

                async(manager) => {

                    // ============================================================
                    // 🧑‍🏫 BUSCAR ROL TEACHER
                    // ============================================================

                    // 👉 El backend determina directamente el rol
                    const role = await this.findActiveRole(
                        manager,
                        RoleName.TEACHER,
                    );

                
                    // ============================================================
                    // 🏫 BUSCAR COLEGIO
                    // ============================================================

                    // 🔍 Verificamos que el colegio exista
                    const school = await this.findSchool(
                        manager,
                        schoolId,
                    );

                    // ============================================================
                    // 👤 CREAR USER
                    // ============================================================

                    // 👉 CreateTeacherDto hereda de CreateUserDto
                    // 🏫 Enviamos school.id porque TEACHER si pertenece a un colegio
                    const savedUser = await this.createUserForRegistration(
                        manager,
                        dto,
                        role.id,
                        school.id,
                    );

                    // ============================================================
                    // 🧑‍🏫 CREAR PERDIL TEACHER
                    // ============================================================
                    
                    
                    // 📦 Obtenemos el repositorio dentro de la transacción
                    const teacherRepo = manager.getRepository(Teacher);

                    // 🧱 Creamos entidad Teacher
                    const teacher = teacherRepo.create({

                        // 🔗 Relacionamos el perfil con el usuario
                        user : {
                            id : savedUser.id
                        },

                        // 📄 Datos propios del TEACHER
                        // 👉 Ahora vienen DIRECTAMENTE en el DTO
                        documentType : dto.documentType,
                        documentNumber: dto.documentNumber,
                        // 🎓 Información profesional
                        professionalTitle: dto.professionalTitle,
                    });

                    // 💾 Primer guardado
                    // 👉 PostgreSQL genera el UUID
                    const savedTeacher = await teacherRepo.save(teacher);

                    // 🏷️ Generamos el código amigable
                    savedTeacher.teacherCode = CodeGenerator.generate('DOC', savedTeacher.id,);

                    // 💾 Guardamos nuevamente con el código generado
                    await teacherRepo.save(savedTeacher);

                    // ✅ Registro completado correctamente s
                    return savedUser;
                },
            );

        }catch(error){

            // 🧯 Centralizamos el manejo de errores
            return this.handleRegistrationError(error);
        }
    }



    // ============================================================
    // 🎓 REGISTRAR STUDENT
    // ============================================================


    // 🎓 Esta función registra exclusicamente usuarios STUDENT
    //
    // 🔐 IMPORTANTE:
    // 👉 El rol NO viene desde el frontend
    // 👉 Esta propia función determina que el usuario será STUDENT
    // 
    // 🏫 STUDENT:
    // 👉 Si pertenece a un colegio
    // 👉 Por eso necesitamos recibir schoolId
    async registerStudent(
        dto : CreateStudentDto,

        // 🏫 Colegio al que pertenecerá el estudiante
        // 👉 Normalmente se obtiene desde el JWT del usuario que está realizando el registro
        schoolId : string
    ){

        try{
 
            // ============================================================
            // 🔁 INICIAR TRANSACCIÓN
            // ============================================================

            return await this.dataSource.transaction(
                async (manager) => {

                    // ============================================================
                    // 🎓 BUSCAR ROL STUDENT
                    // ============================================================

                    // 👉 El backend determina directamente el rol
                    const role = await this.findActiveRole(
                        manager,
                        RoleName.STUDENT,
                    );

                    // ============================================================
                    // 🏫 BUSCAR COLEGIO
                    // ============================================================

                    // 🔍 Verificamos que el colegio exista
                    const school = await this.findSchool(
                        manager,
                        schoolId,
                    );

                    // ============================================================
                    // 👤 CREAR USER
                    // ============================================================

                    // 👉 CreateStudentDto hereda de CreateUserDto
                    //
                    // 🏫 Enviamos school.id porque STUDENT si pertenece a un colegio
                    const savedUser = await this.createUserForRegistration(
                        manager,
                        dto,
                        role.id,
                        school.id
                    );

                    // ============================================================
                    // 🎓 CREAR PERFIL STUDENT
                    // ============================================================

                    // 📦 Obtenemos el repositorio dentro de la transacción
                    const studentRepo = manager.getRepository(Student);

                    // 🧱 Creamos la entidad Student
                    const student = studentRepo.create({


                        // 🔗 Relacionamos el perfil con el usuario
                        user: {
                            id : savedUser.id,
                        },
                        // 📄 Datos propios del STUDENT
                        // 👉 Ahora vienen DIRECTAMENTE en el DTO
                        documentType: dto.documentType,
                        documentNumber: dto.documentNumber,
                    });

                    // 💾 Primer guardado
                    // 👉 PostgreSQL general el UUID
                    const savedStudent = await studentRepo.save(student);

                    // 🏷️ Generamos el código amigable
                    savedStudent.studentCode = CodeGenerator.generate('STU', savedStudent.id);

                    // 💾 Guardamos nuevamente con el código generado
                    await studentRepo.save(savedStudent);

                    // ✅ Registro completado correctamente
                    return savedUser;

                },
            );

        }catch(error){

            // 🧯 Centralizamos el manejo de errores
            return this.handleRegistrationError(error);

        }
    }


    // ============================================================
    // 🧑‍🧑‍🧒 REGISTRAR GUARDIAN
    // ============================================================

    // 🧑‍🧑‍🧒 Esta función registrada exclusivamente usuarios GUARDIAN
    // 🔐 IMPORTANTE:
    // 👉 El rol NO viene desde el frontend
    // 👉 Esta propia función determina que el usuario será GUARDIAN
    //
    // 🏫 GUARDIAN
    // 👉 Si pertenecen a un colegio
    // 👉 Por eso necesitamos recibir schoolId
    async registerGuardian(
        dto: CreateGuardianDto,

        // 🏫 Colegio al que pertenecerá el apoderado
        // 👉 Normalmente se obtiene desde el JWT del usuario que está realizando el registro
        schoolId : string,
    ){

        try{
  
            // ============================================================
            // 🔁 INICIAR TRANSACCIÓN
            // ============================================================

            return await this.dataSource.transaction(
                async(manager) => {

                    // ============================================================
                    // 🧑‍🧑‍🧒 BUSCAR ROL GUARDIAN
                    // ============================================================

                    // 👉 El backend determina directamente el rol
                    const role = await this.findActiveRole(
                        manager,
                        RoleName.GUARDIAN,
                    );

                    // ============================================================
                    // 🏫 BUSCAR COLEGIO
                    // ============================================================

                    // 🔍 Verificamos que el colegio exista
                    const school = await this.findSchool(
                        manager,
                        schoolId
                    );

                    // ============================================================
                    // 👤 CREAR USER
                    // ============================================================

                    // 👉 CreateGuardianDto hereda de CreateUserDto
                    //
                    // 🏫 Enviamos school.id porque GUARDIAN sí pertenece a un colegio
                    const savedUser = await this.createUserForRegistration(
                        manager,
                        dto,
                        role.id,
                        school.id,
                    );

                    // ============================================================
                    // 🧑‍🧑‍🧒 CREAR PERFIL GUARDIAN
                    // ============================================================

                    // 📦 Obtenemos el repositorio dentro de la transacción
                    const guardianRepo = manager.getRepository(Guardian);

                    // 🧱 Creamos la entidad Guardian
                    const guardian = guardianRepo.create({

                        // 🔗 Relacionamos el perfil con el usuario
                        user: {
                            id : savedUser.id,
                        },
                        // 📄 Datos propios del GUARDIAN
                        // 👉 Ahora vienen DIRECTAMENTE en el DTO
                        documentType: dto.documentType,
                        documentNumber : dto.documentNumber, 
                        // 📌 Si posteriormente agregas relationshio al CreateGuardianDto y a la entidad:
                        //relationship: dto.relationship,

                    });

                    // 💾 Primer guardado
                    // 👉 PostgreSQL genera el UUID
                    const savedGuardian = await guardianRepo.save(guardian);

                    // 🏷️ Generamos el código amigable
                    savedGuardian.guardianCode = CodeGenerator.generate('GUA',savedGuardian.id);

                    // 💾 Guardamos nuevamente con el código generado
                    await guardianRepo.save(savedGuardian);

                    // ✅ Registro completado correctamente
                    return savedUser;
                },
            );

        }catch(error){

            // 🧯 Centralizamos el manejo de errores
            return this.handleRegistrationError(error);
        }
    }

    // ============================================================
    // 🔧 FUNCIONES  PRIVADAS COMPARTIDAS
    // ============================================================

    // ⭐️ Estas funciones NO representan tipos de registro
    // 👉 Son pequeñas tareas comunes que utilizan varios registros

    // ============================================================
    // 🔎 BUSCAR ROL ACTIVO
    // ============================================================

    private async findActiveRole(
        manager : EntityManager,
        roleName : RoleName,
    ){

        // 📦 Obtenemos el repositorio Rol utilizando el manager de la transacción
        const roleRepo = manager.getRepository(Rol);

        // 🔍 Buscamos el rol solicitado
        const role = await roleRepo.findOne({

            where: {

                // 🏷️ Nombre del rol definido por el backend
                name : roleName,

                // ✅ El rol debe encontrarse activo
                status : RoleStatus.ACTIVE,
            },
        });

        // ❌ No existe o se encuentra inactivo
        if(!role){

            throw new BadRequestException(
                `El rol ${roleName} no existe o se encuentra inactivo`,
            );
        }

        // ✅ Retornamos la entidad Rol
        return role;
    }

    // ============================================================
    // 🏫 BUSCAR COLEGIO
    // ============================================================
    
    private async findSchool(
        manager : EntityManager,
        schoolId : string,
    ){

        // 🛡️ Primero verificamos que tengamos un ID
        if(!schoolId){

            throw new BadRequestException(
                'Debes indicar el colegio al que pertenecerá el usuario',
            );
        }

        // 📦 Repositorio School dentro de la transacción
        const schoolRepo = manager.getRepository(School);

        // 🔍 Buscamos el colegio
        const school = await schoolRepo.findOne({
            where : {
                id : schoolId,
            },
        });

        // ❌ Colegio inexistente
        if(!school){
            throw new NotFoundException(
                'El colegio no existe',
            );
        }

        // ✅ Retornamos la entidad completa
        return school;
    }

    // ============================================================
    // 🧼 CONSTRUIR DTO LIMPIO PARA USER
    // ============================================================

    // 👉 Todos los DTO específicos de registro:
    // 👑 CreateSystemAdministratorDto
    // 🛡️ CreateAdmintratorDto
    // 🧑‍🏫 CreateTeacherDto
    // 🎓 CreateStudentDto
    // 🧑‍🧑‍🧒 CreateGuardianDto
    // 🧬 Heredan de CreateUserDto
    // 🚫 Sin embargo, cada uno también puede contener campos específicos de su perfil
    // 🔹 Por eso extraemos únicamente los campos que pertenecen a la entidad User
    private buildCreateUserDto(
        dto : CreateUserDto,
    ): CreateUserDto{

        // 🧼 Creamos un DTO solamente con datos generales del usuario
        const createUserDto : CreateUserDto = {

            // 📧 Correo
            email : dto.email,
            // 🙎 Nombre
            firstName : dto.firstName,
            // 🙎 Apellido
            lastName : dto.lastName,
            // 🔐 Contraseña
            password : dto.password,
            // 📱 Teléfono
            phone : dto.phone,
            // 🖼️ Avatar opcional
            avatarUrl : dto.avatarUrl,
        };

        // ✅ Retornamos únicamente los datos pertenecientes a User
        return createUserDto;
    }

    


    // ============================================================
    // 👤 CREAR USER GENERAL
    // ============================================================
    
    // 👉 Los cinco tipos de usuario necesitan crear primero un registro en la table User
    // 🔹 Como todos los DTO específicos heredan de CreateUserDto, esta función puede recibir cualquiera de ellos
    // 👉 De esta manera evitamos repetir la creación del User dentro de cada función de registro 
    private async createUserForRegistration(
        manager : EntityManager,
        dto: CreateUserDto,
        roleId : string,
        // 🏫 Será undefined únicamente para SYSTEM_ADMINISTRATOR
        schoolId?: string,
    ){


        // 🧼 Extraemos exclusicamente los datos pertenecientes a User
        const createUserDto = this.buildCreateUserDto(dto);

        // 👤 Creamos el usuario utilizando el mismo manager de la transacción 
        // 🔥 Esto permite:
        // crear User
        //      ↓ 
        // crear perfil
        //      ↓ 
        // ❌ si falla el perfil
        //      ↓ 
        // rollback del User
        const savedUser = await this.users.create(
            createUserDto,
            roleId,
            schoolId,
            manager
        );

        // ✅ Retornamos el usuario creado
        return savedUser;
    }



    // ============================================================
    // 🧯 MANEJO DE ERRORES DE REGISTRO
    // ============================================================

    // 👉 Como todos los register utilizan prácticamente el mismo manejo de errores, no necesitamos copiar este catch completo cinco veces
    // 🔹 Cada register simplemente hace: catch(error){ return this.handleRegistrationError(error);}
    private handleRegistrationError(
        error : unknown
    ): never {

        // ============================================================
        // 🧯 ERROR UNIQUE DE POSTGRESQL
        // ============================================================

        // 🔹 PostgreSQL utiliza: 23505 = unique_violation
        // 🔥 Ejemplos: email duplicado, documentNumber duplicado, algún código UNIQUE duplicado
        const postgresErrorCode =
            (error as any)?.driverError?.code ??
            (error as any)?.code;

            if(
                error instanceof QueryFailedError &&
                postgresErrorCode === '23505'
            ){

                throw new ConflictException(
                    'Ya existe un registro con esos datos únicos',
                );
            }

            // ============================================================
            // ♻️ ERRORES CONOCIDOS
            // ============================================================

            // 👉 Estos errores ya tienen un mensaje correcto, por lo que simplemente los volvemos a lanzar
            if(
                error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException
            ){
                throw error;
            }

            // ============================================================
            // ❌ ERROR INESPERADO
            // ============================================================

            // 👉 No exponemos información interna del servidor
            throw new InternalServerErrorException('Error al registrar el usuario',)
    };

}

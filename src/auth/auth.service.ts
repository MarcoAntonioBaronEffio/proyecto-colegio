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
import { DataSource, QueryFailedError} from 'typeorm';
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
                roleName : user?.role.name as RoleName // Ej: "ADMINISTRATOR", "STUDENT"
            }

            return authUser;

            // 5️⃣ Devolvemos al "controlador" los datos necesarios del usuario autenticado.
            // 👉 Este objeto será recibido en el controlador cuando se llame a: 
            //   const user = await this.auth.validate(...)
            // 👉 Solo retornamos la información mínima necesaria (no la entidad completa)
            // Puedes incluir solo los campos que tu aplicación requiera
            /*return {
                sub : user.id,          
                email : user.email,     
                roleId : user.role.id,  
                roleName: user.role.name as UserRole
            };*/

            

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
    // Se encarga de generar un Token JWT a partir de los datos del usuario.
    // Este token luego se devuelve al frontend para que pueda acceder a rutas protegidas.
    // Recibe como parámetro un objeto con 3 propiedades:
    // sub [Subject]  -> El (id) identificador del usuario en la BD.
    // email -> Su correo electrónico.
    // roleId -> El ID del rol
    async signToken (
        user : {
            sub: string; 
            email : string; 
            roleId : string;
            roleName : string;
            // actions : []
        })
        {

        try{
            // 1️⃣ Creamos el payload, es decir, la información que irá dentro del token.
            // 🔹 "sub" es una claim estándar en JWT que significa "subject" (sujeto del token)
            // Una claim es una declaración (o afirmación) que el token hace sobre el usuario o el contexto.
            // Cuando un servidor genera un token JWT, en su interior hay un payload (carga útil) que contiene un conjunto de claims.
            // Cada claim es como una pequeña frase que dice:
            // "Este token pertenece a tal usuario, con tal rol, y fue emitido en tal fecha"
            // 🔹 Añadimos el email y el rolId para poder usar esa información luego si es necesario.
            const payload = {
                sub : user.sub, 
                email : user.email, 
                roleId : user.roleId,
                roleName : user.roleName};
            
            // 2️⃣ Usamos el JwtService (inyectado en el constructor) para firmar el token JWT.
            // Este servicio forma parte del paquete @nestjs/jwt y facilita todo el proceso de generación y 
            // validación de tokens de forma segura.

            // 🔐 Internamente, JwtService realiza todo el proceso de creación del token JWT:
            // 🔹 Genera el HEADER (encabezado):
            // - Define el tipo de token (type : "JWT").
            // - Especifica el algoritmo de firma (alg: "HS256" por defecto, o el que definas en JwtModule).
            //
            // 🔹 Codifica el PAYLOAD (carga útil):
            // - Contiene las claims o afirmaciones del usuario (por ejemplo: sub, email, roleId).
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
            // HEADER.PAYLOAD.SIGNATURE -> Completamente listo para enviar al cliente. 
            return await this.jwt.signAsync(payload);

        }catch(error){
            // 🎯 Si algo falla al firmar el token -> error genérico 500
            throw new InternalServerErrorException('Error al generar el token JWT'); 
            
        } 
    }






    // ✅ Registra usuario + perfil obligatorio según rol, dentro de una transacción
    // ⭐️ Una transacción es un bloque de operaciones en la base de datos que debe cumplirse bajo una regla:
    // ⭐️ Si algo falla en cualquier paso, TODO se revierte (rollback) 🔁🧨
    //    "Todo se guarda o nada se guarda" ✅ ❌
    // 🔹 dto : RegisterDto -> trae todo lo del CreateUserDto (email, firstName, lastName, password, phone, avatarUrl, roleId) 
    async register(dto: RegisterDto) { // ✅ Función async: devuelve una Promise y usamos await dentro
        try{ // 🛡️ try: capturamos errores para responder con excepciones claras (400/409/500)


            // 💫 Usa transacciones cuando varias operaciones deben comportarse como una sola unidad lógica: 
            // 🔥 Por ejemplo: crear usuario + estudiante | crear usuario + administrador | matrícula + horario
            // 🧾 Iniciamos una transacción con TypeORM:
            // 🔹 DataSource -> crea una transacción -> te entrega "manager"
            // 🔹 manager -> te deja usar repositorios dentro de esa transacción
            // 👉 dataSource.transaction ejecuta una función y te entrega un "manager"
            // 👉 TODO lo que hagas con ese manager se guarda junto, o se revierte junto 
            return await this.dataSource.transaction(async (manager) => { // 🔁 Inicia transacción y nos da EntityManager
            // ✅ Contexto de la transacción
            // 👉 Todo lo que hagas con "manager" aqui adentro es parte de la misma transacción
 
            // ✅ Validación mínima
            if(!dto.roleName){ // 🚫 Si el cliente NO envía roleName (ej: "STUDENT", "ADMINISTRATOR", etc.)
                throw new BadRequestException('Debes enviar el campo "roleName"'); // ❌ 400: petición mal formada
            }

            // ⭐️ Recordatorio mental:
            // 🔹 DataSource = conexión a la BD
            // 🔹 manager = "controlador" de la transacción
            // 🔹 repository = CRUD de una tabla
            // 🔹 entity = clase que representa la tabla

            // ⭐️ Repositorio de roles dentro de la transacción
            // 🔹 Rol es la entidad (tabla roles en PostgreSQL)
            // 🔹 manager.getRepository(Rol) -> Obtiene el repositorio
            // 👉 Muy importante: usamos manager.getRepository para que la consulta sea parte de la transacción
            const roleRepo = manager.getRepository(Rol);

            // ✅ Normalizamos roleName para evitar errores por espacios / minúsculas
            const roleNameNormalized = dto.roleName.trim().toUpperCase(); // 🧼 " student" -> "STUDENT"

            // ✅ Buscamos el rol activo por nombre
            const role = await roleRepo.findOne({
                where : { 
                    name : roleNameNormalized,
                    status: RoleStatus.ACTIVE
                }, // ✅ Debe existir y estar activo
            }); // 🧾 consulta dentro de la transacción

            if (!role) { // ❌ Si el rol no existe o está inactivo
                throw new BadRequestException('El rol enviado no existe'); // 🚫 400: dato inválido
            }






            /* -------------------------------------------------------------------------------------------- */

            
            // ⭐️ Record<string, ...> => Significa: "Voy a crear un objeto donde las "claves" serán texto"
            //.  o sea, las llaves como : STUDENT, ADMINISTRATOR son strings.

            // ⭐️ keyof RegisterDto => Significa: "Los valores solo pueden ser nombres de propiedades que existan dentro de RegisterDto."
            // Por ejemplo, si RegisterDto tiene esto:


            /* 
            class RegisterDto{
            
                roleName : string;
                student? : StudentDto;
                administrator? : AdministratorDto;
            }
            */

            // ⭐️ Record<string, keyof RegisterDto> , significa: "Este objeto tendrá claves tipo texto, y cada valor debe ser el nombre de un
            // propiedad valida de RegisterDto"

            // ⭐️ ¿Para qué sirve esto? sirve para luego hacer algo como esto: 
            //.   const requiredKey = requiredPayloadByRole[dto.roleName];
            // 🔹 Si : dto.roleName = 'STUDENT , entonces requiredKey = 'student'

            // ⭐️ Y luego validar 
            /* 
                if(!dto[requieredKey]){
                    throw new BadRequestException(...)
                }
            */

            // 🔹 Creamos una constante llamada requiredPayloadByRole
            // ✅ "const" significa que esta variable no va a cambiar de referencia
            // ✅ El nombre nos dice su propósito: "requiredPayloadByRole" = "payload requerido según el rol." 
            const requiredPayloadByRole : Record<string, keyof RegisterDto> = {

                [RoleName.SYSTEM_ADMINISTRATOR] : 'systemAdministrator',
         
                // 🔹 Aqui decimos:
                // 👉 Si el rol es "ADMINISTRADOR"
                // 👉 entonces el payload obligatorio será "administrator"
                // 🧠 En palabras simples: "Cuando alguien se registre como ADMINISTRATOR, espero que dentro del dto venga la parte dto.administrator"
                // 📦 Entonces este mapa también tiene: ADMINISTRATOR ------> administrator
                [RoleName.ADMINISTRATOR] : 'administrator',

                [RoleName.GUARDIAN]: 'guardian',

                // 🔹 Aquí decimos:
                // 👉 Si el rol es "STUDENT"
                // 👉 entonces el payload obligatorio será "student"
                // 🧠 En otras palabras simples: "Cuando alguien se registra como STUDENT", espero que dentro del dto venga la parte dto.student"
                // 📦 O sea, este objeto está haciendo un "mapa":
                //.   rol -----------> payload obligatorio
                //.   STUDENT -------> student
                [RoleName.STUDENT] : 'student',

                

                [RoleName.TEACHER] : 'teacher',

                
            }


            /* -------------------------------------------------------------------------------------------- */

            // ✅ Campo requerido para el rol encontrado
            // 🔹 Aqui estamos entrando a una parte importante: ya encontramos el rol en la base de datos, por ejemplo: role.name = "STUDENT"
            // 🧠 Ahora el backend necesita responder esta pregunta: "Si el rol es este... ¿Qué campo del dto debo exigir?"
            // 👉 Para eso usamos el objeto requiredPayloadByRole para buscar qué campo del dto corresponde al rol encontrado
            /* 🔹 Piensa asi: requiedPayloadByRole es como una tabla
                    
                    {
                        "STUDENT" : "student",
                        "ADMINISTRATOR": "administrator"
                    }
            
            */ 

            // 👉 Entonces, si role.name vale "STUDENT" el resultado será "student"
            // 👉 Si role.name vale "ADMINISTRATOR", el resultado será "administrator"
            const requiredField = requiredPayloadByRole[role.name];


            // ❌ Aqui preguntamos: ¿No encontramos ningún campo para ese rol?
            // 🔹 o sea: si requiredField vino undefined, null, o vacío, significa que el rol existe, PERO no está configurado
            //.  en el diccionario requiredPayloadByRole
            if(!requiredField){
                // 🧠 Esto No significa que el frontend envió mal los datos
                // ❌ No es culpa del cliente.
                
                // 🔹 Aqui el problema sería interno del backend. Es como si el backend dijera:
                // "Si, conozco el rol TEACHER porque está en la base de datos... pero me olvidé de decir qué payload le corresponde"
                // ✅ Ejemplo: En la base de datos existe: role.name = "TEACHER"
                // Pero en el diccionario solo tienes:
                /*
                    {
                        STUDENT : "student",
                        ADMINISTRATOR: "administrator"
                    }
                */

                // Entonces: requiredPayloadByRole["TEACHER"] -> undefined
                // 🔥 Como no encuentra nada, entra aqui y lanza error
                throw new BadRequestException(
                    // 📤 Enviamos un mensaje claro para detectar el problema: "No hay payload configurado para ese roleName"
                    // 🔹 ${role.name} inserta el nombre real del rol, por ejemplo:
                    // "No hay payload configurado para roleName = TEACHER"
                    `No hay payload configurado para roleName = ${role.name}`,
                );
            }
 
            // ✅ Esto verifica si el frontend si envió ese payload, por ejemplo dto.student, dto.administrator            // ✅ Si llegamos aqui, significa que requiredField si tiene valor
            // 🔹 Es decir: 
            // si role.name = "STUDENT" -> requiredField = "student"
            // si role.name = "ADMINISTRATOR" -> requiredField = "administrator"
            // 🧠 Ahora toca validar otra cosa:
            // "¿El usuario realmente envió ese campo obligatorio en el dto?"
            // 👉 Para eso usamos dto[requiredField]
            // ⭐️ En resumen, si el usuario envia el rol , PERO no envió el payload 
            if(!dto[requiredField]){
                // 🧠 dto[requiredField] es acceso dinámico a una propiedad
                // 🔹 Esto significa: no estamos escribiendo fijo dto.student o dto.administrator sino que lo decidimos en tiempo de 
                //.  ejecución según el rol.
                
                // ✅ Ejemplo 1:
                // requiredField = "student" entonces dto[requiredField] equivale a: dto.student
                
                // ✅ Ejemplo 2: 
                // requiredField = "administrator" entonces dto[requiredField] equivale a : dto.administrator

                // 🔹 En palabras simples:
                // "Busca dentro del dto el campo que corresponde a este rol"

                // ❌ Si no existe ese campo, significa que el request vino incompleto

                // ✅ Ejemplo: 
                // role.name = "STUDENT"
                // requiredField = "student"

                // pero el frontend envió:
                /* 
                    {
                        roleName : "STUDENT"
                    }
                */

            
                // Entonces falta dto.student y por eso entra aqui.
                throw new BadRequestException(
                    // 🧾  String(requiredField) convierte requiredField a texto
                    // 🔹 Esto se hace para imprimirlo bien en el mensaje
                    // Aunque requiredField este tipado como keyOf RegisterDto, aqui queremos mostrarlo como string normal.
                    // ✅ Ejemplo del mensaje final: Debes enviar "student" cuando el rol es STUDENT
                    // ✅ O: Debes enviar "administrator" cuando el rol es ADMINISTRATOR
                    `Debes enviar "${String(requiredField)}" cuando el rol es ${role.name}`,
                );
            }



            /* -------------------------------------------------------------------------------------------- */
 
            // 🔹 Creamos una constante llamada allPayloadFields
            // ✅ Esta constante va a guardar una lista con TODOS los payloads extra posibles que pueden venir dentro de RegisterDto según el rol.
            // 🧠 En palabras simples: esta lista responde a la pregunta: "¿Qué cajitas especiales puede traer el DTO?""
            // ✅ En este caso, las cajitas posibles son: student, administrator, teacher, guardian
            /* 📦 Ejemplo de DTO:
            
                {
                    roleName : "STUDENT",
                    student : { ... }
                }

                📦 Otro ejemplo:
                {
                    roleName : "ADMINISTRATOR",
                    administrator: { ... }
                }
            
            */
            const allPayloadFields : (keyof RegisterDto)[] = [
                'systemAdministrator',
                // 🔹 Agregamos el payload "student" a la lista.
                // ✅ Esto significa que RegisterDto puede tener una propiedad llamada student
                // 🧠 Este campo se usa cuando el rol es STUDENT
                'student',
                // 🔹 agregamos el payload "administrator" a la lista.
                // ✅ Esto significa que RegisterDto también puede tener una propiedad llamada administrator
                // 🧠 Este campo se usa cuando el rol es ADMINISTRATOR
                'administrator',
                'teacher',
                'guardian'
            ]
 
            // 🔄 Ahora recorremos uno por uno todos los payloads posibles
            // 🔹 Piensa que el backend agarra esta lista: ["systemAdministrator","student", "administrator", "teacher", "guardian"] y empieza a revisarla asi:
            // 1️⃣ field = "student"
            // 2️⃣ field = "administrator"
            // 3️⃣ field = "teacher"
            // 4️⃣ field = "guardian"
            // 5️⃣ field = "systemAdministrator"

            // 🧠 ¿Para qué hacemos esto?
            // 👉 Para asegurarnos de que el cliente NO mande payloads de otros roles
            // ✅ Ejemplo válido: role = STUDENT manda solo dto.student
            // ❌ Ejemplo inválido: role = STUDENT pero manda dto.administrator
            // ⭐️ for recorre todos los campos, y no se detiene solo porque uno ya fue correcto
            for(const field of allPayloadFields){
                
                // ⭐️ En cada vuelta, se ejecuta este "if"

                // 🍎 Aqui está la validación importante
                // El if pregunta dos cosas al mismo tiempo:
                // 1️⃣ ¿Este campo que estoy revisando NO es el que corresponde al rol?
                // 🔹 field !== requiredField
                // 2️⃣ ¿Y aún así el cliente lo envío?
                // 🔹 dto[field]
                // ✅ Si ambas cosas pasan al mismo tiempo: entonces el cliente mandó un payload que NO debía mandar.
 
 
                // ⭐️ En esta condición usamos AND (&&) y eso significa: AMBAS condiciones deben ser verdaderas para entrar al if
                // 👉 field es SOLO el nombre del campo revisado en ese momento
                // 👉 dto[field] es el valor real del campo que envió el cliente

                // 🔹 field !== requiredField
                // 👉 Este campo NO debería venir

                // 🔹 dto[field]
                // 👉 Pero el cliente SI lo envió
                // ⭐️ Significa : SI EL CLIENTE ENVIÓ UN CAMPO QUE NO CORRESPONDE A SU ROL

                // ⭐️ Este IF está a la espera de que enviremos algo indebido
                // 🚨 Es un guardia de seguridad
                // ⭐️ ambos usan el mismo "field" de acuerdo a la iteracción actual
                // 👉 Para no entrar en este if, debo enviar únicamente el payload que corresponda al rol.

                // ⭐️ dto[field] -> NO significa dto.requiredField
                // 👉 Sino : "Accede dinámicamente a la propiedad cuyo nombre esté guardado actualmente en field"
                // ⭐️ Primera iteración: field = "student" 
                // ⭐️ Entonces : dto ["student"], se convierte automáticamente en: dto["student"] o equivalente a "dto.student"

                // ⭐️ Segunda iteración: 
                // 👉 Ahora el loop hace: field = "administrator"
                // 👉 Entonces: dto[field] se convierte en dto["administrator"] o equivalente a "dto.administrator"

                // ✨ Lo importante es que tú desde tu frontend SOLO debes enviar el payload correcto
                if(field !== requiredField && dto[field]){
                    
                    // primera iteración
                    // student !== student (role enviado fue student) && dto[student] <- aqui el cliente debió enviar en el payload student
                    // false && true -> false

                    // segunda iteración
                    // administrator !== student && dto [admnistrator] <- pero aqui se envió student
                    // true && false = false


                    // ⭐️ Caso 1: No entra al if (todo correcto)
                    // 🔹 Datos
                    // field = "student"
                    // requiredField = "student"
                    
                    

                    /*
                        dto = { student: {name : "Marco" } }

                    */

                    // 🔍 Evaluación
                    // 🔹 "student" (loop - field) !== "student" (requiredField) -> false porque son iguales
                    // 🔹 dto["student" - loop] = true , porque el cliente si mandó dto["student"] desde el cliente
                    

                    /* ------------------------------------------- */

                    // ⭐️ Caso 2: No entra al if (campo no existe)
                    // 🔹 Datos
                    // field = "administrator" -> aqui va en la segunda iteración
                    // requiredField = "student"

                    /* 
                        dto = {student : {name : "Marco"} }

                    */

                    // 🔍 Evaluación
                    // 🔹 "administrator" (loop - field) != "student" (requiredField) -> true porque si son diferentes
                    // 🔹 dto["administrator" - loop ] = undefined => false , porque el cliente NO envió dto.administrator , envió dto.student desde el cliente
                    // ⭐️ true && false => false

                    /* ------------------------------------------- */


                    // ⭐️ Caso 3: Si entra en el if
                    // 🔹 Datos
                    // field = "administrator"
                    // requiredField = "student"

                    /* 
                        dto = {student : { name : "Marco" } },
                        administrator : { workCode : "ADM-01" }
                    
                    */

                    
                    // 🔍 Evaluación
                    // 🔹 "administrator" (loop - field) !== "student" (requiredField) -> true porque son distintos
                    // 🔹 dto["administrator"] -> true, porque el cliente SI envió dto.administrator

                    // ⭐️ true && true -> true

                    // 🚨 Entonces entra al if
                    // 👉 El backend detecta que el cliente envió un payload que NO corresponde al rol STUDENT


                        // 👉 el backend dirá: "Oye, para STUDENT solo debías mandar student, no administrator"
                    throw new BadRequestException(
                         
                        // 🧾 Construimos un mensaje dinámico
                        // ✅ String(field) convierte el nombre del campo a texto
                        // ✅ ${role.name} inserta el rol real encontrado

                        // 📤 Ejemplo de mensaje: "No debes enviar "administrator" cuando el rol es STUDENT
                        // 📤 Otro ejemplo: "No debes enviar el payload "student" cuando el rol es ADMINISTRATOR.
                        `No debes enviar "el payload ${String(field)}" cuando el rol es ${role.name}`,
                    )

                     
                }
            }


            /* -------------------------------------------------------------------------------------------- */


            // ✅ Vamos a crear un usuario usando SOLO los campos generales de User
            // 🔹 O sea: del DTO grande (RegisterDto) vamos a sacar únicamente la parte que pertenece a la tabla users.
            // 🧠 ¿Por qué? Porque RegisterDto puede traer cosas como: 
            // - dto.student
            // - dto.administrator
            // Y esos datos NO deben ir a la tabla users.
            // Cada cosa debe ir a su lugar

            // 🧼 Creamos un objeto "limpio" con solo los campos de User
            // ✅ Le ponemos el tipo CreateUserDto para que TypeScript nos ayude a garantizar que este objeto tenga la forma correcta
            // 🔹 En palabras simples: "Voy a preparar una cajita nueva solo con los datos del usuario"

            // ⚠️ Pequeño detalle de estilo: por convención, una variable normalmente debería empezar con minúscula.
            // O sea, mejor seria:
            // const createUserDto = { ... }
            // y no:
            // const CreateUserDto = { ... } 
            const createUserDto : CreateUserDto = {

                // ⭐️ Voy a tomar solamente los datos que pertenecen al usuario base y crear un objeto limpio de tipo "CreateUserDto"
                // 🔹 ¿Por qué se hace esto?
                // 👉 Porque RegisterDto tiene información que no pertenece a la tabla "users"
                // ✨ La construcción de CreateUserDto se hace a partir de RegisterDto

                // 📨 Tomamos el email que vino en el dto original y lo copiamos al nuevo objeto limpio
                email : dto.email,  
                // 🙎‍♂️ Tomamos el nombre del usuario desde el dto original
                firstName : dto.firstName, 
                // 🙎‍♂️ Tomamos el apellido del usuario desde el dto original
                lastName : dto.lastName,   
                // 🔐 Tomamos la contraseña desde el dto original
                // 🧠 Normalmente esta contraseña luego se hashea antes de guardarse
                password : dto.password,   
                // 📱 Tomamos el teléfono desde el dto original
                phone: dto.phone,          
                // 🖼️ Tomamos la URL del avatar si el cliente la envió
                avatarUrl : dto.avatarUrl,  
                // 🏷️ aqui asignamos el roleId usando el rol encontrado en la BD
                // ✅ No usamos dto.roleId directo desde el cliente

                // 🔹 ¿Por qué eso es mejor?
                // Porque el cliente podría intentar manipular el rol manualmente
                // entonces la idea es:
                // "Yo backend ya validé el rol y ahora usaré el rol real de la BD"
                //roleId: role.id,
            }

 
            // 👤 Ahora si creamos y guardamos el usuario dentro de la transacción
            // ✅ savedUser será el usuario ya persistido en la base de datos

            // 🔹 En palabras simples: "Primero guardo el usuario base en users"
            // 🧠 Todavía no estamos creando student ni administrator.
            // Solo el registro general del usuario
            const savedUser = await this.users.create(    
                // 📦 Le pasamos el DTO limpio
                // ✅ Aqui solo viajan los campos que pertenecen a User
                createUserDto,  
                role.id,
                // 🔁 También le pasamos el manager de la transacción actual
                // 🧠 Esto es importantísimo:
                // asi users.create (...) trabajará DENTRO de la misma transacción
                // 🔹 O sea:
                // Si después falla la creación de Student o Administrator, también se revierte este usuario
                manager,
            );
             

            /* -------------------------------------------------------------------------------------------- */

            // ✅ Ahora preparamos la lógica específica por rol
            // 🔹 Aqui ya creamos el User general
            // Falta crear el "perfil extra" según el rol.

            // 🧠 Ejemplo:
            // - si es STUDENT -> crear registro en tabla students
            // - si es ADMINISTRATOR => crear registro en tabla administrator

            // ✅ Para eso usamos un objeto llamado handlers
            // Cada clave del objeto representa un rol, y cada valor es una función que sabe qué hacer para ese rol

            // 🔹 En palabras simples: "Tengo una cajita de funciones, una para cada rol"

            // 🧠 Record<string, () => Promise<void> significa:
            // - clave: string (nombre del rol)
            // - valor: función async que no devuelve nada
            const handlers : Record<string, () => Promise<void>>={

                // 👑 HANDLER para el rol SYSTEM_ADMINISTRATOR
                // ✅ Si el usuario tiene el rol SYSTEM_ADMINISTRATOR, esta función será la encargada de crear su perfil de administrador del sistema
                [RoleName.SYSTEM_ADMINISTRATOR]: async () => {

                    // 📦 Obtenemos el repositorio de SystemAdministrator usando la misma transacción actual
                    const systemAdminRepo = manager.getRepository(SystemAdministrator);

                    // 🧱 Creamos la entidad en memoria
                    const systemAdmin = systemAdminRepo.create({
                        // 🔗 Asociamos el perfil con el usuario recién creado
                        user: {id : savedUser.id},
                        // 📄 Datos propios del administrador del sistema
                        documentType: dto.systemAdministrator!.documentType,
                        documentNumber: dto.systemAdministrator!.documentNumber
                    });

                    // 💾 Guardamos para obtener el UUID generado
                    const savedSystemAdmin = await systemAdminRepo.save(systemAdmin);

                    // 🏷️ Generamos un código amigable
                    savedSystemAdmin.systemAdminCode =
                        CodeGenerator.generate('SYS', savedSystemAdmin.id);

                    // 💾 Actualizamos el registro con el código generado
                    await systemAdminRepo.save(savedSystemAdmin);


                },


                // 🎓  Handler para el rol STUDENT
                // ✅  Si el usuario registrado tiene rol STUDENT, esta función será la encargada de crear su perfil de estudiante
                [RoleName.STUDENT] : async () => {
 
                    // 🎓 Obtenemos el repositorio de Student
                    // usando el mismo manager de la transacción
                    // 🧠 Esto asegura que todo siga dentro de la misma transacción
                    const studentRepo = manager.getRepository(Student); 

               
                    // 🧱 Creamos una entidad Student en memoria
                    // ✅ OJO: create(...) todavia NO guarda en la base de datos.
                    // Solo arma el objeto entidad

                    // 🔹 Es como llenar un formulario en memoria, pero todavía no entregarlo
                    const student = studentRepo.create({
                        // 🔗 Relacionamos este Student con el User recién creado
                        // 🧠 savedUser.id ya existe porque el usuario ya fue guardado
                        // Entonces aqui decimos: "este estudiante pertenece a este usuario"
                        user: {id : savedUser.id}, 
                        // 📄 Datos propios del estudiante
                        documentType: dto.student!.documentType,
                        documentNumber : dto.student!.documentNumber
                        // 🏷️ No asignamos studentCode aqui
                        // 🧠 El código se genera después del primer "save()", porque necesitamos que PostgreSQL genere primero el UUID
                    });

                    // 💾 Guardar para obtener UUID
                    const savedStudent = await studentRepo.save(student);

                    // 🏷️ Generar código amigable
                    savedStudent.studentCode = CodeGenerator.generate('STU', savedStudent.id);

                    // 💾 Ahora si guardamos el Student en la base de datos.
                    // 🔹 aqui recién el estudiante se persiste de verdad.
                    await studentRepo.save(savedStudent);
                },


                // 🛡️ HANDLER para el rol ADMINISTRADOR
                // ✅ Si el rol usuario tiene rol ADMINISTRATOR, esta función será la encargada de crear su perfil de administrador
                [RoleName.ADMINISTRATOR] : async () => {

                    // 🗂️ Obtenemos el repositorio de Administrador dentro de la misma transacción
                    const adminRepo = manager.getRepository(Administrator); 

                    
                    // 🧱 Creamos la entidad Administrator en memoria.
                    // ✅ Igual que antes: create(...) prepara el objeto pero aún no lo guarda
                    const admin = adminRepo.create({
                        // 🔗 Relacionamos el administrador con el usuario recién creado
                        user: {id : savedUser.id},  
                        // 📄 Datos propios del administrador
                        documentType : dto.administrator!.documentType,
                        documentNumber : dto.administrator!.documentNumber
                        // 🏷️ No asignamos administratorCode aqui
                        // 🧠 El código se genera después del primer "save()", porque necesitamos que PostgreSQL genere primero el UUID
                    });

                    // 💾 Guardamos para obtener UUID
                    const savedAdmin = await adminRepo.save(admin);

                    // 🏷️ Generar código amigable
                    savedAdmin.administratorCode = CodeGenerator.generate('ADM', savedAdmin.id);

                    // 💾  Actualizar administrador con el código generado
                    await adminRepo.save(savedAdmin);
                },

                // 👨‍🏫 HANDLER para el rol TEACHER
                // ✅ Si el usuario tiene rol TEACHER, este bloque crea su perfil de docente
                [RoleName.TEACHER]: async() => {

                    // 📦 Obtenemos el repositorio de Teacher dentro de la misma transacción
                    const teacherRepo = manager.getRepository(Teacher);


                    // 🧱 Creamos la entidad Teacher en memoria
                    const teacher = teacherRepo.create({
                        // 🔗 Relacionamos el docente con el usuario recién creado
                        user: {id : savedUser.id},
                        // 📄 Datos propios del profesor
                        documentType: dto.teacher!.documentType,
                        documentNumber: dto.teacher!.documentNumber,
                        professionalTitle : dto.teacher!.professionalTitle
                        // 🏷️ No asignamos teacherCode aqui
                        // 🧠 El código se genera después del primer "save()", porque necesitamos que PostgreSQL genere primero el UUID
                    });

                    // 💾 Guardamos para obtener el UUID generado por PostgreSQL
                    const savedTeacher = await teacherRepo.save(teacher);

                    // 🏷️ Generamos un código amigable basado en el UUID
                    savedTeacher.teacherCode = CodeGenerator.generate('DOC', savedTeacher.id)

                    // 💾 Actualizamos el docente agregando el código generado
                    await teacherRepo.save(savedTeacher);
                },

                // 👨‍👩‍👦  HANDLER para el rol GUARDIAN
                // ✅ Si el usuario tiene rol GUARDIAN, este bloque crea su perfil de apoderado
                [RoleName.GUARDIAN]: async() => {

                    // 📦 Obtenemos el repositorio de Guardian dentro de la misma transacción
                    const guardianRepo = manager.getRepository(Guardian);

                    
                    // 🧱 Creamos la entidad Guardian en memoria
                    const guardian = guardianRepo.create({
                        // 🔗 Relacionamos el apoderado con el usuario recién creado
                        user : {id : savedUser.id},
                        // 📄 Datos propios del apoderado
                        documentType : dto.guardian!.documentType,
                        documentNumber: dto.guardian!.documentNumber,
                        //relationship : dto.guardian!.relationship
                        // 🏷️ No asignamos guardianCode aqui
                        // 🧠 El código se genera después del primer "save()", porque necesitamos que PostgreSQL genere primero el UUID
                    });

                    // 💾 Guardamos para obtener el UUID generado por PostgreSQL
                    const savedGuardian = await guardianRepo.save(guardian);

                    // 🏷️ Generamos un código amigable basado en el UUID
                    savedGuardian.guardianCode = CodeGenerator.generate('GUA', savedGuardian.id);

                    // 💾 Actualizamos el apoderado agregando el código generado
                    await guardianRepo.save(savedGuardian);

                }
            
            }

            // 🚀 Ejecutamos el handler correspondiente al rol del usuario
            // 🧠 ¿Qué está pasando aqui?
            // 🔹 2️⃣Hasta este momento NO hemos ejecutado ninguna función
            // 👉 Solo creamos un objeto llamado "handler" que guarda una función para cada rol

            // ⌛️ Usamos await porque cada handler es una función async
            // 🔹 Debemos esperar a que termine de guardar el perfil correspondiente antes de continuar con el resto del
            //   proceso o finalizar la transacción


            // 🔹 Flujo
            // 1️⃣ JavaScript crea el objeto "handlers": Lee esto: const handlers = { [UserRole.STUDENT] : async () => {...} , ... }
            // Y piensa: "Perfecto, guardaré estas funciones en memoria", pero No ENTRA DENTRO de ninguna función. No ejecuta:
            // async () => { ... } . Simplemente las almacena
            // 2️⃣ Llega al final: await handlers[role.name](); Aqui si ocurre algo, 
            // 🔹 Primero evalúa: handlers[role.name]. Supongamos que: role.name === UserRole.STUDENT, entonces queda handlers[UserRole.STUDENT]
            // ❌ Que devuelvo: async () => {console.log("Crear estudiante");}
            // 3️⃣ Los paréntesis ejecutan la función : handlers[role.name]()
            // 4️⃣ Termina y vuelve, cuando termina : await studentRepo.save(savedStudent); sale de la función y regresa aqui:
            //    await handlers[role.name]();
            // 🔹 Luego continúa con la siguiente línea del método



            // 🧠 Esto significa:
            // si role.name = "STUDENT" entonces ejecuta: handlers["STUDENT"]()
            // si role.name = "ADMINISTRATOR" entonces ejecuta: handlers["ADMINISTRATOR"]()
            // 🔹 En palabras simples:
            // "Según el rol, abro la función correcta y la ejecuto"
            await handlers[role.name](); 

            
            // ✅ Si llegamos hasta aquí, significa que TODO salió bien
            // 🔹 O sea:
            // - se creó el User
            // - se creó el perfil extra según el rol
            // - Y todo dentro de la misma transacción

            // 🧠 Si algo hubiera fallado antes, la transacción hacía rollback y nada quedaba guardado
            return savedUser;  
        });

        }catch (error) { // 🧯 Capturamos cualquier error ocurrido dentro o fuera de la transacción

            // 🧨 Error UNIQUE en PostgreSQL (por ejemplo email repetido)
            // 👉 code '23505' = unique_violation
            if (error instanceof QueryFailedError && (error as any).code === '23505') { 
                throw new ConflictException('Ya existe un usuario con ese email'); // 🚫 409: conflicto por duplicado
            }

            // ♻️ Re-lanzamos errores conocidos (ya son claros y controlados)
            if (
                error instanceof BadRequestException || // 🚫 400: datos inválidos
                error instanceof ConflictException ||   // 🚫 409: conflicto
                error instanceof NotFoundException      // 🚫 404: recurso no encontrado
            ) {
                throw error; // 📤 No lo ocultamos, lo devolvemos tal cual
            }

            // ❌ Error inesperado (no controlado)
            throw new InternalServerErrorException('Error al registrar el usuario'); // 🧨 500: fallo interno genérico
        }
    }

}

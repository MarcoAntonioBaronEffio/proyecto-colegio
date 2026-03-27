// 🔹 ConflictException -> Excepción HTTP (código 409) que se lanza cuando ocurre un conflicto, por ejemplo: DNI o Email duplicado.
// 🔹 Injectable -> Convierte esta clase en un servicio que Nest puede inyectar en otros lugares.
import { ConflictException, Injectable } from '@nestjs/common';
// 🔹 InjectRepository -> Decorador que inyecta un repositorio TypeORM (en este caso, de la entidad Alumno)
import { InjectRepository } from '@nestjs/typeorm';
// 🔹 Alumno -> Tu entidad que representa la tabla 'alumno' en la base de datos.
import { Alumno } from 'src/entities/alumno.entity';
// 🔹 Repository -> Clase genérica de TypeORM para interactuar con la BD (find, save, delete, etc.).
import { Repository } from 'typeorm';
// 🔹 CreateAlumnoDto -> Objeto de transferencia de datos: define qué datos espera recibir tu endpoint.
import { CreateAlumnoDto } from './dto/create-alumno.dto';
// 🔹 bcryptjs -> Librería para encriptar contraseñas.
// 🔵 En Node.js/TypeScript (y también en NestJS), cuando instalas un paquete con npm install, este se coloca en la carpeta
// "node_modules/" lo correcto es: import bcrypt from 'bcryptjs' y NO import bcrypt from 'node_modules/bcryptjs';
// 📌 ¿Por qué no hace falta poner 'node_modules/'? 
// 1.- Node.js y TypeScript ya saben que todas las librerías externas están dentro de node_modules.
   // - Cuando escribes import bcrypt from 'bcryptjs; ' el sistema automáticamente busca la carpeta node/modules/bcryptjs.
// 2.- Esto se llama module resolution: el compilador resuelve el paquete sin que tú tengas que indicar la ruta.
// 3.- Solo usamos rutas relativas (./ o ../) cuando queremos importar archivos nuestros, como:
   // import {CreateAlumnoDto} from './dto/create-alumno.dto' , aquí sí ponemos './' porque el archivo es local.
// 🔑 En resumen: 
// - Las librerías externas -> se importan solo por su nombre (bcryptjs, typeorm, @nestjs/common, etc).
// - Archivos tuyos -> se importan con rutas (./dto/... , ../entities/...).
import bcrypt from 'bcryptjs';








//🔹 @Injectable.- Es un decorador que indica que esta clase es un servicio en NestJS.
//Los servicios contienen la lógica de negocio
@Injectable()
export class AlumnoService {
    // 🔹 ¿Qué es el constructor?
    // En programación orientada o objetos POO, el constructor es un método especial que se ejecuta automáticamente cuando se
    // crea una instancia de la clase (new AlumnoService() en este caso).
    // Sirve para inicializar valores o inyectar dependencias que la clase necesita para funcionar. 
    // 👨‍🏫 Analogía
    // Imagina que AlumnoService es un profesor, y que necesita acceso a la lista de alumnos (repositorio).
    // En vez de que el profesor vaya a buscar la lista por su cuenta, NestJS se la entrega en el momento que lo crean
    // 🔹 En resumen, el constructor en tu servicio
    // - Recibe el repositorio de 'Alumno' desde NestJS (no lo creas tú manualmente).
    // - Guarda ese repositorio en la propiedad 'repo'.
    // - Luego lo puedes usar en tus métodos (findOne, save, etc.).
    constructor(
        // 🔹 @InjectRepository(Alumno) es un decorador de NestJS que le dice al framework:
           // 👉🏼Dame el repositorio (Repository<Alumno>) que TypeORM creó para la entidad Alumno
        //NestJS se encarga de traértelo automáticamente.   
        @InjectRepository(Alumno)
        // 🔹 repo es una propiedad privada de la clase AlumnoService
        // 🔹 readonly  significa que no puedes reasignar repo después de inicializarlo
        // Su tipo es Repository<Alumno>, o sea: el objeto de TypeORM con el que puedes hacer find, save, delete, etc.
        private readonly repo: Repository<Alumno>,
    )
    // 🔹 {} 
    // Es el cuerpo del constructor, vacío porque no necesitas lógica extra.
    // Solo con definir los parámetros y el decorador, NestJS hace la inyección de dependencias automáticamente.
    {}

    // 🔹 La función create devuelve una promesa. Cuando termine (con éxito), el valor de esa promesa será un objeto de tipo 'Alumno'
    // 🔹 async -> porque se harán operaciones asíncronas (consultas BD, encriptación).
    // 🔹 dto: CreateAlumnoDto -> recibe los datos del alumno.
    // 🔹 Promise<Alumno> -> devuelve una promesa que resuelve en un objeto 'Alumno'.
    // Una promesa (Promise) es un objeto especial que representa el resultado de una operación asíncrona.
    // 👉🏼 Es como un "boleto o vale" que te garantiza que en el futuro recibirás:
    // ✅ Un resultado exitoso con (con .then() o 'await') o
    // ❌ Un error (con . catch() o try/catch)
    // 🔹 Estado de una promesa: una promesa puede estar en tres estados:
    // 1.- Pending (pendiente) -> todavia no se resuelve.
    // 2.- Fulfilled (cumplida) -> terminó bien y devuelve un valor.
    // 3.- Rejected (rechazada) -> terminó mal y devuelve un error.
    async create (dto : CreateAlumnoDto) : Promise<Alumno>{

        //🔹 this.repo.findOne(...)
          // this: accedemos a 'repo' que se guardó como propiedad en esta clase AlumnoService.
          // repo: es el repositorio de tu entidad 'Alumno', que Nest te inyecta cuando usas @InjectRepository.
          // Con findOne le dices a TypeORM: "búscame un registro en la tabla que cumpla con estas condiciones"

        //🔹where: [ ... ] : Sirve para definir condiciones de búsqueda en tu consulta
        // Es un objeto (o arreglo de objetos) que le dice a TyoeORM qué condición usar en el WHERE de SQL.
        // Básicamente, traduce a algo como: SELECT * FROM alumno WHERE ...
        // Ese array dentro de where significa: 
           // 👉🏼 Encuentra un alumno cuyo 'dni' sea igual a 'dto.dni' o cuyo 'email' sea igual a 'dto.email'.  
           // 👉🏼 'dni' y 'email' son las columnas de la tabla 'Alumno' en la base de datos.
           // 📌 Ese arreglo where : [{dni:dto.dni}, {email:dto.email}] significa que se van a combinar con un OR
              // SELECT * FROM alumno WHERE dni = '123' OR email = 'prueba@gmail.com' LIMIT 1;
           // 📌 Pero... si quieres una sola condición (se traduce a AND si pones varias claves dentro de una mismo objeto)
              // where : {dni: dto.dni, email: dto.email} 
              // SQL: WHERE dni = '123' AND email = 'prueba@gmail.com'.
        // Ejemplo:
           // Si llega un DTO con {dni: "123", email: "prueba@gmail.com"}, buscará:
              // un alumno con dni = 123
              // o un alumno con email = prueba@gmail.com
        const exists = await this.repo.findOne({where: [{dni: dto.dni}, {email: dto.email}]});


        // 🔹 if (exist)
           // Si la consulta encuentra un alumno, 'exists' tendrá ese objeto (Alumno).
           // Si no encuentra nada, 'exist' será null. Ese null no viene de la base de datos directamente, sino de TypeORM como 
           // respuesta.
        // para que el desarrollador sepa que "la consulta no arrojó ningún resultado".
        // 📌 Por qué es útil que sea null.
        // - Si devolviera un objeto vacío {}, sería confuso.
        // - Si devolviera un array [], sería más incómodo en este caso, porque solo quieres un registro o nada.
        // - null es claro y directo : "no se encontró nada"
        // ✅ Entonces: sí, nos conviene que sea 'null', porque así la lógica de validación es sencilla:
          // null = no existe -> puedes crear.
          // entidad = sí existe -> lanza error.
        if(exists) {
            // 🔹 throw new ConflictException(...)
            // - NestJS trae excepciones listas (ej: BadRequestException, NotFoundException, etc.).
            // - Aquí usamos 'ConflictException' porque significa un 409 Conflict, que se usa cuando intentas crear algo que 
            // que entra en conflicto con datos existentes.
            // - Mensaje: 'DNI o Email ya registrados'.

            throw new ConflictException('DNI o Email ya registrados');
        }
 
        
        // 🔹 ¿Qué hace bcrypt? : bcrypt es una librería que sirve para encriptar contraseñas de forma segura.
        // El método hash toma:
        // 1.- El texto original (en este caso, 'dto.password' que escribió el usuario en su formulario).
        // 2.- El número 10, que representa los sald rounds.
        // 🔹 ¿Qué son los salt round?
        // - salt = un valor aleatorio que se añade a la contraseña antes de calcular el hash.
        // - rounds = cuántas veces se aplica el algoritmo internamente para dificultar ataques de fuerza bruta.
        // - Mientras más alto el número, más seguro, pero también más lento (impacta el rendimiento).
        // - Lo normal es usar 10 o 12.
        // 🔵 Ejemplo si el usuario escribe : "123456".
        // - bcrypt lo mezcla con un salt único (random).
        // - Lo transforma en algo irreconocible como: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAg6t2ZZ.bxWjT5Gr0H7G6p6lT3sW
        // Desglose de las partes:
        // 1.- $2a$ -> Es la versión/identificador del algoritmo bcrypt que se usó.
        // 2.- 10$ -> El número del salt rounds (en este caso 10)
        // 3.- N9qo8uLOickgx2ZMRZoMye -> Este pedazo es el salt aleatorio generado por bcrypt.
               // ⚡️ Este valor cambia cada vez que haces un hash, incluso con la misma contraseña.
        // 4.- IjZAg6t2ZZ.bxWjT5Gr0H7G6p6lT3sW -> Esta es la parte final: el hash de la contraseña + salt.
               // Es irrepetible y único.
               // Es lo que bcrypt compara internamente cuando usas bcrypt.compare.
        // 🔹 ¿Por qué usamos await?
        // bcrypt.hash() -> devuelve una Promise (operación asíncrona, tarda un poco en calcular el hash).
        // Con await, esperamos a que termine antes de seguir con el resto del código.
        // 🔹 ¿Qué guardamos en la base de datos?
        // - Nunca se guarda la contraseña original (dto.password).
        // - Guardas el hash (passwordHash).
        // - Ejemplo en la tabla alumnos: 
        // {"id":1, "email":"ejemplo@gmail.com", "password":"$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAg6t2ZZ.bxWjT5Gr0H7G6p6lT3sW"}
        // 🔹 ¿Cómo se valida luego? : Cuando el usuario hace login:
           // 1.- El usuario envía su contraseña "123456".
           // 2.- Usas bcrypt.compare(passwordPlano, passwordGuardadoEnDB).
           // 3.- bcrypt hace el mismo proceso de hash y compara.
              // Si coinciden -> login exitoso.
              // Si no -> error de credenciales.
        const passwordHash = await bcrypt.hash(dto.password, 10);

        //🔹 this.repo.create() -> Crea una instancia de Alumno pero no la guarda aún en la BD.
        // ...dto -> copia todas las propiedades que vienen en el DTO.
        // passwordHash -> agrega la contraseña encriptada
        const alumno = this.repo.create({
            ...dto,
            passwordHash,
        });

        //🔹 this.repo -> es el repositorio de la entidad Alumno.
        //🔹 .save(alumno) -> inserta un nuevo registro si ese objeto aún no existe en la BD.
        //🔹 save() -> Inserta o actualiza, devuelve el registro completo después de guardarlo.
        //  - Actualiza el registro si el objeto ya tiene un id existente en la tabla.
        //  - Devuelve el objeto completo que quedó guardado en la BD.
        //  - Si la entidad tiene campos automáticos (ej: id, createAt, updatedAt) , también los rellena.
        return this.repo.save(alumno);

    }

    // Método del servicio que devuelve todos los registros de alumnos
    findAll(){
      // Usamos el repositorio inyectado (this.repo) para consultar en la base de datos.
      // 🔹 find() es un método de TypeORM que devuelve todas las filas de la tabla asociada a la entidad
      // 🔹 Esto ejecuta: SELECT * FROM alumnos;
      return this.repo.find();
    }


}

import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//🔹 Enum "Genero"
// - Definimos un "enum" (enumeración) que es un conjunto de valores predefinidos.
// - Aquí usamos para representar el género del alumno.
// - En la base de datos se guardará como texto (ej: "MASCULINO", "FEMENINO" u "OTRO")
export enum Genero {
    MASCULINO = 'MASCULINO',
    FEMENINO = 'FEMENINO',
    OTRO = 'OTRO',
}

//🔹 Decorador @Entity()
// - Indica que esta clase (Alumno) es una "Entidad" de TypeORM, es decir, se mapeará a una tabla en la base de datos.
// - {name: 'alumnos'} -> el nombre real de la tabla será "alumnos".
@Entity({name : 'alumnos'})

//🔹 Index()
// - Crea índices en columnas específicas para optimizar búsquedas.
// - UQ (Unique) -> Significa que no se pueden repetir valores en esa columna.
// - Ejemplo : no puede haber dos alumnos con el mismo dni o el mismo email.
@Index('UQ_alumno_dni', ['dni'], {unique : true})
@Index('UQ_alumno_email', ['email'], {unique : true})

//🔹 Indice normal (no único), para acelerar búsquedas por apellidos.
@Index('IDX_alumno_apellidos', ['apellidos'])
 

export class Alumno{

    //🔹@PrimaryGeneratedColum(...) : Es un decorador de TypeORM.
    //Indica que esta columna será la clave primaria de la tabla.
    //Además, no necesitas asignarle un valor manualmente, porque será generado automáticamente por la base de datos.
    // El argumento 'increment' 
    // Existen varias estrategias de generación de ID en TypeORM:
       // 'increment' : genera un número secuencial autoincremental (1, 2, 3, ...).
       // 'uuid' : genera un identificador único universal (ej: 550e8400-e29b-41d4-a716-446655440000)
       // 'rowid' (en SQLite)
    // Aqui se usa 'increment', lo que significa que cada vez que insertes un nuevo registro,la base de datos le asignará un número
    //consecutivo automáticamente.
    // 👉🏼 En resumen ese decorador le dice a TypeORM: 
    // "Crea una columna primaria llamada id, que sea de tipo numérico y que la base de datos la vaya llenando de forma 
    // autoincremental."
    @PrimaryGeneratedColumn('increment')
    // Declara la propiedad 'id' en tu entidad como un número.
    //En TypeScript será un number
    // Ese campo representará la columna id de la tabla en la base de datos.
    // Al crear un nuevo objeto de la entidad, no hace falta darle valor: la BD lo pondrá sola.
    id: number;

 

    //🔹 @Column ({...})
    //Es un decorador de TypeORM que convierte la propiedad 'dni' en una columna de la tabla en la base de datos.
    //Dentro de { ... } se definen las opciones de esa columna.
    // 🔹 type : 'varchar' le dice a TypeORM qué tipo de dato usar en la base de datos.
    // 🔹 varchar significa "cadena de longitud variables", ideal para textos cortos.
    // 🔹 length : 20 , Especifica la longitud máxima de la cadena.
    // Aquí se limita a 20 caracteres (suficiente para DNIs, que suelen ser de 8 - 12 dígitos, dejando margen)
    @Column({type : 'varchar', length: 8})
    //Esta es la propiedad en tu clase/entidad
    //En TypeScript será una cadena (string)
    //En la base de datos será una columna tipo varchar(20)
    dni : string;

    @Column({type : 'varchar', length : 120})
    nombres : string;

    @Column({type : 'varchar', length: 120})
    apellidos : string;

    @Column({type: 'varchar', length : 160})
    email : string;

 
    //🔹 @Column le dice a TypeORM que esta propiedad será una columna en la base de datos
    //🔹 type: 'varchar' el campo será texto variable (cadena de caracteres)
    //🔹 varchar es ideal para guardar cadenas cuyo tamaño puede variar
    //🔹 length: 255 define la longitud máxima de la cadena: 255 caracteres
    // Se suele usar 255 porque es un estandar seguro para almacenar valores como hashes de contraseñas (que normalmente tienen 
    // entre 60 y 100 caracteres, por ejemplo un hash bcrypt ≈ 60 ).
    //🔹 select : false , indica que esta columna NO se incluirá automáticamente en las consultas SELECT.
    //   Esto se hace por seguridad, para no exponer las contraseñas (aunque estén en hash) cada vez que consultes usuarios.
    @Column({type : 'varchar', length: 255, select: false})
    //Es la propiedad en tu clase/entidad
    //En TypeScript la manejas como string
    //En la base de datos será un VARCHAR (255)
    passwordHash: string;

    //🔹 @Column({}), decorador de TypeORM
    // Le dice a Nest/TypeORM que esta propiedad de la clase (fecha_nacimiento) será una columna en la tabla de PostgreSQL
    //🔹 type: 'date' define el tipo de dato en la base de datos
    //🔹 'date' significa que en PosgreSQL se guardará como una fecha (ej: 2000-05-15).
    // No guarda horas ni minutos, solo la fecha.
    //🔹 nullable : true , permite que esta columna pueda quedar vacía (NULL) en la base de datos.
    // Ejemplo: si un alumno no registró su fecha de nacimiento, el campo quedará NULL en la tabla.
    @Column({type : 'date', nullable:true})
    //fecha_nacimiento -> nombre de la propiedad
    //? -> significa que es opcional en el código (puedes crear un alumno sin dar fecha).
    // string | null -> el valor puede ser una cadena de texto (ej: "2000-05-15") o null si no hay fecha registrada.
    // 👉🏼 Ojo: aunque en PostgreSQL el tipo es "date", TypeORM normalmente lo transforma a string cuando llega a Typescript.
    fecha_nacimiento?: string | null;






    //🔹 @Column({}) decorador de TypeORM: nos dice crea una columna en la base de datos
    //🔹 type: 'enum' significa que esta columna será de tipo enumerado
    // Un "enum" es un conjunto de valores limitados y predefinidos (ej: "Masculuno", "Femenino", "Otro").
    // En SQL esto se traduce a un ENUM
    //🔹 enum : Genero , aquí le decimos cuál es el enum de TypeScript que define los valores permitidos
    //🔹 nullable : true , permite que esta columna pueda estar vacía (NULL) en la base de datos. Es decir, el alumno puede
    // registrarse sin definir género todavía.
    //🔹 genero? : Genero | null :
    // genero? -> El signo ? indica que la propiedad es opcional es TypeScript
    // Genero | null -> significa que puede tener un valor del enum "Genero", o buen "null". 
    @Column({type: 'enum', enum: Genero, nullable : true})
    genero?: Genero | null;

    @Column({type : 'varchar', length:200, nullable : true})
    direccion?:string | null;

    @Column({type: 'varchar', length: 200, nullable: true})
    telefono?:string | null




 


    //🔹 @CreateDateColumn(...) es un decorador especial de TypeORM
    // Sirve para crear una columna que automáticamente guarda la fecha y hora en a que se insertó el registro.
    // No necesitas asignarle valor tú -> TypeORM y la base de datos lo rellenan solos en el momento del INSERT.
    // Es muy útil para audotoría, porque siempre sabes cuándo se creó cada fila.
    //🔹 {name: 'create_at', ...}
    // name = 'create_at' define el nombre real de la columna en la base de datos.
    // Aunque en tu entidad se llame createAt, en SQL aparecerá como "create_at".
    // Esto se hace para mantener consistencia con convenciones SQL (snake_case)
    //🔹 type: 'timestamptz'
    // Indica el tipo de dato en la base de datos.
    // timestamptz = timestamp with time zone (marca de tiempo con zona horaria)
    // Guarda la fecha y hora exacta del momento de inserción, considerando la zona horaria.
    // Ejemplo: 2025-09-04 01:35:42.123-05
    @CreateDateColumn({name: 'created_at', type: 'timestamptz'})
    //createdAt : Data; en tu entidad (TypeScript), este campo es un objeto de tipo Date.
    //Cuando consultas desde la base de datos, recibes directamente un objeto Date en JS.
    createdAt : Date;






    







    //🔹 @UpdateDateColumn(...) es un decorador especial de TypeORM, parecido a @CreateDateColumn.
    //La diferencia es que aquí la fecha/hora se actualiza automáticamente cada vez que el registro sufre un UPDATE.
    //No necesitas ponerla manualmente en tu código -> TypeORM y la base de datos lo hacen por ti.
    //🔹 {name : 'update_at'} define cómo se verá en la base de datos.
    // Aunque en tu clase sea updatedAt, en SQL será 'updated_at'.
    // Esto sigue la convención "snake_case" en tablas.
    //🔹 type: 'timestamptz' significa que se guardará un timestamp con zona horaria.
    // Cada vez que se haga un UPDATE a la fila, este valor cambiará automáticamente
    // Ejemplo de valor guardado: 2025-09-04 01:52:00.456-05
    @UpdateDateColumn({name : 'updated_at', type: 'timestamptz'})
    //updatedAt: Date, en tu entidad de (Type), el campo se representa como un objeto Date.
    //Cuando recuperas el registro, puedes usarlo en JS/TS como cualquier fecha.
    updatedAt : Date;


}
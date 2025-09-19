// ✅ Importamos decoradores de la librería class-validator que nos permiten validar automáticamente los datos.
import { IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator";

// ✅ Importamos el enum "Genero" desde la entidad Alumno.
// Lo usamos para validar que el campo "género" solo acepte valores válidos.
import { Genero } from "src/entities/alumno.entity";


// ✅ Definimos la clase CreateAlumnoDto.
// Cada propiedad de esta clase representará un campo que se espera al crear un alumno. 
 export class CreateAlumnoDto{

    // 📌 Campo "dni"
    // - Debe ser un string.
    // - Debe tener entre 8 y 20 caracteres. 
    @IsString() @Length(8,20)
    //⚠️ esta sintaxis no pertenece a Nest ni a class-validator, sino a TypeScript
    //dni -> es el nombre de la propiedad.
    // :string -> es el tipo de dato en TypeScript.
    //Eso le dice al compilador : "esta propiedad siempre debe ser de tipo string"
    dni : string;
 
    // 📌 Campo "nombres"
    // - Debe ser un string.
    // - Entre 1 y 120 caracteres.
    @IsString() @Length(1,120)
    nombres : string;

    // 📌 Campo "apellidos"
    // - De ser un string.
    // - Entre 1 y 120 caracteres.
    @IsString() @Length(1,120)
    apellidos: string;

    // 📌 Campo "email"
    // - Debe tener formato de correo electrónico válido
    @IsEmail()
    email : string;


    // 📌 Campo "password"
    // - Debe ser un string.
    // - Entre 6 y 128 caracteres.
    // ⚠️ Nota: Aquí se recibe el password en texto plano, pero en el servicio deberías convertirlo a hash antes de guardarlo.
    @IsString()
    @Length(6,128)
    password: string;

 

    // 📌 Campo "fecha_nacimiento"
    // - Es opcional (puede no enviarse).
    // - Si se envía, debe ser un string (ej: "2000-05-21")
    @IsOptional()
    @IsString()
    fecha_nacimiento?: string;

    // 📌 Campo "genero"
    // - Es opcional.
    // - Si se envía, debe ser uno de los valores del enum "Genero".
    // Ejemplo válido: "masculino" o "femenino"
    @IsOptional() 
    @IsEnum(Genero)
    genero?: Genero;


    // 📌 Campo "direccion"
    // - Es opcional (puede no enviarse).
    // - Si se envía, debe ser un string
    @IsOptional() 
    @IsString()
    direccion?: string;
    
 


    // 📌 Campo "telefono"
    // - Es opcional
    // - Si se envía, debe ser un string (ej: "987654321")
    @IsOptional() @IsString()
    telefono?: string;
 }
 




 // 🚀 Relacion con class-validator
 // - TypeScript solo valida en tiempo de compilación (antes de ejecutar el programa).
 // - class-validator valida en tiempo de ejecución (cuando tu app recibe datos reales).
 // Por ejemplo: Si un cliente envía esto en el body: 
 // {"dni" : 12345678}
 // - TypeScript no lo detecta, porque los datos vienen de un JSON externo.
 // - class-validator(@IsString()) sí lo detecta en ejecución -> y responde con un error 400 Bad Request.
 // ✅ En resumen:
 // - dni: string -> es TypeScript -> define el tipo estático.
 // - @IsString() -> es class-validator -> valida los datos reales en tiempo de ejecución.


 


 //⌛️ Orden de ejecución
 //🔹TypeScript (dni: string)
 // - Se ejecuta en tiempo de compilación (cuando tú corres tsc o cuando Nest transpila tu código a JavaScript).
 // - Su trabajo es solo avisarte si estás usando mal los tipos en el código que tú escribes.
 // - No valida datos externos, porque al final del proceso tu código corre como JavaScript puro (sin tipos).
 // Ejemplo:
 // let dni : string = 123; // ❌ Error en TypeScript antes de compilar

 // 🔹 class-validator (@IsString(), @Length(), etc)
 // - ✅ Se ejecuta en tiempo de ejecución, es decir, cuando tu aplicación ya está corriendo y recibe datos reales (ej: un POST desde
 // Postman)
 // - Gracias al ValidationPipe de NestJS, esos decoradores se aplican sobre el DTO antes de que entre al controlador.
 // - Si los datos no cumplen las reglas -> lanza un error 400 Bad Request.
 //Ejemplo: Supongamos que llega esto desde un cliente : { "dni" : 12345678 }
 // - TypeScript no lo puede parar, porque eso es un JSON en tiempo de ejecución.
 // - Pero class-validator detecta que no es un string y devuelve:
 // { "statusCode" : 400, "message" : ["dni must be a string"], "error" : "Bad Request"}

 // 🚦 En resumen
 // - Primero entra TypeScript, pero solo mientras compilas y desarrollas -> evita que tú mismo cometas errores de tipo en tu código.
 // - Después, en la app ya ejecutándose, entra class-validator para revisar que los datos externos (los que vienen del cliente
 //.  sean válidos.)
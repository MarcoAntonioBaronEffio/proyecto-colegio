// 📘 Data Transfer Object (DTO) para endpoint de login
import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength ,IsNotEmpty} from "class-validator";

// 🧱  Un DTO (Data Transfer Object) define la estructura exacta de los datos que el cliente debe enviar al servidor en una petición HTTP.
// Sirve para validar y tipar correctamente los campos recibidos, aumentando la seguridad y la claridad del código.
// 🔹 Desde el front, el cliente SOLO envía datos planos en el body del request, por ejemplo : { "email": "marco@admin.com", "password": "123456" }
// 🔹 El frontend (jetpack compose) no sabe nada de DTOs, decorators ni validaciones. Esto es 100% responsabilidad del backend.
// 🔹 En NestJS: lo que no cumple el DTO -> No entra , lo que cumple -> pasa al controller

// ⭐️ @Transform -> Sirve para transformar/normalizar/limpiar el dato recibido ANTES de validarlo. Se aplica "campo por campo"
// ⭐️ class-validator -> Sirve para validar que el dato sea correcto, bloquea request inválidos, evita lógica defensiva dentro del service.
//   Todo lo que viene de @IsNotEmpty, @IsEmail, @IsString, @MinLength, @MaxLength.
// ✨ Regla de oro : Transforma para no romper, valida para decidir


// 📌 Orden real de ejecución: 1.- Transform -> 2.- Validaciones (@IsEmail, @IsNotEmpty, etc) -> 3.- Controller -> 4 -> Service
// 👉 Importante: No hay validación sin transformación previa, si el cliente manda "", igual pasa por transform, él devolverá "" y luego pasa a validación,
//    posteriormente el request se bloquea automáticamente
export class LoginDto{


    // 📧 Campo que representa el correo electrónico del usuario.
    // 🔹 Convierte automáticamente el email a minúsculas.
    // Primero se ejecutan los decoradores de transformación (@Transform, @Type, etc).
    // En este caso -> Entrada del cliente : " MARCO@ADMIN.COM " -> valor final : "marco@admin.com"
    // 🔹 value es el valor crudo que envió el cliente desde el frontend

    // ❓ Operación ternario ? : 
    // 🔹 condición ? si_es_verdadero : si_es_falso
  
    @Transform(({ value }) =>
        // typeof es un operador de javascript / typescript, sirve para saber qué tipo de dato tiene una variable
        // ejemplo: typeof "hola" -> "string" | typeof 123 -> "number"
        // ⭐️ Sin typeof -> se rompe , Con typeof : se valida
        typeof value === 'string'  // verifica el tipo de dato, protege contra null, undefined, números, booleanos, objetos
            ? value.toLowerCase().trim()  // Si es true , es decir, si es un string, lo convertimos a minúsculas y quitamos los espacios
            : value)                      // Si es false, es porque NO es texto, entonces devuelve el valor sin modificarlo, no lo transforma, no lo toca
    // Si el cliente manda "null", typeof null === 'string -> ❌ false -> retorna null, luego entra en el validador @IsNotEmpty ❌ , @IsEmail ❌, El request 
    // se bloquea automáticamente con 400 Bad Request , ✅ Error controlado (no error de servidor)

    // --------------------------------------------------------------------------------------------------------------------------------------------

    // 🔹 Asegura que el campo esté presente y no sea cadena vacía.
    @IsNotEmpty({message: 'El email es obligatorio'})
    // 🔹 Valida que el valor recibido sea un string.
    // 🔹 Si bien en cierto, en el transformador analizamos si el datos es string, aqui lo volvamos a revisar a propósito
    // 🔹 Aquí se decide si es válido o no
    @IsString({message: 'El correo debe ser una cadena de texto.'})
    // 🔹 Asegura que el formato sea un correo válido.
    @IsEmail({}, {message : 'El correo electrónico no es válido.'})
    email : string;

    @Transform(({value}) => 
        typeof value === 'string' // Evaluamos que el dato enviado sea un string
        ? value.trim() // Si es verdader eliminamos los espacios al inicio y final
        : value)     // si es falso enviamos al validator-class el dato recibido tal cual llegó  
    // 🔒 Campo que representa la contraseña del usuario.
    // 🔹 Asegura que el campo esté presente y no sea cadena vacía.
    @IsNotEmpty({message: 'La contraseña es obligatoria'})
    // 🔹 Debe ser texto (no un número, ni booleano).
    @IsString({message: 'La contraseña debe ser una cadena de texto.'})
    // 🔹 Asegura una longitud mínima de seguridad.
    @MinLength(8, {message: 'La contaseña debe tener al menos 8 caracteres.'})
    // 🔹 Evita contraseñas largas
    @MaxLength(20, {message: 'La contraseña no debe superar los 20 caracteres'})
    password : string;
}
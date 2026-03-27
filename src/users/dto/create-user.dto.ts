// ✅ import: Traemos el decorador Transform desde class-transformer.
// Transform nos permite "normalizar" valores (trim, lowerCase, etc) ANTES de validar.
import { Transform } from "class-transformer";

// ✅ import: Traemos validadores de class-validator
// - IsEmail: valida el formato de email.
// - IsString: valida que el valor final sea string.
// - IsUUID: valida que siga el formato UUID (v1, v2, etc).
// - MaxLength / MinLength: longitudes mínimas y máximas.
// - IsNotEmpty: exige que el campo no venga vacío
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, MaxLength, MinLength, ValidateIf } from "class-validator";

// 🧩 Definimos el Data Transfer Object (DTO) para crear usuarios.
// ✅ DTO significa Data Transder Object
// ✅ Esta clase representa la estructura que esperamos recibir desde el cliente cuando quiere crear un usuario
// ✅ Nest aplicará primero class-transformer (Transform) y luego class-validator (decoradores de validación)
export class CreateUserDto{

    // 📌 📧 Email
    // Normaliza el valor ANTES de validar, value es el valor que el usuario envió en el campo "email":
    // - value?.trim(): elimina espacios al inicio/fin (si value existe).
    // - toLowerCase(): fuerza minúsculas para consistencia (clave si harás email único).
    @Transform(({value}) => 
        typeof value === 'string'  // verifica el tipo de dato, protege contra null, undefined, números, booleanos, objetos
            ? value.trim().toLowerCase() // Si es true , es decir, si es un string, lo convertimos a minúsculas y quitamos los espacios
            : value)  // Si es false, es porque NO es texto, entonces devuelve el valor sin modificarlo, no lo transforma, no lo toca
    // Asegura que el campo esté presente y no sea cadena vacía.
    @IsNotEmpty({message: 'El email es obligatorio'})
    // Valida que 'email' tenga formato de correo. El objeto {} son opciones (aquí vacías).
    // 'message' se mostrará si el formato no es válido.
    // require_tld: true -> Exigimos .com/.pe
    @IsEmail({require_tld: true}, {message: 'El email no tiene un formato válido'})
    @IsString({message : 'El email debe ser un texto'})
    // Limita la longitud máxima del email a 150 caracteres.
    // Útil para evitar entradas exageradas y proteger la base de datos/índices.
    @MaxLength(150, {message: 'El email no puede superar 150 caracteres'})
    // Tipo esperado: string. Si llega otro tipo, IsEmail/IsString fallarán.
    email : string;
    


    // 📌 👤 First Name (nombres)
    // Normalizamos quitando espacios sobrantes alrededor.
    @Transform(({value}) => 
        typeof value === 'string' 
            ? value?.trim()
            : value)
    // Exigimos presencia y que no sea cadena vacía
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    // Exigimos que sea string. Si llega número/objeto/array, fallará.
    @IsString({message: 'El nombre debe ser un texto'})
    // Mínimo 1 caracter. Combinado con el trim de abajo, evita cadenas vacías o solo espacios.
    @MinLength(1, {message: 'El nombre debe tener al menos 1 caracter'})
    // Máximo 120 caracteres para mantener datos razonables.
    @MaxLength(80, {message: 'El nombre no puede superar 80 caracteres'})
    // Tipo esperado
    firstName : string;

    //📌  👤 Last Name (apellidos)
    // 🔄 Normalizamos quitando espacios sobrantes
    @Transform(( {value} ) =>
        typeof value === 'string'
            ? value?.trim()
            : value)
    // ✅ Obligatorio
    @IsNotEmpty({message : 'El apellido es obligatorio'})
    // ✅ Texto
    @IsString({message : 'El apellido debe ser un texto'})
    // ✅ Mínimo un caracter
    @MinLength(1 , {message : 'El apellido debe tener al menos 1 caracter'})
    // ✅ Máximo 80 caracteres, debe respetar la Entity
    @MaxLength(80, {message: 'El apellido no puede superar 80 caracteres'})
    lastName : string


    
    // 📌 🔐 password -> Este campo recibirá la contraseña en texto plano (no el hash)
    // El hash se generará dentro del servicio usando bcrypt.
    // Asegura presencia (si viene '', null o undefined, falla)
    @IsNotEmpty({message: 'La contraseña es obligatoria'})
    // Debe ser un string
    @IsString({message: 'La contraseña debe ser un texto'})
    // Requiere al menos 8 caracteres (buen estándar de seguridad)
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    // Límite razonable (para provenir payloads enormes)
    @MaxLength(20, {message: 'La contraseña no debe superar los 20 caracteres'})
    // Tipo esperado: string.
    password: string;

    // ✅ Indica que este campo es opcional: si no viene, NO valida el resto de decoradores
    @IsOptional()
    // 📌 📱 Phone (opcional)
    @Transform(({value}) => 
        typeof value === 'string' 
            ? value.trim()
            : value)
    // ✅ Texto
    @IsString({ message : 'El teléfono debe ser un texto' })
    // ✅ Respeta el entity : phone varchar(20)
    @MaxLength(20, {message : 'El teléfono no puede superar 20 caracteres'})
    phone ?: string;


    // 📌 🖼️ Avatar URL (opcional)
    // ✅ Opcional
    @IsOptional()
    // 🔄 Normalizamos 
    @Transform(({value }) => 
        typeof value === 'string'
            ? value.trim()
            : value)
    // ✅ Texto
    @IsString({message : 'La URL del avatar debe ser texto'})
    // ✅ Validamos el formato URL
    @IsUrl({} , {message : 'avatarUrl debe ser una URL válida'})
    // ✅ Respeta la entity, avatarUrl varchar 255
    @MaxLength(255, {message : 'La URL del avatar no puede superar 255 caracteres'})
    avatarUrl?: string; // 🖼️ Url opcional del avatar


    // ✅ roleId también es opcional
    // ✅ Si no viene, no se validan los decoradores de abajo
    @IsOptional()
    // Valida que sea un UUID versión 4. Cambia '4' si usas otra versión.
    @IsUUID('4', {message: 'roleId debe ser un UUID v4 válido'})
    roleId? : string;


 


}
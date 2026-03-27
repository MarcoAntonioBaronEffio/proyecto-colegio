// 🧠 Un DTO (Data Transfer Object) sirve para VALIDAR y TRANSFERIR datos desde el cliente
// hacia el servidor antes de guardarlos en la base de datos.

// 📦 Importamos decoradores del paquete 'class-validator'
// ⚙️ Estos decoradores nos ayudan a validar automáticamente las propiedades del DTO.
import { 
    IsInt,       // 🔢 Valida que el campo sea un número entero (integer)
    IsOptional,  // 🟡 Indica que un campo es opcional (no es obligatorio en la solicitud)
    IsDateString // 📆 Valida que el valor tenga formato de fecha válido (YYYY-MM-DD)
 } from "class-validator";

// 🎓 Creamos la clase CreateSchoolYearDto
// 📋 Esta clase define la estructura y las reglas de validación que deben cumplirse al crear un nuevo año escolar.
export class CreateSchoolYearDto{

// 🧩 Campo: year (año escolar)
// 🔹 @IsInt -> se asegura de que el valor sea un número entero.
// 🔹 Si el valor no es entero, muestra el mensaje personalizado
@IsInt({message : 'El año debe ser entero. Ej: 2025'})
year : number; // 📘 Ejemplo válido; 2025
// 💡 Este campo es obligatorio porque no tiene @IsOptional.
// 💬 Es fundamental para identificar cada ciclo escolar (2024 , 2025, etc.)

// 🧩 Campo: startsOn (fecha de inicio)
// 🟡 @IsOptional -> el campo no es obligatorio. Si no se envía, no se valida
@IsOptional()
// 📆 @IsDateString -> valida que la fecha tenga formato correcto "YYYY-MM-DD"
// 🗓️ Si el formato es incorrecto (por ejemplo "2025/03/01" o "03-01-2025"), lanza el
// mensaje definido abajo.
@IsDateString({}, {message: 'startsOn debe ser YYYY-MM-DD'})
startsOn? : string; // ❓ El signo "?" indica que es opcional
// 📘 Ejemplo válido: "2025-03-01"
// 💡 Este campo sirve para registrar la fecha de inicio oficial del año escolar.

// 🧩 Campo: endsOn (fecha de fin)
// 🟡 Igual que el anterior, es opcional.
@IsOptional()
// 📆 Valida que sea una fecha válida y con formato estándar ISO.
@IsDateString({}, {message: 'endsOn debe ser YYYY-MM-DD'})
endsOn? : string;
// 📘 Ejemplo válido: "2025-12-15"
// 💡 Este campo indica cuándo finaliza el ciclo anterior.
}
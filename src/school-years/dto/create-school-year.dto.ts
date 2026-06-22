// 🧠 Un DTO (Data Transfer Object) sirve para VALIDAR y TRANSFERIR datos desde el cliente
// hacia el servidor antes de guardarlos en la base de datos.

// 📦 Importamos decoradores del paquete 'class-validator'
// ⚙️ Estos decoradores nos ayudan a validar automáticamente las propiedades del DTO.
import { 
    IsInt,       // 🔢 Valida que el campo sea un número entero (integer)
    IsOptional,  // 🟡 Indica que un campo es opcional (no es obligatorio en la solicitud)
    IsDateString, // 📆 Valida que el valor tenga formato de fecha válido (YYYY-MM-DD)
    Min,
    Max,
    IsNotEmpty
 } from "class-validator";

// 🎓 Creamos la clase CreateSchoolYearDto
// 📋 Esta clase define la estructura y las reglas de validación que deben cumplirse al crear un nuevo año escolar.
export class CreateSchoolYearDto{

// 🎓 AÑO ESCOLAR
// 🧩 Campo: year (año escolar)
@IsNotEmpty({message: 'El año escolar es obligatorio'})
// 🔹 @IsInt -> valida que el valor sea un número entero
// 🔹 Si se envía un decimal o un valor no entero, la validación fallará
@IsInt({message : 'El año debe ser entero. Ej: 2026'})
// 🔹 @Min -> establece el valor mínimo permitido.
// 👉 Evita registrar años demasiado antiguos o inválidos
@Min(2000, {message: 'El año no puede ser menor a 2000'})
// 🔹 @Max -> establece el valor máximo permitido
// 👉 Evita registrar años excesivamente lejanos
@Max(2100, {message: 'El año no puede ser mayor a 2100'})
year! : number; // 📘 Ejemplo válido: 2026, 2027
// 💡 Este campo es obligatorio porque no tiene @IsOptional.
// 💡 Permite identificar de forma única cada ciclo escolar




// 📆 FECHA DE INICIO
// 🧩 Campo: startsOn (fecha de inicio)
// 👉 Representa la fecha oficial de inicio del año escolar

// 🟡 @IsOptional 
// 👉 Indica que el campo no es obligatorio
// 👉 Si no se envía, las demás validaciones serán ignoradas
@IsOptional()
// 📆 @IsDateString -> 
// 👉 Valida que la fecha tenga formato ISO válido
// 👉 El formato esperado es:  "YYYY-MM-DD"
// 🗓️ Si el formato es incorrecto (por ejemplo "2025/03/01" o "03-01-2025"), lanza el
// mensaje definido abajo.
@IsDateString({}, {message: 'La fecha de inicio de año debe tener este formato: YYYY-MM-DD'})
startsOn? : string; // ❓ El signo "?" indica que es opcional
// 📘 Ejemplo válido: "2025-03-01"
// 💡 Este campo sirve para registrar la fecha de inicio oficial del año escolar.

// 🧩 Campo: endsOn (fecha de fin)
// 🟡 Igual que el anterior, es opcional.
@IsOptional()
// 📆 Valida que sea una fecha válida y con formato estándar ISO.
@IsDateString({}, {message: 'La fecha de fin de año debe tener este formato: YYYY-MM-DD'})
endsOn? : string;
// 📘 Ejemplo válido: "2025-12-15"
// 💡 Este campo indica cuándo finaliza el año escolar
}
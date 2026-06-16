// ✨ Importamos utilidades de transformación
// 🔁 Su objetivo es transformar los datos del body (JSON crudo del cliente) a un objeto del tipo DTO
// 💡 Muy útil cuando el cliente envía valores como strings y queremos convertirlos a número, limpiar espacios, etc.
import {
     Transform, // 🧼 Permite interceptar y modificar el valor antes de asignarlo al DTO (ej: trim(), toUpperCase(), etc)
     Type // 🔄 Convierte automáticamente tipos primitivos, por ejemplo "3" (string) -> 3 (number)
} from "class-transformer"; // ⚙️ Se integra perfectamente en class-validator dentro de los DTOs


// ✅ Importamos validadores para cada propiedad
// 📦 Estos decoradores provienen de la librería "class-validator"
// 🧠 Sirven para definir reglas de validación sobre las propiedades del DTO (ej: tipo, longitud, formato, etc)
import { 
    IsNotEmpty, // 🚫 Asegura que el valor NO esté vacío (ni null, ni undefined, ni "")
    IsUUID,     // 🆔 Valida que el valor tenga formato UUID (como "550e8400-e29b-41d4-a716-446655440000" )
    IsInt, // 🔢 Exige que sea un número entero ( sin decimales )
    Min ,  // ⬆️ Define un valor mínimo permitido (ej: 0) 
    IsOptional, // 🧩 Indica que la propiedad no es obligatoria (no lanza error si falta)
    IsString,   // 🔤 Exige que el valor sea una cadena de texto
    Length,
    MaxLength,
    IsEnum, // 📏 Controla la longitud mínima y máxima de un string (ej: 1, 5)
} from "class-validator"; // 🛡️ Reglas de validación que garantizan la integridad de los datos
import { SectionShift } from "src/entities/section.entity";


// 📦 DTO para crear una sección
export class CreateSectionDto{


    // 🏷️ Nombre de la sección
    @Transform(({ value }) =>
    // 🔹 typeof es un operador de Javascript / Typescript
    // 👉 Permite verificar el tipo de dato. Ejemplo: typeof "hola" -> "string" | typeof 123 -> "number"
    // ⭐️ Sin typeof -> se rompe , Con typeof : se valida
    // ✅ Verificamos que realmente sea texto
    // 👉 Esto evita errores si llegan: null, undefined, números, booleanos u otros
    typeof value === 'string'  
        ? value.trim().toUpperCase()  // ✅ Si es true , es decir, si es un string, quitamos los espacios y lo convertimos a mayúsculas 
        : value)                      // ❌ Si es false, es porque NO es texto, entonces devuelve el valor sin modificarlo, no lo transforma, no lo toca
    // Si el cliente manda "null", typeof null === 'string -> ❌ false -> retorna null, luego entra en el validador @IsNotEmpty ❌ , @IsEmail ❌, El request 
    // se bloquea automáticamente con 400 Bad Request , ✅ Error controlado (no error de servidor)
    @IsString() // ✅ Debe ser texto
    @IsNotEmpty() // ✅ No puede venir vacío
    @MaxLength(20) // ✅ Máximo 20 caracteres (suficiente para A, B, C)
    name!: string;

    // 🕓 Turno: MORNING / AFTERNOON
    @IsEnum(SectionShift,{message: 'El turno debe ser MAÑANA o TARDE'}) // ✅ Solo acepta valores del enum Shift    
    @IsNotEmpty() // ✅ No puede venir vacío
    shift!: SectionShift;

    // 🆔 ID del grado al que pertenece esta sección (FK)
    @IsUUID() // ✅ Debe ser un UUID válido
    @IsNotEmpty() // ✅ No puede venir vacío
    gradeId!: string;

    // 🆔 ID del aula asignada a la sección
    @IsUUID() // ✅ Debe ser UUID válido
    @IsNotEmpty() // ✅ No puede venir vacío
    classroomId!: string;

 
}
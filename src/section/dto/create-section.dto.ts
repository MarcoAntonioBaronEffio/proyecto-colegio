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
import { Shift } from "src/entities/section.entity";


// 📦 DTO para crear una sección
export class CreateSectionDto{

    // 🏷️ Nombre de la sección: "A", "B", "C"...
    @IsString() // ✅ Debe ser texto
    @IsNotEmpty() // ✅ No puede venir vacío
    @MaxLength(20) // ✅ Máximo 20 caracteres (suficiente para A, B, C)
    name: string;

    // 🕓 Turno: MORNING / AFTERNOON
    @IsEnum(Shift) // ✅ Solo acepta valores del enum Shift
    @IsNotEmpty() // ✅ No puede venir vacío
    shift: Shift;

    // 🆔 ID del grado al que pertenece esta sección (FK)
    @IsUUID() // ✅ Debe ser un UUID válido
    @IsNotEmpty() // ✅ No puede venir vacío
    gradeId: string;




}
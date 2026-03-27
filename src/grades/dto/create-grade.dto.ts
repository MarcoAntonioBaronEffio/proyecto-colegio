// 📁 src/grades/dto/create-grade.dto.ts -> Ruta del archivo: DTO para crear un "Grade" (grado). este archivo define y valida lo que
//el backend acepta a crear un grado.

// 📦 Importamos validadores de class-validator
import { 
    IsEnum,     IsInt,     // 🔹 IsEmun  -> valida que el valor pertenezca a un enum.
    IsNotEmpty, IsOptional, // 🔹 No permite valores vacíos ('' o null/undefined)
    IsString,   // 🔹 Obliga a que el valor sea string
    IsUUID,     // 🔹 Valida formato UUID v4
    Length,      Max,      // 🔹 Longitud mínima y máxima de un string
    Min
} from "class-validator";

// 🧠 Importamos Transform para modificar valores entrantes antes de validar
// 🧪 Transform -> nos permite "preprocesar" el valor (trim, upper) ANTES de correr los validadores. Ideal para normalizar entradas
import { Transform, Type } from "class-transformer";

// 🎓 Importamos el enum con los niveles de grado
// 📚 GradeLevel -> {INICIAL, PRIMARIA, SECUNDARIA} . Usado por IsEnum para restringir el campo level
import { GradeLevel } from "src/entities/grade.entity";

// 🧱 DTO (Data Transfer Object) que define qué datos se pueden recibir al crear un grado
// 🏗️ Esta clase modela y valida el payload del POST / grades. Solo lo pertimido aquí pasará al servicio.
export class CreateGradeDto{

    // 🏷️ Nivel educativo (PRIMARIA o SECUNDARIA)
    // 🔁 Normaliza el input: lo fuerza a string, recorta espacios y lo pone en MAYÚSCULAS (ej: inicial -> INICIAL)
    // 📝 OJO: Esto hace match con tu diseño: correos en minúsculas, niveles en MAYÚSCULAS para consistencia
    @Transform(({value}) => value?.toString().trim().toUpperCase())
    // ✅ Valida que el valor esté exactamente dentro del enum GradeLevel. Si no, lanza el mensaje personalizado
    @IsEnum(GradeLevel, {message: 'El nivel debe ser PRIMARIA o SECUNDARIA.'})
    // 🛡️ Evita valores vacíos (null/undefined/'') para level
    @IsNotEmpty({message: 'El campo nivel es obligatorio.'})
    // 🧩 Tipo de campo en runtime/TypeScript
    level : GradeLevel;

    @Type(() => Number)
    @IsInt({message : 'El número del grado debe ser un entero.'})
    @Min(1, {message : 'El número del grado debe ser mínimo 1.'})
    @Max(6, {message : 'El número de grado no puede ser mayor a 6'})
    @IsNotEmpty({message : 'El número de grado es obligatorio.'})
    gradeNumber : number; 
 
}

// ⭐️ Dato importante: Los campos transformados y validados (name: string, level: GradeLevel, etc). Se
// guardan temporalmente en memoria dentro de DTO mientras se ejecuta el request.
// Luego, si tú lo usas en el servicio con .save(), esos mismos valores ya procesados son los que 
// terminan guardados en la base de datos.
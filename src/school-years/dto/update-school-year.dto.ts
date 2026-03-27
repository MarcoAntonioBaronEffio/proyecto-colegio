import { PartialType } from "@nestjs/mapped-types";
import { CreateSchoolYearDto } from "./create-school-year.dto";

// 🏗️ Declaramos el DTO para actualizar un año escolar
// ✅ Usamos "extends" para heredar la estructura del DTO de creación
// ✅ Pero gracias a PartialType(...) todas las propiedades heredadas se convertirán automáticamente en opciones

export class UpdateSchoolYearDto extends PartialType(CreateSchoolYearDto){

}


// 🔹 La clase base tiene esto:
// - year: number -> obligatorio
// - startsOn?: string -> opcional
// - endsOn?: string -> opcional

// 🔹 entonces, cuando hacemos esto: export class UpdateSchoolYearDto extends PartialType(CreateSchoolYearDto){

// Nest genera conceptualmente algo parecido a esto

/**
 export class UpdateSchoolYearDto{}
    year? : number;
    startsOn?: string;
    endsOn?: string; 
    }
 */

// O sea:
// 🔹 year deja de ser obligatorio un update ✅
// 🔹 startsOn sigue siendo opcional ✅
// 🔹 endsOn sigue siendo opcional ✅

// 🔹 Lo importante es esto: Aunque year en CreateSchoolYearDto tenga @IsInt(), en el UpdateSchoolYearDto seguirá
//   validándose como entero solo si viene enviado. Si no lo envias, no pasa nada, porque PartialType lo vuelve opcional
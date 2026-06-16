// 🏗️ Declaramos el DTO para actualizar un grado
// ✅ Usamos "extends" para heredar la estructura del DTO de creación

import { PartialType } from "@nestjs/mapped-types";
import { CreateGradeDto } from "./create-grade.dto";

// ✅ Pero gracias a PartialType(...) todas la propiedades heradadas se convertirán automáticamente en opciones
export class UpdateGradeDto extends PartialType(CreateGradeDto){}
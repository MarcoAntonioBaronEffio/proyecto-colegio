// 🏗️ Declaramos el DTO para actualizar una sección
// 👉 Este DTO se usará cuando queramos EDITAR un aula existente (PATCH)

// 📦 Importamos PartialType desde NestJs
// 👉 Esta utilidad convierte TODOS los campos opcionales 
// 👉 Es clave para actualizaciones (no siempre manda todos los datos)
import { PartialType } from "@nestjs/mapped-types";

// 📦 Importamos el DTO de creación
// 👉 Este DTO tiene TODOS los campos obligatorios para crear un aula
import { CreateClassroomDto } from "./create-classroom.dto";

// 🧾 Definimos el DTO de actualización
// 👉 "UpdateClassroomDto" será usado en el enpoint PATCH
export class UpdateClassroomDto 
    // 🧬 extends (herencia)
    // 👉 Estamos heredando TODO lo que tiene CreateClassroomDto
    // 👉 Pero gracias a PartialType, todos los campos pasan a ser opcionales
    extends PartialType(CreateClassroomDto){}
// 🏗️ Declaramos el DTO para actualizar una sección
// 👉 Este DTO se usará cuando queramos EDITAR una sección existente (PATCH)

// 📦 Importamos PartialType desde NestJs
// 👉 Esta utilidad convierte TODOS los campos en opcionales
// 👉 Es clave para actualizaciones (no siempre manda todos los datos)
import { PartialType } from "@nestjs/mapped-types";

// 📦 Importamos el DTO de creación
// 👉 Este DTO tiene TODOS los campos obligatorios para crear una sección
import { CreateSectionDto } from "./create-section.dto";

// 🧾 Definimos el DTO de actualiación
// 👉 "UpdateSectionDto" será usado en el endpoint PATCH
export class UpdateSectionDto 

    // 🧬 extends (herencia)
    // 👉 Estamos heredando TODO lo que tiene CreateSectionDto
    // 👉 Pero gracias a PartialType, todos los campos pasan a ser opcionales
    extends PartialType(CreateSectionDto){}

// 🧠 Importante
// 👉 Si CreateSectionDto tiene:
//  name: string (obligatorio)
//  shift: Shift (obligatorio)
//
// 👉 Entonces UpdateSectionDto tendrá:
//  name?: string (opcional)
//  shift?: Shift (opcional)
//
// 💡 ¿Por qué esto es importante?
// 👉 Porque al actualizar NO siempre quieres mandar todos los campos
// 👉 Ejemplo:
/*
    PATCH /section/1
    {
        "name" : "B"
    }
*/
// 👉 Aquí solo cambias el nombre, sin tocar el tuno (shift)

// 🚀 Resumen 
// 👉 CreateSectionDto = para CREAR (todo obligatorio)
// 👉 UpdateSectionDto = para ACTUALIZAR (todo opcional)
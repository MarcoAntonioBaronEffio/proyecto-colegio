
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

// 🔹 @Unique sirve par decirle a la base de datos:
//   "Esta columna o esta combinación de columnas no se puede repetir"
// 🔹 Ejemplo simple con una sola columna: @Unique(["email"])
// Eso significa: no puede haber dos registros con el mismo "email"
// ❌ Entonces esto sería inválido:
// usuario1 -> marco@gmail.com | usuario2 -> marco@gmail.com
// ✅ Pero esto si es válido:
// usuario1 -> marco@gmail.com | usuario2 -> antonio@gmail.com
// 🔹 Ejemplo con varias columnas: @Unique(["schoolId", "code"])
// Eso significa: no puede repetirse la combinación de schoolId y code
// ❌ Entonces esto no sería válido:
// schoolId = S1 , code = A101 | schoolId = S1, code = A101
// ✅ Pero esto si es válido, porque ya no es la misma combinación:
// schoolId = S1 , code = A101 | schoolId = S2 , code = A101


// ⭐️ Restricciones únicas compuestas
// No significa:
// - Que code sea único en toda la tabla
// - Ni que name sea único en toda la tabla
// 🔹 Significa que la combinación de columnas debe ser única

// ⭐️ "schoolId", "code", "name" hace referencia a propiedades de la entidad "Classroom"
// ⭐️ "schoolId" hace referencia a la propiedad schoolId : string; de esta entidad
// 🔹 Esa propiedad está mapeada a la columna "school_id" en PostgreSQL

// ⭐️ "code" hace referencia a la propiedad code : string; de esta entidad
// 🔹 Esta propiedad se guarda en la columna "code"

// ⭐️ "name" hace referencia a la propiedad name : string; de esta entidad
// 🔹 Esta propiedad se guarda en la columna "name"

// ⭐️ TypeORM toma las nombres que están en el arreglo como propiedades de la clase en TypeScript, o sea de la entidad

// 🧷 Evitamos que el código del aula se repita en toda la tabla
@Unique("UQ_classrooms_school_code", ["code"])

// 🧷 Evitamos que el nombre del aula se repita en toda la tabla
@Unique("UQ_classrooms_school_name", ["name"])

// 🗄️ Nombre real de la tabla en PostgreSQL
@Entity({name: "classrooms"})
export class Classroom{

    // 🆔 Clave primaria UUID autogenerada
    @PrimaryGeneratedColumn("uuid")
    id : string;

    // 🏷️ Nombre visible del aula física
    // ✅ Ejemplo: "Aula 101", "Aula 102", "Laboratorio 1"
    @Column({type: "varchar", length: 100})
    name : string;

    // 🔠 Código interno del aula
    // ✅ Ejemplo: "A101", "A102", "LAB01"
    @Column({type:"varchar", length: 30})
    code : string;

    // 👥 Capacidad máxima de estudiantes que soporta el aula
    // ✅ Ejemplo: 25, 30, 40
    @Column({type: "int"})
    capacity: number;

    // 🏢 Piso donde se encuentra el aula
    // ✅ Ejemplo: 1, 2, 3
    @Column({type: "int"})
    floor: number;

    // ✅ Estado lógico del aula
    // 👉 Estado lógico del aula: activa o inactiva
    @Column({name : "is_active", type: "boolean", default: true})
    isActive: boolean;
 
    // ===========================
    // 🕒 Auditoría
    // ===========================

    // 📅 Fecha y hora exacta de creación del registro
    @CreateDateColumn({name : "created_at", type: "timestamptz"})
    createdAt: Date;

    // 🔄 Fecha y hora exacta de la última actualización
    @UpdateDateColumn({name : "updated_at", type: "timestamptz"})
    updatedAt : Date;


}
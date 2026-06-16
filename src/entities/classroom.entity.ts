
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Section } from "./section.entity";

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

// 🎯 Enum que define los posibles estados de un aula
// 👉 Sirve para controlar si el aula está disponible o no dentro del sistema
export enum ClassroomStatus{

    // 🟢 Aula activa
    // 👉 Se puede usar normalmente (asignar clases, horarios, etc)
    ACTIVE = "ACTIVE",
    
    // 🔴 Aula inactiva
    // 👉 No se usa actualmente (por mantenimiento, deshabilitada, etc.)
    INACTIVE = "INACTIVE"
}

// 🏷️ Tipos de ambientes educativos
export enum ClassroomType{
    // 🏫 Aula tradicional
    // 👉 Aula común donde se dictan clases normales
    // 👉 Ejemplo: Aula 101
    CLASSROOM = "CLASSROOM",

    // 🧪 Laboratorio
    // 👉 Espacio especializado para prácticas
    // 👉 Ejemplo: laboratorio de química o computación
    LABORATORY = "LABORATORY",

    // 🎨 Taller
    // 👉 Ambiente práctico o artístico
    // 👉 Ejemplo: taller de violín, pintura, música
    WORKSHOP = "WORKSHOP",

    // 📚 Biblioteca
    // 👉 Espacio destinado a lectura y estudio
    LIBRARY = "LIBRARY",

    // 🎤 Auditorio
    // 👉 Ambiente amplio para eventos o exposiciones
    AUDITORIUM = "AUDITORIUM"
}
 
 
// 🗄️ @Entity
// 👉 Decorator de TypeORM que indica que esta clase representa una tabla en la base de datos
// 👉 {name: "classrooms"} define el nombre REAL de la tabla en PostgreSQL
@Entity({name: "classrooms"})
export class Classroom{


    // 🆔 @PrimaryGeneratedColumn("uuid")
    // 👉 Define la clave primaria de la tabla
    // 👉 "uuid" genera un identificador único automáticamente
    // 👉 Ejemplo: "a3f1c8d2-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    @PrimaryGeneratedColumn("uuid")
    id! : string;

    // 🏷️ @Column
    // 👉 Define una columna en la base de datos
    // 👉 type: "varchar" = texto
    // 👉 length: 100 = máximo 100 caracteres
    // 👉 Este campo es el nombre visible para el usuario
    // 👉 Ejemplo: "Aula 101"
    @Column({type: "varchar", length: 100})
    name! : string;

    // 🔢 Código interno del aula
    // 👉 Es el identificador técnico del aula
    // 👉 Ejemplo: "A101", "LAB01"
    // 👉 unique: true significa:
    // 🚫 NO se puede repetir en toda la tabla
    // 👉 La base de datos lanza error si intentas duplicar
    @Column({type:"varchar", length: 30, unique: true})
    code! : string;

    // 📝 Descripción del aula (opcional)
    // 👉 type: "varchar" = texto
    // 👉 length: 255 = máximo 255 caracteres
    // 👉 nullable: true significa:
    // 👉 Este campo puede ser null (no obligatorio)
    // 👉 Ejemplo: "Ubicado en el primer piso"
    @Column({type:"varchar", length: 255, nullable: true})
    description?: string;

    // 👥 Capacidad máxima del aula
    // 👉 type: "int" = número entero
    // 👉 unsigned: true significa:
    // 🚫 No permite números negativos
    // 👉 Ejemplo: 30 estudiantes
    @Column({type: "int", unsigned: true})
    capacity! : number;

    // 🏢 Piso donde se encuentra el aula
    // 👉 type: "int" = número entero
    // 👉 unsigned: true -> no negativos
    // 👉 Ejemplo: 1 (primer piso), 2 (segundo piso)
    @Column({type: "int", unsigned: true})
    floor! : number;

    // ⚙️ Estado del aula
    // 👉 type: "enum" indica que usa un enum
    // 👉 enum: ClassroomStatus enlaza con el enum definido arriba
    // 👉 default: Classroom.ACTIVE
    // 👉 Si no envías valor, se guarda como ACTIVE automáticamente
    @Column({
        type: "enum",
        enum: ClassroomStatus,
        default: ClassroomStatus.ACTIVE
    })
    status! : ClassroomStatus;

    // 🔗 Relación con secciones (uno a muchos)
    // 👉 Un aula puede tener MUCHAS secciones
    // 👉 Ejemolo:
    // 🔹 Aula A101 -> puede tener clases (matemáticas, historia)
    // 👉 () => Section indica la entidad relacionada
    // 👉 (section) => section.classroom indica la propiedad inversa en Section
    @OneToMany(() => Section, (section) => section.classroom)
    sections!: Section[];
 
    // ===========================
    // 🕒 Auditoría
    // ===========================

    // 📅 Fecha de creación
    // 👉 @CreateDateColumn se llena automáticamente al insertar
    // 👉 name : "created_at" -> nombre de la columna en la BD
    // 👉 type : "timestamptz" -> fecha con zona horaria
    // 👉 Ejemplo: 2026-05-04 10:30:00-05
    @CreateDateColumn({name : "created_at", type: "timestamptz"})
    createdAt!: Date;

    // 🔄 Fecha de actualización
    // 👉 @UpdateDateColumn se actualiza automáticamente en cada update
    // 👉 Permite saber cómo fue la última modificación
    @UpdateDateColumn({name : "updated_at", type: "timestamptz"})
    updatedAt! : Date;


}
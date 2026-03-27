// 🧱 Esta clase mapea una tabla de base de datos y sus columnas

// Posibles atributos: id, name (A, B, C), gradeId (FK al grado),capacity (capacidad ej: 30) , shift (turno ej: mañana, tarde)
//                     classroom (aula : ejemplo Aula 101 , LAB-02) , isActive 

/*
Tabla futura
classrooms
- id
- name
- capacity
- location (opcional)
- isActive
*/
import { 
    Entity,  // 🏷️ Marca la clase como una entidad (tabla).
    PrimaryGeneratedColumn,  // 🔑 Define la PK autogenerada (uuid en este caso).
    Column,  // 🧱 Define una columna normal.
    Unique,  // 🚫 ✅ Restringe duplicados a nivel de tabla.
    CreateDateColumn, // ⏱️ Timestamp automático al crear el registro.
    UpdateDateColumn,  // 🔁 Timestamp automático al actualizar el registro.
    OneToMany, // 🔗 Define una relación 1:N entre 2 entidades.
    ManyToOne,
    JoinColumn
              // 📘 Ejemplo: un ShoolYear tiene muchos Grade
              // 👉🏼 Se usa junto con @ManyToOne en la entidad relacionada.
} from "typeorm";

import { Grade } from "./grade.entity";
import { School } from "./school.entity";
import { SchoolYearStatus } from "src/school-years/school-year-status.enum";

// 🧾 @Entity('school_years'):
// - 🧰 Le dice a TypeOrm que esta clase es una tabla.
// - 🏷️ Nombre físico de la tabla en BD: 'school_years' 
@Entity('school_years')
// 🚫 Unique(['year]):
// - 🔐 Crea una restricción única para que no existan dos filas con el mismo 'year'.
// - 🗓️ Evita, por ejemplo, tener dos "2025" en la tabla.
@Unique(['school', 'year']) // Evita publicados del mismo año (ej: 2025)
export class SchoolYear{

    // 🔑 PrimaryGeneratedColumn('uuid'):
    // - 🧬 Genera un UUID como clave primaria (ej: '3f6a2c...').
    // - 🛡️ Evita colisiones y es seguro para exposición en APIs.
    @PrimaryGeneratedColumn('uuid')
    id : string;

    // 🗓️ @Column({type: 'int'})
    // - Guarda el año numérico del ciclo (ej: 2025).
    // 👍 Int es suficiente y permite ordenar/filtrar fácilmente.
    @Column({type : 'int'})
    year : number;

    // 🚀 @Column ({type: 'date', nullable: true})
    // - 'startOn' es la fecha de inicio del año escolar.
    // - ✅ 'nullable:true' permite crear el registro sin conocer aún la fecha exacta.
    // - 📌 Útil cuando defines el ciclo por anticipado (planificación) y luego lo completas.
    // - 🗄️ En Posgres se almacena como DATE (YYYY-MM-DD).
    @Column({type : 'date', nullable : true})
    startsOn? : string;

    // 🏁 @Column ({type: 'date, nullable: true})
    // - 'endsOn' es la fecha de fin del año escolar.
    // - ✅ También opcional por la misma razón (puedes cerrar más adelante).
    // - 🔍 Reglas de negocio sugeridas (en servicio o validador):
    //   - Si ambas existen: startOn <= endsOn ✔️
    //   - No permitir solapes entre años activos ❌
    @Column({type : 'date', nullable : true})
    endsOn? : string;

    // 🏷️ @Colum tipo enum
    // 🧠 Solo puede existir un estado válido
    @Column({
        type: 'enum',
        enum: SchoolYearStatus,
        default: SchoolYearStatus.PLANNED,
    })
    status: SchoolYearStatus;

    // 🕒 @CreateDateColumn():
    // - Se llama automáticamente en INSERT.
    // - 🧾 Útil para auditoria (cuándo se creó el año escolar).
    @CreateDateColumn()
    createdAt: Date;

    // 🔁 @UpdateDataColumn():
    // - Se actualiza automáticamente en cada UPDATE.
    // - 🧾 Útil para saber la última modificación.
    @UpdateDateColumn()
    updatedAt: Date;

    // 🔗 Relación 1:N entre SchoolYear -> Grade
    // - Un año escolar puede tener MUCHOS grados.
    // - Este lado es el "lado inverso" (No dueño de la FK). 🔁
    // - El dueño real es el ManyToOne dentro de Grade con @JoinColumn('school_year_id). 
    @OneToMany(
        // 🏭 1️⃣ Le decimos a TypeORM con qué entidad nos vamos a relacionar.
        // Usamos la función flecha (() => Grade) en lugar de poner directamente "Grade" porque
        // TypeORM la ejecuta más tarde, evitando errores de importaciones circulares ♻️.
        // En pocas palabras: "Esta entidad (ShoolYear) se relaciona con la entidad Grade"
        () => Grade, 
        // 🪞 2️⃣ Aquí le explicamos a TypeORM cuál es la propiedad dentro de la entidad Grade que hace 
        // referencia a SchoolYear.
        // En la clase Grade existe una propiedad llamada "shoolYear", y con esta línea le decimos:
        // "usa esa propiedad para conectar ambos lados".
        // Así, SchoolYear sabrá qué grados le pertecenen 🔗.
        (grade) => grade.schoolYear,{
         // ⚙️ 3️⃣ Configuración adicional de la relación (opcional pero importante).
        
        // 🚫 Significa que las operaciones NO se propagan en "cascada".
        // 👉🏼 Ejemplo: si guardas o eliminas un ShoolYear, TypeORM NO va a crear ni borrar automáticamente sus Grade.
        // 🎯 Esto te da más control: puedes decidir manualmente cuándo y cómo se crean o eliminan los grados.
        // 💬 En otras palabras: "No toques mis grados sin que yo te lo diga." 😎
        //
        // Si pusieras cascade: true ➡️
        // - Al guardar un SchoolYear con una lista grande dentro, se craarían automáticamente esos Grade.
        // - Al eliminar un SchoolYear, se eliminarían también todos los Grade asociados.
        //
        // ⚠️ En el sistema escolar, es mejor mantener cascade: false, porque no queremos borrar todos los grados
        // accidentalmente al eliminar un año escolar.
        // Es preferible hacerlo manualmente desde el servicio, con las validaciones.
        cascade : false, 
        // 🐢 Esto indica que los grados NO se cargan automáticamente al traer SchoolYear.
        // Si los necesitas, deberás pedirlos explicitamente con:
        // repo.find({relations:['grades']}) o usando un QueryBuilder con .leftJoinAndSelect().
        // ✅ Esto evita traer listas grandes de grados sin querer.
        eager: false,
    })
    grades: Grade[];
    // 📋 Lista de grados que pertenecen a este año escolar (1:N)
    // Cada SchoolYear puede tener muchos Grade, pero cada Grade pertenece solo a un ShoolYear.

    @ManyToOne(
        () => School, // 🏫 Entidad padre
        (school) => school.schoolYears, // 🔙 Propiedad inversa en School (school.schoolYears)
        {onDelete : 'RESTRICT'}, // 🧨 Si borras el colegio, se borran sus años (opcional)
    )
    @JoinColumn({name : 'school_id'}) // 🧷 Esta relación usa la columna school_id como FK
    school : School; // ✅ Esta es la propiedad que te falta (la que te pide schoolYear.school)

}
 
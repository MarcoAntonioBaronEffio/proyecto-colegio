// 🧱 Esta clase mapea una tabla de base de datos y sus columnas

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

export enum SchoolYearStatus {

    // 📝 Aún no empieza (planificado)
    PLANNED = 'PLANNED',

    // 🚀 Año escolar en curso
    ACTIVE = 'ACTIVE',

    // 🔒 Año escolar cerrado definitivamente
    CLOSED = 'CLOSED',


}

// 🧾 @Entity('school_years'):
// - 👉 Le dice a TypeOrm que esta clase representa una tabla de la base de datos
// - 👉 El nombre físico de la tabla será: school_years
@Entity('school_years')

// 🔐 @Unique(['year'])
// 🔐 Crea una restricción única para que no existan dos filas con el mismo 'year'.
@Unique(['year']) // Evita que existan dos años escolares con el mismo año
export class SchoolYear{

    // 🔑 IDENTIFICADOR ÚNICO
    // 🔑 PrimaryGeneratedColumn('uuid'):
    // 👉 Genera automáticamente un UUID como clave primaria
    // 👉 UUID = Universally Unique Identifier
    // 🔹 Ejemplo: 550e8400-e29b-41d4-a716-446655440000
    @PrimaryGeneratedColumn('uuid')
    id! : string;


    // 🎓 AÑO ESCOLAR
    // 🗓️ @Column({type: 'int'})
    // 👉 Almacena el año académico, ejemplo: 2026, 2027
    // ✅ Int es suficiente para representar un año.
    // ✅ Permite ordenar y filtrar fácilmente
    @Column({type : 'int'})
    year! : number;


    // 📅 FECHA DE INICIO
    // 🚀 @Column ({type: 'date', nullable: true})
    // 👉 Fecha oficial de inicio del año escolar
    // - ✅ 'nullable:true' -> Permite crear el año escolar sin conocer aún la fecha exacta
    // - 📌 Útil cuando defines el año por anticipado (planificación) y luego lo completas.
    // - 🗄️ En PostgreSQL se almacena como DATE (YYYY-MM-DD).
    @Column({type : 'date', nullable : true})
    startsOn? : string;


    // 📆 FECHA DE FIN
    // 🏁 @Column ({type: 'date, nullable: true})
    // 👉 Fecha oficial de finalización del año escolar
    // 👉 nullable: true -> También puede definirse posteriormente
    // 👉 PostgreSQL lo almacena como DATE
    @Column({type : 'date', nullable : true})
    endsOn? : string;


    // 📌 ESTADO DEL AÑO ESCOLAR
    // 🏷️ @Colum tipo ENUM
    // 👉 Un ENUM permite almacenar únicamente valores previamente definidos
    // 🧠 Solo puede existir un estado válido
    @Column({
        type: 'enum',
        enum: SchoolYearStatus,
        default: SchoolYearStatus.PLANNED,
    })
    status!: SchoolYearStatus;


    // ⏱️ FECHA DE CREACIÓN
    // 🕒 @CreateDateColumn():
    // 👉 Se llama automáticamente al crear el registro
    // ✅ Útil para auditoria, permite saber cuándo fue creado el año escolar
    @CreateDateColumn()
    createdAt!: Date;



    // ⏱️ FECHA DE ACTUALIZACIÓN
    // 🔁 @UpdateDataColumn():
    // 👉 Se actualiza automáticamente cada vez que el registro es modificado
    // ✅ Permite conocer la última modificación
    @UpdateDateColumn()
    updatedAt!: Date;


    
    // 🔗 RELACIÓN 1:N | SCHOOL YEAR -> GRADES
    // 👉 Un año escolar puede tener MUCHOS grados.
    // 🔹 Ejemplo:
    // Año escolar 2026
    //   |-- Primer grado
    //   |-- Segundo grado
    //   |-- Tercer grado
    //   |-- ...
    // 👉 Este es el lado inverso de la relación
    // 👉 El dueño real de la FK está en : Grade.schoolYear 
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
        // - Al guardar un SchoolYear con una lista grande dentro, se crearían automáticamente esos Grade.
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
    grades!: Grade[];
    // 📋 Lista de grados que pertenecen a este año escolar (1:N)
    // Cada SchoolYear puede tener muchos Grade, pero cada Grade pertenece solo a un ShoolYear.



    // 🔗 RELACIÓN N:1 SCHOOL YEAR - SCHOOL
    // 👉 Muchos años escolares pertecenen a un colegio
    // 🔹 Ejemplo:
    // Colegio Javier Heraud
    //   |--- 2025
    //   |--- 2026
    //   |--- 2027
    @ManyToOne(
        () => School, // 🏫 Entidad padre
        (school) => school.schoolYears, // 🔙 Propiedad inversa en School (school.schoolYears)
        {onDelete : 'RESTRICT'}, // 🚫 No puedes eliminar el colegio si tiene años escolares asociados
    )
    @JoinColumn({name : 'school_id'}) // 🧷 Esta relación usa la columna school_id como FK
    school! : School; // 🏫 Colegio propietario del año escolar

}
 
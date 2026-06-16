// 📝 @Entity('enrollments)
// 👉 Indica a TypeORM que esta clase representa una tabla en la base de datos

import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, Unique, UpdateDateColumn } from "typeorm";
import { Student } from "./student.entity";
import { SchoolYear } from "./school-year.entity";
import { Section } from "./section.entity";

// 👉 El nombre físico de la tabla será: enrollments
@Entity('enrollments')

// 🔐 @Unique(['student', 'schoolYear'])
// 👉 Crea una restricción única compuesta
// 👉 Evita que un mismo estudiante pueda matricularse dos veces en el mismo año escolar
// ✅ Permitido: 
// 🔹 Juan + 2025
// 🔹 Juan + 2026
// ❌ No permitido :
// 🔹 Juan + 2025
// 🔹 Juan + 2025
@Unique(['student', 'schoolYear'])
export class Enrollement {

    // 🔑 @PrimaryGeneratedColumn('uuid)
    // 👉 Genera automáticamente un UUID como clave primaria
    // 👉 Cada matrícula tendrá un identificador único
    // 🔹 Ejemplo: "550e8400-e29b-41d4-a716-446655440000"
    @PrimaryGeneratedColumn('uuid')
    id! : string


    // 👨‍🎓 Relación Muchos A Uno con Student
    // 👉 Muchas matrículas pueden pertenecer al mismo estudiante
    // 👉 Un estudiante puede tener una matrícula por cada año escolar
    @ManyToOne(() => Student,{

        // 🚫 nullable: false
        // 👉 La matrícula siempre debe tener un estudiante asociado
        // 👉 No se permite guardar una matrícula sin estudiante
        nullable : false,

        // 🛡️ onDelete: 'RESTRICT'
        // 👉 Impide eliminar un estudiante si existen matrículas relacionadas con él
        // 👉 Primero habría que eliminar las matrículas
        onDelete: 'RESTRICT'
    })
    // 🔗 @JoinColumn
    // 👉 Define la columna FK (Foreign Key) en la tabla enrollments
    // 👉 El nombre físico de la columna será student_id
    @JoinColumn({name: 'student_id'})
    student!: Student;

    // 🆔 @RelationId
    // 👉 Permite obtener directamente el id del estudiante
    // 👉 Evita tener que acceder a : entollment.student.id
    // 👉 Podremos usar: enrollment.studentId
    @RelationId((enrollment : Enrollement) => enrollment.student)
    studentId!: string;



    // ================================================================================================


    // 📚 Relación Muchos a Uno con SchoolYear
    // 👉 Muchas matrículas pueden pertenecer al mismo año escolar
    // 👉 Ejemplo:
    // 🔹 Año 2025
    //    |--- Juan
    //    |--- María
    //    |--- Ana
    @ManyToOne(() => SchoolYear,{
        // 🚫 La matrícula siempre debe pertenecer a un año escolar
        nullable : false,
        // 🛡️ No se podrá eliminar un año escolar si tiene matrículas
        onDelete: 'RESTRICT'
    })
    // 🔗 Clave foránea hacia school_years
    // 👉 La columna física será school_year_id
    @JoinColumn({name: 'school_year_id'})
    schoolYear!: SchoolYear;

    // 🆔 Id directo del año escolar
    // 👉 Facilita consultas sin cargar toda la relación
    @RelationId((enrollment: Enrollement) => enrollment.schoolYear)
    schoolYearId! : string;


    // ================================================================================================


    // 🏫 Relación Muchos a Uno con Section
    // 👉 Muchas matrículas pueden pertenecer a la misma sección
    // 👉 Ejemplo:
    // Sección "A"
    //  |--- Juan
    //  |--- María
    //  |--- Ana
    @ManyToOne(() => Section,{
        // 🚫 Toda matrícula debe pertenecer a una sección
        nullable: false,
        // 🛡️ Impide eliminar una sección que tenga estudiantes matriculdos
        onDelete: 'RESTRICT'
    })
    // 🔗 Clave foránea hacia la tabla de secciones
    // 👉 El nombre físico de la columna será section_id
    @JoinColumn({name: 'section_id'})
    section!: Section;

    // 🆔 Id directo de la sección
    // 👉 Permite acceder rápidamente al identificador sin cargar toda la entidad Section
    @RelationId((enrollment: Enrollement) => enrollment.section)
    sectionId!: string;

    // ================================================================================================


    // 📆 @CreateDateColumn()
    // 👉 TypeORM asigna automáticamente la fecha y hora de creación
    // 👉 Se establece únicamente la primera vez que se guarda el registro
    // 👉 No necesitamos asignarlo manualmente
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz'
    })
    createdAt! : Date;


    // ================================================================================================


    // 📝 @UpdateDateColumn()
    // 👉 TypeORM actualiza automáticamente esta fecha cada vez que el registro es modificado
    // 👉 Muy útil para auditoría e historial de cambios
    // 👉 No necesitamos actualizarlo manualmente
    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz'
    })
    updatedAt!: Date;






}
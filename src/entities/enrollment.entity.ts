
// 📌 Aqui creamos un enum llamado EnrollmentStatus
// Un enum es como una "lista" cerrada de opciones permitidas"

import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Student } from "./student.entity";
import { SchoolYear } from "./school-year.entity";
import { Section } from "./section.entity";

// Sirve para que el estado solo pueda ser uno de estos valores
export enum EnrollmentStatus{

    // ✅ ACTIVE significa que la matrícula está activa, o sea, el alumno está matriculado actualmente
    ACTIVE = 'ACTIVE',
    // ❌ WITHDRAWN significa que el alumno fue retirado
    WITHDRAWN = 'WITHDRAWN',
    // 🎓 COMPLETE significa que terminó el año escolar
    COMPLETED = 'COMPLETED',
}

// 🚫 Esta restricción UNIQUE dice que la combinación de studentId + schoolYearId no se puede repetir
// 🔹 Ejemplo: Si el alumno "Juan" ya está matriculado en el año escolar 2026, no podemos volver a crear otra matrícula para Juan con ese mismo 2026.
@Unique(['studentId', 'schoolYearId'])
// 🔹 Creamos un indice sobre studentId para que buscar matrículas por alumno sea más rápido
@Index(['studentId'])
// 🔹 Creamos un índice sobre schoolYearId para que buscar matrículas por año escolar sea más rápido
@Index(['schoolYearId'])
// 🔹 Creamos un índice sobre sectionId para acelerar búsquedas por sección
@Index(['sectionId'])
// 🏛️ @Entity('enrollements) le dice a TypeORM que es esta clase se convertirá en una tabla llamada 'enrollements'
@Entity('enrollements')

// 🧩 Declaramos la clase Enrollement
// Esta clase representa una matrícula
export class Enrollements{

    // 🆔 Creamos la clave primaria llamada id
    // Será generada automáticamente en formato UUID
    @PrimaryGeneratedColumn('uuid')
    // 🏷️ Propiedad que guardará el identificador único de la matrícula
    id : string;


    // 🔗 Creamos una columna llamada student_id en la base de datos
    // Su tipo será uuid porque apuntará al id de un alumno
    @Column('uuid', {name: 'student_id'})
    // 👨‍🎓 Aqui guardamos el id del alumno relacionado con esta matricula
    // Es la foreing key (clave foránea) hacia la tabla students
    studentId : string;

    // 🔗 Creamos una columna llamada school_year_id en la base de datos
    // También será uuid porque apuntará al id de un año escolar
    @Column('uuid', {name: 'school_year_id'})
    // 📚 Aqui guardamos el id del año escolar al que perteneec esta matrícula
    schoolYearId: string;

    // 🔗 Creamos una columna llamada secition_id en la base de datos
    // Será uuid porque apuntará al id de una sección
    @Column('uuid', {name: 'section_id'})
    // 🏫 Aqui guardamos el id de la sección donde se matriculó el alumno
    sectionId : string;

    // 📅 Creamos una columna de tipo date llamada enrollment_date
    // Esta columna almacenará la fecha de la matricula
    @Column('date',{
        // 🏷️ En la base de datos la columna se llamará enrollement_date
        name: 'enrollment_date',
        // 🧠 default: () => 'CURRENT_DATE'
        // significa que PostgreSQL colocará automáticamente la fecha actual si no enviamos una fecha manualmente: ejemplo => 2026-03-26 
        default: () => 'CURRENT_DATE',
    })

    // 📅 Esta propiedad guardará la fecha en que se registró la matrícula.
    // Aquí está como string porque el tipo "date" en muchos proyectos se maneja como texto en formato YYYY-MM-DD
    enrollmentDate: string;

    // 📌 Creamos una columna especial para el estado de la matrícula
    @Column({
        // 🏷️ Indicamos que la columna en PostgreSQL será de tipo enum
        type: 'enum',
        // 📚 Le decimos cuál enum debe usar esta columna: EnrollmentStatus
        enum: EnrollmentStatus,
        // ✅ Si no mandamos un estado al crear la matrícula, por defecto será active.
    })
    // 📌 Esta propiedad almacenará el estado actual de la matrícula.
    // Solo podrá tomar ACTIVE, WITHDRAWN o COMPLETED
    status: EnrollmentStatus;


    // 📝 Creamos una columna de tipo text
    // Servirá para guardar observaciones largas, si hace falta
    @Column('text', {nullable: true})
    // 🧾 Esta propiedad guarda observaciones opcionales
    // Puede ser string o null
    // Si no quieres escribir ninguna observaciióm, puede quedar en null
    observations: string | null;

    // 🧩 Aqui empiezan las relaciones con las entidades/tablas
    // 👨‍🎓 ManyToOne hacia Student significa
    // Muchas matrículas pueden apuntar a un solo alumno o dicho más simple:
    // 🔹 Un alumno podría tener varias matrículas en distintos años, pero cada matrícula pertenece a un solo alumno
    @ManyToOne(() => Student,{
        nullable: false,
        onDelete: 'RESTRICT'})
    // 🔗 @JoinColumn indica que esta relación usa la columna student_id como clave foránea
    @JoinColumn({name: 'student_id'})
    // 👨‍🎓 Esta propiedad nos deja acceder el objeto completo del alumno, no solo a su id
    // Por ejemplo: enrollment.student.firstName
    student: Student;

    // 📚 ManyToOne hacia SchoolYear significa:
    // Muchas matrículas pueden pertenecer al mismo año escolar.
    // Ejemplo: muchos alumnos pueden estar matriculados en el año 2026
    @ManyToOne(() => SchoolYear, {
        nullable: false,
        onDelete: 'RESTRICT'
    })
    //🔗 Indicamos que esta relación usa la columna school_year_id
    @JoinColumn({name: 'school_year_id'})
    // 📚 Esta propiedad nos permite acceder al objeto completo del año escolar
    schoolYear: SchoolYear;


    // 🏫 ManyToOne hacia Section significa:
    // Muchas matrículas pueden pertenecer a la misma sección
    // Ejemplo: Varios alumnos pueden estar en la sección "1ro A"
    @ManyToOne(() => Section, {
        nullable: false, 
        onDelete: 'RESTRICT'
    })
    // 🔗 Indicamos que esta relación usa la columna section_id
    @JoinColumn({name: 'section_id'})
    // 🏫 Esta propiedad nos deja acceder al objeto completo de la sección
    section: Section;
    
    
    // 🧭 Esta columna se llenará automáticamente con la fecha y hora en que se creó el registro
    @CreateDateColumn({name: 'created_at'})
    // 🗓️ Aqui se guardará la fecha la fecha/hora exacta de creación del registro
    createdAt : Date;

    // 🔄 Esta columna se actualizará automáticamente cada vez que el registro sea editado
    @UpdateDateColumn({name: 'updated_at'})
    // 🗓️ Aqui se guardará la fecha/hora exacta de creación de la última actualización
    updatedAt: Date;






}

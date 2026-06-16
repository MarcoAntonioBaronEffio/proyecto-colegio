// 🏷️ Indicamos que esta clase será una entidad de base de dato

import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    Index, 
    JoinColumn, 
    OneToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { DocumentType } from "src/common/enums/document-type.enum";


// 🔒 Evita que se repita la combinación: documentType + documentNumber
// 🔹 Ejemplos: 
// ✅ DNI + 74432504
// ✅ PASSPORT + 74432504
// ❌ DNI + 74432504 (repetido)
@Index(
    ['documentType' , 'documentNumber'],
    {unique : true}
)


// 🔹 @Entity()
// 👉 Decorador de TypeORM
// 👉 Indica que esta clase representa una tabla en PostgreSQL
// 🔹 name : 'teachers"
// 👉 Nombre real que tendrá la tabla en la base de datos
@Entity({name:'teachers'})
// 👨‍🏫 Entidad Teacher
// 👉 Representa la información específica de un docente, se relaciona con User para reutilizar:
// 🔹 email, contraseña, nombres, apellidos, estado
export class Teacher{ 

    // 🔑 @PrimaryGeneratedColumn('uuid')
    // 👉 Define la clave primaria de la tabla
    // 👉 TypeORM generará automáticamente en UUID
    // 👉 Ejemplo: 550e8400-e29b-41d4-a716-446655440000
    @PrimaryGeneratedColumn('uuid')
    // 🆔 Identificador único del docente
    id! : string;

    // ====================================================
    // RELACIÓN CON USER
    // ====================================================

    // 🔗 Relación OneToOne con User
    // 👉 Un Teacher tiene UN User
    // 👉 Un User puede tener UN Teacher
    // User ------ Teacher
    //  1     ↔️       1
    // 🔹 nullable : false
    // 👉 Un docente no puede existir sin usuario
    // 🔹 onDelete : 'CASCADE'
    // 👉 Si se elimina el usuario
    // 👉 También se elimina automáticamente el docente
    @OneToOne(() => User, (user) => user.teacher,{ nullable: false, onDelete: 'CASCADE'})
    // 🔹 @JoinColumn()
    // 👉 Indica que Teacher es el dueño de la relación
    // 👉 Aquí se almacenará la clave foránea
    // 🔹 'user_id'
    // 👉 Columna FK real dentro de la tabla teacher
    @JoinColumn({name: 'user_id'})
    // 👤 Usuario asociado al docente
    // 🔹 Desde aquí podremos acceder a: teacher.user.firstName, teacher.user.lastName
    user!: User;

  
    // 📄 Tipo de documento
    // 🔹 DNI , PASSPORT, CE, PPT
    @Column({
        type : 'enum',
        enum : DocumentType,
        nullable : false
    })
    documentType!: DocumentType;

    // 🔢 Número de documento
    // 🔹 DNI -> 74432404 | PASSPORT -> ABC123456 | CE -> 00123456789
    @Column({
        type : 'varchar',
        length : 20, 
        nullable : false
    })
    documentNumber!: string;

    // 🏷️ Código interno del docente
    // 👉 Puede usarse como: DOC-001, DOC-002, DOC-003
    // 🔹 unique: true
    // 👉 No puede existir códigos repetidos
    @Column({
        type: 'varchar', 
        length: 30, 
        unique: true,
        // Se genera después del primer save() usando el UUID 
        nullable: true})
    // 🏷️ Código interno asignado por la institución
    teacherCode!: string;

    // 🎓 Título profesional del docente
    // 👉 Ejemplos: Licenciado en educación, Ingeniero de Sistemas, Licenciado en Matemáticas
    // 🔹 nullable : true
    // 👉 Puede registrarse después
    // 👉 No es obligatorio para el MVP
    @Column({type: 'varchar', length:100, nullable:true})
    // 🎓 Profesión o título académico
    professionalTitle?: string;

    // 📅 Fecha de contratación
    // 👉 Permite saber desde cuándo trabaja el docente en la institución
    // 🔹 Útil para:
    // 🔹 Reportes, antiguedad laboral, recursos humanos
    // 🔹 nullable : true
    // 👉 Puede omitirse inicialmente
    @Column({
        type: 'date',
        nullable: true
    })
    // 📅 Fecha en que fue contratado
    hireDate?: Date;


    // 🔹 @CreateDateColumn()
    // 👉 TypeORM asigna automáticamente la fecha y hora de creación
    // 🔹 Se ejecuta únicamente al insertar el registro por primera vez
    @CreateDateColumn()
    // 🕢 Fecha de creación del docente
    createdAt! : Date;

    // 🔹 @UpdateDateColumn()
    // 👉 TypeORM actualiza automáticamente la fecha cada vez que el registro cambia
    // 🔹 Ejemplo:
    // 🔹 Actualizar titulo profesional
    // 🔹 Actualizar fecha de contratación
    @UpdateDateColumn()
    // 🕥 Fecha de última actualización
    updatedAt! : Date;

}
// 🏷️ Indicamos que esta clase será la entidad de base de datos
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { DocumentType } from "src/common/enums/document-type.enum";
import { Student } from "./student.entity";

// 📋  Tipos de relación con el estudiante
export enum GuardianRelationship{
    // 👨🏻 Padre
    FATHER = 'FATHER',
    // 👩🏻 Madre
    MOTHER = 'MOTHER',
    // 👤 Cualquier otro responsable
    // 👉 Abuelo, Abuela, Tío, Tía, Tutor legal
    OTHER = 'OTHER'
}

// 🔒 Evita que se repita la combinación: documentType + documentNumber
// 🔹 Ejemplos
// ✅ DNI + 74432504
// ✅ PASSPORT + 74432504
// ❌ DNI + 74432504 (repetido)
@Index(
    ['documentType', 'documentNumber'],
    {unique : true}
)

// 👨‍👩‍👧 Tabla de apoderados
// 👉 Almacena información específica de los responsables del estudiante
@Entity('guardians')
export class Guardian{

    // 🔑 @PrimaryGeneratedColumn('uuid')
    // 👉 Clave primaria única generada automáticamente por TypeORM
    // 👉 Ejemplo: 550e8400-e29b-41d4-a716-446655440000
    @PrimaryGeneratedColumn('uuid')
    // 🆔 Identificador único del apoderado
    id!: string;

    // ====================================================
    // RELACIÓN CON USER
    // ====================================================


    // 🔗 Relación OneToOne con User
    // User ------ Guardian
    //  1     ↔️      1
    // 👉 Cada apoderado tiene un usuario asociado
    // 👉 Cada usuario puede pertenecer a un solo apoderado
    // 🔹 nullable : false
    // 👉 No puede existir un apoderado sin usuario
    // 🔹 onDelete : 'CASCADE'
    // 👉 Si se elimina el usuario, también se elimina el apoderado automáticamente
    @OneToOne(() => User, (user) => user.guardian,{nullable: false, onDelete: 'CASCADE'})
    // 🔹 @JoinColumn()
    // 👉 Indica que Guardian es dueño de la relación
    // 👉 Aquí se almacenará la FK 'user_id'
    @JoinColumn({name: 'user_id'})
    // 👤 Usuario asociado al apoderado
    // 👉 Desde aquí podemos acceder a: guardian.user.firstName, guardian.user.lastName
    user!: User;
 

    // ====================================================
    // INFORMACIÓN DEL APODERADO
    // ====================================================


    // 📄 Tipo de documento
    // 🔹 DNI, PASSPORT, CE, PPT
    @Column({
        type : 'enum',
        enum : DocumentType,
        nullable : false
    })
    documentType!: DocumentType;

    // 🔢 Número de documento
    // 🔹 DNI -> 74432504 | PASSPORT -> ABC123456 | CE -> 00123456
    @Column({
        type: 'varchar',
        length : 20,
        nullable : false
    })
    documentNumber!: string;

    // 👨‍👩‍👦 Relación con el estudiante
    // 👉 Se almacena utilizando el enum GuardianRelationship
    // @Column({
        // type : 'enum',
        // enum : GuardianRelationship,
        // nullable : false
    // })
    // 👨‍👩‍👦 Tipo de relación con el alumno
    // relationship!: GuardianRelationship;

    // 🧑‍🧑‍🧒‍🧒 Código interno del apoderado
    // 👉 Ejemplo: GUA-001, GUA-002, GUA-003
    @Column({
        type: 'varchar',
        length: 30,
        unique : true,
        // Se genera después del primer save() usando el UUID
        nullable: true
    })
    guardianCode!: string;


    // ====================================================
    // RELACIÓN CON ESTUDIANTES
    // ====================================================
 
    // 🔗 Un apoderado puede tener varios estudiantes asociados
    // 🔹 Ejemplo:
    // Juan Pérez
    // |--- Ana Pérez
    // |--- Luis Pérez
    // |--- María Pérez
    //@OneToMany(
     //   () => Student,
    //    (student) => student.guardian
    //)
    // 🧑‍🎓👩‍🎓 Lista de estudiantes asociados
    //students!: Student[];

    // 🕣 Fecha de creación automática
    @CreateDateColumn()
    createdAt!: Date;

    // 🕣 Fecha de última actualización automática
    @UpdateDateColumn()
    updatedAt!: Date;
}
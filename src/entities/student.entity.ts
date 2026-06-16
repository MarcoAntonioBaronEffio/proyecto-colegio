import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { Guardian } from "./guardian.entity";
import { DocumentType } from "src/common/enums/document-type.enum";


// 🔒 Evita que se repita la combinación: documentType + documentNumber
// 🔹 Ejemplo: 
// ✅ DNI + 74432504
// ✅ PASSPORT + 74432504
// ❌ DNI + 74432504 (repetido)
@Index(
    ['documentType','documentNumber'],
       {unique : true}
)

@Entity({name: 'students'})
// 🏫 Tabla de estudiantes
export class Student {




    // 🆔 Identificador único del estudiante
    @PrimaryGeneratedColumn('uuid')
    id! : string;

    // 👤 Usuario asociado al estudiante
    // 👉 Un Student pertenece a un único User
    // 👉 Un User solo puede tener un Student
    // 🔹 Ejemplo:
    // User
    //  |-- juan@gmail.com
    // Student
    //  |-- Juan Pérez
    @OneToOne(() => User , (user) => user.student, {
        // 🚫 Todo estudiante debe tene usuario
        nullable: false, 
        // 🗑️ Si eliminamos el usuario, también se elimina el estudiante
        onDelete : 'CASCADE'})
    @JoinColumn({
        // 🔑 FK hacia users.id
        name : 'user_id'})
    user! : User;



    // 👨‍👩‍👦 Apoderado principal del estudiante
    // 👉 Un apoderado puede tener muchos estudiantes
    // 🔹 Ejemplo:
    // Pedro Gómez
    //  |-- Juan Gómez
    //  |-- María Gómez
    //  |-- Ana Gómez
    //@ManyToOne(
    //    () => Guardian,
    //    (guardian) => guardian.students,{
            // 🚫 Todo estudiante debe tener apoderado
    //        nullable : false,
            // 🔒 No permitir eliminar un apoderado si todavia tiene estudiantes asociados
    //        onDelete : 'RESTRICT'
    //    }
    //)
    //@JoinColumn({
        // 🔑 FK hacia guardians.id
        //name : 'guardian_id'
    //})
    //guardian!: Guardian;

   
    

    // 📄 Tipo de document
    // 🔹 Ejemplos: DNI, PASSPORT, CE, PPT
    @Column({
        type : 'enum',
        enum : DocumentType,
        nullable : false
    })
    documentType!: DocumentType;


    // 🔢 Número de documento
    // 👉 Ejemplos: 
    // 🔹 DNI -> 74432504
    // 🔹 PASSPORT -> ABC123456
    // 🔹 CE -> 00123456789
    @Column({
        type : 'varchar',
        length : 20,
        nullable : false
    })
    documentNumber! : string;



    // 🎓 Código interno del estudiante
    // 👉 Ejemplo: 25001A, 25002A
    // 🧠 Este código pertenece al colegio, independientemente del documento del alumno
    @Column({
        // 🔤 Texto variable
        type : 'varchar', 
        // 🔢 Longitud máxima
        length : 20, 
        // 🔒 No se permiten códigos repetidos
        unique : true,
        // Se genera después del primer save() usando el UUID
        nullable: true})
    // 🎓 Código único del estudiante
    studentCode! : string;
 
    // 📅 @CreateDateColumn()
    // 👉 TypeORM asigna automáticamente la fecha y hora de creación
    // 👉 Ejemplo: 2026-02-28 12:36:31.680252
    @CreateDateColumn()
    // 📅 Fecha de creación del registro
    createdAt! : Date;

    // 📅 @UpdateDateColumn()
    // 👉 Se actualiza automáticamente cada vez que se modifica la entidad
    // 👉 Ejemplo: UPDATE Student -> updatedAt cambia automáticamente
    @UpdateDateColumn()
    // 📅 Fecha de última actualización
    updatedAt!: Date;
}


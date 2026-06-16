import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { DocumentType } from "src/common/enums/document-type.enum";


// 🔒 Evita que se repita la combinación: documentType + documentNumber
// 🔹 Ejemplos:
// ✅ DNI + 74432504
// ✅ PASSPORT + 74432504
// ❌ DNI + 74432504 (repetido)
@Index(
    ['documentType', 'documentNumber'],
    {unique : true}
)


// 🏫 Entidad que representa a los administradores del sistema
// 👉 Cada administrador está asociado a un usuario (User)
// 👉 Aquí almacenamos información específica del administrador
@Entity({name:'administrators'})
export class Administrator {

    // 🆔 Clave primaria de la tabla
    // 👉 Se genera automáticamente utilizando UUID
    // ✅ Más seguro que un ID incremental
    @PrimaryGeneratedColumn('uuid')
    id! : string;


    
    // 🔗 Un administrador no existe sin User
    @OneToOne(() => User, (user) => user.administrator, {
        // 👉 Un Administrator pertenece a un único User
        // 👉 Un User solo puede tener un Administrator
        nullable: false, 
        // 🗑️ Si eliminamos el usuario, también se elimina el administrador
        onDelete: 'CASCADE'})
    // 🔗 Indica que esta entidad contiene la clave foránea
    // 👉 Se creará la columna user_id en la tabla administrators
    @JoinColumn({name : 'user_id'})
    // 👤 Usuario asociado al administrador
    user! : User;





    // 📄 Tipo de documento
    // 🔹 DNI, PASSPORT, CE, PPT
    @Column({
        type : 'enum',
        enum : DocumentType,
        nullable : false
    })
    documentType! : DocumentType;




    // 🔢 Número de documento
    // 🔹 DNI -> 74432504 | PASSPORT -> ABC123456 | CE -> 00123456789
    @Column({
        type : 'varchar',
        length : 20, 
        nullable : false
    })
    documentNumber! : string;




    // 🏢 Código interno del administrador
    // 👉 Ejemplo: ADM-001, ADM-002, ADM-003
    // 🔒 unique: true
    // 👉 No puede repetirse entre administradores
    @Column({
        type: 'varchar', 
        length: 30, 
        unique: true,
        // Se genera después del primer save() usando el UUID
        nullable: true})
    administratorCode!: string;





    // 📅 Fecha de creación del registro
    // 👉 Se genera automáticamente cuando se inserta el administrador
    @CreateDateColumn()
    createdAt!: Date;

    // 📅 Fecha de última actualización
    // 👉 Se actualiza automáticamente cada vez que se modifica el registro
    @UpdateDateColumn()
    updatedAt! : Date;

}
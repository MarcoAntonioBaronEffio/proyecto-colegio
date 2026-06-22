import { Column, CreateDateColumn, Entity, Index, JoinColumn,  OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { DocumentType } from "src/common/enums/document-type.enum";

// 🔒 Evita que se repita la combinación: documentType + documentNumber
// 🔹 Ejemplos:
// ✅ DNI + 74432504
// ✅ PASSPORT + 74432504
// ❌ DNI + 74432504 (repetido)
@Index(
    ['documentType', 'documentNumber'],
    {unique: true}
)

// 👑 Entidad que representa a los superadministradores del SaaS
// 👉 Tienen acceso global a toda la plataforma
// 👉 Pueden administrar múltiples colegios
// 👉 Pueden crear administradores de colegios
// 👉 Cada superadministrador está asociado a un único User
@Entity({name: 'system_administrators'})
export class SystemAdministrator{

    // 🆔 Clave primaria de la tabla
    // 👉 Se genera automáticamente utilizando UUID
    // ✅ Más seguro que un ID incremental
    @PrimaryGeneratedColumn('uuid')
    id!: string;



    // 🔗 Relación uno a uno con User
    // 👉 Un SytemAdministrator pertenece a un único User
    // 👉 Un User solo puede tener un SytemAdministrator

    // User --------------- SytemAdministrator
    //  1         ↔️           1

    // 🔒 nullable : false
    // 👉 No puede existir un SystemAdministrators sin User
    // 🗑️ onDelete : 'CASCADE'
    // 👉 Si eliminamos el User, también se elimina automáticamente el SystemAdministrator asociado
    @OneToOne(
        () => User,
        (user) => user.systemAdministrator,
         {
      nullable : false,
      onDelete : 'CASCADE'   
        }
    )
    // 🔗 Indica que esta entidad contiene la clave foránea
    // 👉 Se creará la columna user_id en la tabla system_administrator
    @JoinColumn({name: 'user_id'})
    // 👤 Usuario asociado al superadministrador
    user! : User;


    // 📄 Tipo de documento de identidad
    // 👉 Permite identificar oficialmente al superadministrador
    // 👉 Ejemplos: DNI, PASSPORT, CE (Carné de Extranjería)
    // 🔒 nullable: false
    // 👉 Todo superadministrador debe tener un tipo de documento registrado
    @Column({
        // 📦 Se almacenará como un ENUM en la base de datos
        type: 'enum',
        // 📚 Valores permitidos definidos en el enum DocumentType
        enum: DocumentType,
        // 🚫 Campo obligatorio
        nullable : false
    })
    documentType!: DocumentType;


    // 🔢 Número del documento de identidad
    // 👉 Valor asociado al tipo de documento seleccionado
    // 👉 Ejemplos:
    // 🔹 DNI  -> 74432405
    // 🔹 PASSPORT -> ABC123456
    // 🔒 nullable : false
    // 👉 Todo superadministrador debe tener un número de documento registrado
    @Column({
        // 📝 Texto variable
        type: 'varchar',
        // 📏 Longitud máxima permitida
        // 👉 Suficiente para DNI, CE , PASSPORT y futuros documentos
        length: 20, 
        // 🚫 Campo obligatorio
        nullable : false
    })
    documentNumber!: string;


    // 🏢 Código interno del superadministrador
    // 🔹 Ejemplo: SYS-001, SYS-002, SYS-003
    // 🔒 unique : true
    // 👉 No puede repetirse entre superadministradores
    // ⚠️ nullable: true
    // 👉 Puede generarse después del primer "save"
    @Column({
        type: 'varchar',
        length: 30, 
        unique: true,
        nullable: true
    })
    systemAdminCode! : string;

    // 📅 Fecha de última actualización
    // 👉 Se genera automáticamente cuando se inserta el superadministrador en la base de datos
    @CreateDateColumn()
    createdAt!: Date;

    // 📅 Fecha de última actualización
    // 👉 Se actualizará automáticamente cada vez que el registro es modificado
    @UpdateDateColumn()
    updatedAt! : Date; 


}
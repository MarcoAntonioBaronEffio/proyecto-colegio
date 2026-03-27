import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Rol } from "./rol.entity";
import { Student } from "./student.entity";
import { Administrator } from "./administrator.entity";  
import { Teacher } from "./teacher.entity";
import { Guardian } from "./guardian.entity";

// ✅ Como estamos armando un sistema que va a crecer, autenticar usuarios de diferentes roles , UUID es la 
// opción más profesional y segura

// 🔹 @Entity -> Decorador de TypeORM y que indica que esta clase representa una tabla en la base de datos.
// ✅ {name: 'users} especifica que la tabla en PostgreSQL se llamará "users".
@Entity({name : 'users'})
// 🔹 Clase que modela la entidad "Users" y sus columnas
export class User {

    // @PrimaryGeneratedColumn('uuid') -> Indica que este campo es la clave primaria (PRIMARY KEY).
    // Se generará automáticamente usando un UUID (identificador único universal).
    // ✔️ Ventaja: Más seguro que un ID incremental.
    @PrimaryGeneratedColumn('uuid')
    id: string; // Campo 'id' que almacenará el UUID generado
    
    // 🔹 @Index({unique : true});
    // Crea un índice único sobre esta columna.
    // - unique: true -> no permite correos duplicados en la tabla.
    @Index({unique : true})
    // 🔹 @Column() -> Define una columna de la tabla.
    // - type: 'varchar' -> tipo de texto variable.
    // - length: 150 -> Máximo 150 caracteres.
    // ⚠️ Se usa para almacenar el correo electrónico del usuario.
    @Column({type : 'varchar', length : 150})
    email : string; // Propiedad 'email'.

    // 🔹 Column() -> Define la columna "firstName".
    // - Almacena el nombre del usuario.
    // - VARCHAR de hasta 120 caracteres.
    @Column({type : 'varchar', length: 80})
    firstName : string; // Nombre del usuario.

    // 🔹 Column(...) -> define columna para el apellido
    // - type : 'varchar' -> texto variable
    // - length : 80 -> máximo 80 caracteres
    @Column({type : 'varchar', length : 80})
    lastName : string;

    // 🔹 @Column() -> Define una columna para guardar el HASH de la contraseña.
    // ⚠️ Nunca se almacena la contraseña en texto plano.
    // Se recomienda hashing con bcrypt u otro algoritmo seguro.
    // 🔹 select : false -> Ocultará este campo por defecto en las respuestas JSON
    @Column({type: 'varchar', length: 200, select : false})
    passwordHash : string; // El hash puede ser largo, por eso length : 200

    // 🔹 ManyToOne() -> Define la relación de MUCHOS usuarios -> 1 rol.
    // - () => Rol -> Indica que se relaciona con la entidad Rol.
    // - eager: true -> cada vez que se consulte un usuario, automáticamente se cargará el rol sin necesidad de .join().
    //   Hace que TypeOrm automáticamente cargue el rol de cada consulta de usuario
    //   Piensa así: "Cuando cargues User ,trae también el rol automáticamente"
    // - nullable: false -> un usuario NO puede existir sin un rol.
    // - onDelete : 'RESTRICT' -> si un rol tiene usuarios asignados, no puede eliminarse.
    // ⭐️ Siempre define el FK en el lado de ManyToOne cuando modeles en TypeORM
    @ManyToOne(() => Rol, {eager: false, nullable: false, onDelete : 'RESTRICT'})
    // 🔹 JoinColumn() -> Define la columna física de clave foránea en la tabla "users".
    // ⭐️ 'role_id' es la COLUMNA "FK" REAL en la tabla "users" (base de datos)
    // ⭐️ 'role' es la propiedad de relación en TypeORM (objeto Rol en memoria)
    // Se usa para personalizar la columna que representa la relación en la base de datos.
    // Por defecto, TypeORM ya crea una columna automáticamente cuando usas la relación @ManyToOne.
    // - name: 'role_id' -> El nombre de la columna FK será role_id
    @JoinColumn({name: 'role_id'})
    role : Rol; // Relación con la entidad Rol (cada usuario tiene un rol).
 
    // 🔹 @Column (..., nullable : true) -> columna opcional (puede ser Null)
    // - type : 'varchar' -> texto
    // - length : 20 -> máximo 20 caracteres
    @Column({type : 'varchar', length: 20, nullable : true})
    phone?: string; // ❓ "?" -> en typescript indica que puede no existir

    // 🔹 @Column(..., nullable: true) -> URL del avatar, opcional
    // - length : 255 -> típico para URLs
    @Column({type: 'varchar', length: 255, nullable: true})  // 🖼️ URL de avatar opcional
    avatarUrl?: string;  // 🌐 Puede ser null / indefined si no hay avatar

    // ✅ default : true -> al crear usuario, por defecto queda activo
    @Column({type : 'boolean', default: true})
    isActive : boolean;
        
    // 🔹 @CreateDateColumn() -> Columna asignada automáticamente por TypeOrm con la fecha/hora en que se 
    // insertó el registro (al momento de crear al usuario).
    @CreateDateColumn()
    createdAt : Date; // Fecha de creación

    // 🔹 UpdateDateColumn() -> Similar a createdAt, pero se actualiza automáticamente cada vez que el registro
    // se modifica.
    @UpdateDateColumn()
    updatedAt : Date; // Fecha de última actualización

    // 🔹 User puede existir sin Student
    @OneToOne(() => Student, (student) => student.user)
    student? : Student; 

    // 🔹 User puede existir sin Administrator
    @OneToOne(() => Administrator, (admin) => admin.user)
    administrator?: Administrator;

    @OneToOne(() => Teacher, (teacher) => teacher.user)
    teacher?: Teacher;

    @OneToOne(() => Guardian, (guardian) => guardian.user)
    guardian?: Guardian;
}
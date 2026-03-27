import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";

//🔹 @Entity -> Decorador que indica que esta clase será una entidad de base de datos.
// El parámetro {name: 'roles'} establece el nombre exacto de la tabla en PostgreSQL.
@Entity({name:'roles'})
export class Rol {
    
    // 🔹 @PrimaryGeneratedColumn -> Indica que esta columna será la clave primaria y su valor será generado automáticamente
    // (autoincremental)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    //🔹 Column -> Define una columna normal.
    // lenght: 50 -> Máximo de caracteres.
    // unique: true -> No se puede repetir el mismo nombre de rol.
    @Column({length : 50, unique : true})
    name : string;

    //🔹 type: 'text' -> Guarga contenido más largo
    // nullable: true -> Esta columna puede ser opcional (permitir NULL)
    // El signo '?' en la propiedad 'descripcion?' refuerza que es opcional desde TypeScript
    @Column({type : 'text', nullable: true})
    description?: string;

    //🔹 default : true -> Si no se envía un valor para 'activo', por defecto se insertará como true.
    //Esta columna permitirá activar o desactivar un rol sin eliminarlo.
    @Column({default : true})
    isActive : boolean;

    // 🔹 Relación inversa : un rol tiene muchos usuarios
    // No crea nada en la base de datos, solo le dice a TypeORM:
    // "Desde Rol puedo navegar a sus usuarios"
    // ⭐️ El rol no necesita saber quién lo usa para que la relación exista
    @OneToMany(() => User, user => user.role)
    users : User[];

    //🔹 CreateDateColumn -> registra automáticamente la fecha y hora en que se creó el registro
    @CreateDateColumn({name: 'created_at', type: 'timestamptz'})
    createdAt : Date;

    //🔹 UpdateDateColumn -> Registra automáticamente la fecha y hora de la última actualización del registro.
    @UpdateDateColumn({name: 'updated_at', type : 'timestamptz'})
    updatedAt : Date;

}
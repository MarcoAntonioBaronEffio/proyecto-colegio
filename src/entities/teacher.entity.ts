// 🏷️ Indicamos que esta clase será una entidad de base de dato

import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";

// 👉 El nombre de la tabla será "teachers"
@Entity({name:'teachers'})
export class Teacher{ 

    // 🔑 Clave primaria UUID generada automáticamente
    @PrimaryGeneratedColumn('uuid')
    id : string;

    // 🔗 Relación OneToOne con User
    // ✅ Teacher depende de User, por eso aqui va el JoinColumn
    // ✅ nullable: false -> un docente no puede existir sin usuarios
    // ✅ onDelete: 'CASCADE' -> si borras el usuario, también se borra el docente
    @OneToOne(() => User, (user) => user.teacher,{ nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User;

  

    // 🪪 DNI del docente
    // ✅ Index para búsquedas más rápidas
    // ✅ unique para que no se repita
    // ✅ length 8 porque el DNI tendrá exactamente 8 caracteres
    @Index()
    @Column({type: 'varchar', length:8 , unique:true})
    dni: string;

    // 🏷️ Código interno del docente
    // ✅ También será único
    // ✅ Puedes usarlo como código laboral o identificador interno
    @Index()
    @Column({type: 'varchar', length: 30, unique: true})
    teacherCode: string;

    // 📘 Especialidad del docente
    // ✅ Es opcional para nuestro mvp
    // ✅ nullable: true permite guardar null en la base de datos
    @Column({type: 'varchar', length:50, nullable:true})
    specialty?: string;

    // 🕣 Fecha de creación automática
    @CreateDateColumn()
    createdAt : Date;

    // 🕣 Fecha de actualización automática
    @UpdateDateColumn()
    updatedAt : Date;


}
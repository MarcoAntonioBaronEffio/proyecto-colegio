// 🏷️ Indicamos que esta clase será la entidad de base de datos

import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";

// 👉 El nombre de la tabla será "guardians"
@Entity('guardians')
export class Guardian{

    // 🔑 Clave primaria UUID generada automáticamente
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // 🔗 Relación OneToOne con User
    // ✅ Guardian depende de User, por eso aqui val el JpinColumn
    // ✅ nullable: false -> un apoderado no puede existir sin usuario
    // ✅ onDelete: 'CASCADE' -> si borras el usuario, también se borra el apoderado
    @OneToOne(() => User, (user) => user.guardian,{nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User;
 

    // 🪪 DNI del apoderado
    // ✅ Index para mejorar búsquedas
    // ✅ unique para evitar duplicados
    @Index()
    @Column({type: 'varchar', length: 8, unique: true})
    dni: string;

    // 👨‍👩‍👦  Parentesco o relación con el estudiante
    // ✅ Ejemplo: PADRE, MADRE, TUTOR, ABUELO, TIO
    @Column({type: 'varchar', length: 20})
    relationship: string;

    // 🕣 Fecha de creación automática
    @CreateDateColumn()
    createdAt: Date;

    // 🕣 Fecha de actualización automática
    @UpdateDateColumn()
    updatedAt: Date;
}
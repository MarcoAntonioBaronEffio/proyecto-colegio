import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { Section } from "./section.entity";

@Entity({name: 'students'})
// 🔹 Esto garantiza a nivel DB : un user solo puede ser estudiante una vez 
@Index(['user'], {unique: true})

export class Student {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    // 🔹 Student no puede existir sin User, Student depende de User, por eso tiene la FK
    // 🔹 JoinColumn -> En OneToOnE deber ir en la entidad que dependa de otra
    @OneToOne(() => User , (user) => user.student, {nullable: false, onDelete : 'CASCADE'})
    @JoinColumn({name : 'user_id'})
    user : User;

    @Index()
    @Column({type : 'varchar', length: 8, unique : true})
    dni : string;

    @Index()
    @Column({type : 'varchar', length : 30, unique : true})
    studentCode : string;
 
    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt: Date;
}


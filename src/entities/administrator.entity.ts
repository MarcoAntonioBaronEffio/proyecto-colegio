import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";

@Entity({name:'administrators'})
export class Administrator {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    // 🔗 Un administrador no exise sin User
    @OneToOne(() => User, (user) => user.administrator, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name : 'user_id'})
    user : User;

    // 🪪 DNI 
    @Index()
    @Column({type : 'varchar', length: 8, unique: true})
    dni: string;

    @Index()
    @Column({type: 'varchar', length: 30, unique: true})
    workCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt : Date;

}
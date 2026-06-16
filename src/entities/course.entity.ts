import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('courses')
export class Course{

    @PrimaryGeneratedColumn('uuid')
    id! : string;

    @Column({
        length: 100,
        unique : true
    })
    name! : string;


    @Column({
        type: 'text',
        nullable: true
    })
    description?: string;

}
import { IsEnum } from "class-validator";
import { ClassroomStatus } from "src/entities/classroom.entity";

export class ChangeClassroomsStatusDto{

    @IsEnum(ClassroomStatus)
    status! : ClassroomStatus;

}
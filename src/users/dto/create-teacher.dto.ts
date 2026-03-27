import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class TeacherDto{


    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            :value
    )
    @IsNotEmpty({message: 'El DNI del docente es obligatorio'})
    @IsString({message: 'El DNI debe ser texto'})
    @Matches(/^\d{8}$/, {message: 'El DNI debe tener exactamente 8 dígitos'})
    dni: string;
    
    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            : value
    )
    @IsNotEmpty({message: 'El teacherCode es obligatorio'})
    @IsString({message: 'El teacherCode debe ser texto'})
    @MaxLength(30, {message: 'El teacherCode no puede superar 30 caracteres'})
    teacherCode: string;

    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            : value
    )
    @IsOptional()
    @IsString({message: 'La especialidad debe ser texto'})
    @MaxLength(50, {message: 'La especialidad no puede 30 caracteres'})
    specialty?: string;
}
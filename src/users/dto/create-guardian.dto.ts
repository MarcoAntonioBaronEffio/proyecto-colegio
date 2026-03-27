import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class GuardianDto{


    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            :value
    )
    @IsNotEmpty({message: 'El DNI del apoderado es obligatorio'})
    @IsString({message: 'El DNI debe ser texto'})
    @Matches(/^\d{8}$/,{message: 'El DNI debe tener exactamente 8 dígitos'})
    dni: string;

    @Transform(({value}) => 
        typeof value === 'string'
            ? value.trim().toUpperCase()
            : value)
    @IsNotEmpty({message : 'El parentesco es obligatorio'})
    @IsString({message: 'El parentesco debe ser exacto'})
    @MaxLength(20, {message: 'El parentesco no puede superar 20 caracteres'})
    relationship : string;


}
import { Transform } from "class-transformer";
import { IsNotEmpty, IsSemVer, IsString, MaxLength, MinLength } from "class-validator";

export class AdministratorDto {


    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            : value)
    @IsNotEmpty({message : 'El DNI del administrador es obligatorio'})
    @IsString({message: 'dni debe ser texto'})
    @MinLength(8, {message: 'dni debe tener 8 caracteres'})
    @MaxLength(8, {message: 'dni debe tener 8 caracteres'})
    dni: string;

    @Transform(({value}) =>
            typeof value === 'string'
                ? value.trim()
                : value)
    @IsNotEmpty({message: 'workCodde es obligatorio'})
    @IsString({message: 'workCode debe ser texto'})
    @MaxLength(30, {message: 'workCode no puede superar 30'})
    workCode: string;



}
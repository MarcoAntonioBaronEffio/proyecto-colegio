import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { DocumentType } from "src/common/enums/document-type.enum";

export class TeacherDto{

    @IsNotEmpty({
        message : 'El tipo de documento es obligatorio'
    })
    @IsEnum(DocumentType,{
        message : 'Tipo de documento no válido'
    })
    documentType! : DocumentType;


    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            : value
    )
    @IsNotEmpty({
        message: 'El número de documento es obligatorio'
    })
    @IsString({
        message : 'El número de documento debe ser texto'
    })
    @MaxLength(20, {
        message: 'El número de documento no puede superar 20 caracteres'
    })
    documentNumber!: string;

 


    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            : value
    )
    @IsOptional()
    @IsString({
        message : 'El título profesional debe ser texto'
    })
    @MaxLength(100, {
        message : 'El título profesional no puede superar los 100 caracteres'
    })
    professionalTitle?: string;

}
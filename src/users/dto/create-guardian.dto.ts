import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { DocumentType } from "src/common/enums/document-type.enum";
import { GuardianRelationship } from "src/entities/guardian.entity";

export class GuardianDto{


    @IsNotEmpty({
        message: 'El tipo de documento es obligatorio'
    })
    @IsEnum(DocumentType,{
        message : 'Tipo de documento no válido'
    })
    documentType!: DocumentType;


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
 



    //@IsNotEmpty({
    //    message : 'La relación con el estudiante es obligatoria'})
    //@IsEnum(GuardianRelationship,{
     //   message: 'Relación no válida'
    //})
    //relationship! : GuardianRelationship;


  
}
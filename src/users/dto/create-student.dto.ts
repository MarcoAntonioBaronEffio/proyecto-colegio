import { Transform } from "class-transformer";
import { IsEnum, isNotEmpty, IsNotEmpty, IsString, IsUUID, Matches, MaxLength } from "class-validator";
import { DocumentType } from "src/common/enums/document-type.enum";
 

// 🧩 Declaramos una clase llamada StudentDto
// ✅ Este DTO representa el sub-objeto "student" que puede venir dentro de RegisterDto cuando el rol es STUDENT
// ✅ Aquí definimos y validamos únicamente los campos propios del estudiante
export class StudentDto{

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
            : value)
    @IsNotEmpty({
        message : 'El número de documento es obligatorio'
    })
    @IsString({
        message : 'El número de documento debe ser texto'
    })
    @MaxLength(20, {
        message : 'El número de documento no puede superar 20 caracteres'
    })
    documentNumber! : string;
   
 

}

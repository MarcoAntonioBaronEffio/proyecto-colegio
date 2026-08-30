import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { DocumentType } from "src/common/enums/document-type.enum";
import { GuardianRelationship } from "src/entities/guardian.entity";
import { CreateUserDto } from "./create-user.dto";


// ============================================================
// 🧑‍🧑‍🧒 CREATE GUARDIAN DTO
// ============================================================ 

// 🧑‍🧑‍🧒 Contiene todos los datos necesarios para registrar un apoderado
// 🧬 Hereda: 📧 email, 🔐 password, 👤 firstName, 👤 lastName, 📱 phone?, 🖼️ avatar?
// ✚ Agrega: 📄 documentType, 🔢 documentNumber
// 🏫 schoolId será obtenido desde el JWT
// 🔐 El cliente tampoco selecciona RoleName.GUARDIAN
export class CreateGuardianDto extends CreateUserDto{


    // 📄 Document Type
    @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
    @IsEnum(DocumentType,{ message : 'Tipo de documento no válido' })
    documentType!: DocumentType;


    // 🔢 Document Number
    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            : value
    )
    @IsNotEmpty({ message: 'El número de documento es obligatorio' })
    @IsString({ message : 'El número de documento debe ser texto' })
    @MaxLength(20, { message: 'El número de documento no puede superar 20 caracteres' })
    documentNumber!: string;
 



    //@IsNotEmpty({
    //    message : 'La relación con el estudiante es obligatoria'})
    //@IsEnum(GuardianRelationship,{
     //   message: 'Relación no válida'
    //})
    //relationship! : GuardianRelationship;


  
}
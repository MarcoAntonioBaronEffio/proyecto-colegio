import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsSemVer, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { DocumentType } from "src/common/enums/document-type.enum";
import { CreateUserDto } from "./create-user.dto";


// ============================================================
// 🛡️ CREATE ADMINISTRATOR DTO
// ============================================================

// 🛡️ Contiene todos los datos necesarios para registrar un ADMINISTRATOR
// 🧬 Hereda: 📧 email, 🔐 password, 👤 firstName, 👤 lastName , 📱 phone? , 🖼️ avatarUrl?
// ✚ Agrega: 📄 documentType, 🔢 documentNumber, 🏫 schoolId?
// 🔐 El rol NO viene desde el frontend
// 👉 El backend utilizará directamente RoleName.ADMINISTRATOR
export class CreateAdministratorDto extends CreateUserDto{

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
    @IsString({ message: 'El número de documento debe ser texto' })
    @MaxLength(20, { message : 'El número de documento no puede superar 20 caracteres' })
    documentNumber!: string;


    // 🏫 School Id
    //
    // 🟡 Puede ser opcional porque dependerá de quién registra al administrador
    // 👑 SYSTEM_ADMINISTRATOR
    // 👉 Puede seleccionar el colegio desde el frontend
    //
    // 🛡️ ADMINISTRATOR
    // 👉 Su schoolId deberá obtenerse desde el JWT
    @IsOptional()
    @IsUUID('4',{ message: 'schoolId debe ser un UUID válido'})
    schoolId? : string;


}
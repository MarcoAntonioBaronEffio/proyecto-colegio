import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { DocumentType } from "src/common/enums/document-type.enum";
import { CreateUserDto } from "./create-user.dto";


// ============================================================
// 🧑‍🏫 CREATE TEACHER DTO
// ============================================================

// 🧑‍🏫 Contiene todos los datos necesarios para registrar un profesor
// 🧬 Hereda: 📧 email, 🔐 password , 👤 firstName, 👤 lastName, 📱 phone , 🖼️ avatarUrl?
// ✚ Agrega: 📄 documentType, 🔢 documentNumber, 🎓 profesionalTitle?
// 
// 🏫 No recibimos schoolId
// 👉 El colegio será obtenido desde el JWT del usuario que está realizando el registro
// 🔐 Tampoco recibimos roleName.
// 👉 El backend determinará RoleName.TEACHER 
export class CreateTeacherDto extends CreateUserDto{

    // 📄 Document Type
    @IsNotEmpty({ message : 'El tipo de documento es obligatorio' })
    @IsEnum(DocumentType,{ message : 'Tipo de documento no válido' })
    documentType! : DocumentType;


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


    // 🎓 Professional Title
    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            : value
    )
    @IsOptional()
    @IsString({ message : 'El título profesional debe ser texto' })
    @MaxLength(100, { message : 'El título profesional no puede superar los 100 caracteres' })
    professionalTitle?: string;

}
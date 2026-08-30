import { Transform } from "class-transformer";
import { IsEnum, isNotEmpty, IsNotEmpty, IsString, IsUUID, Matches, MaxLength } from "class-validator";
import { DocumentType } from "src/common/enums/document-type.enum";
import { CreateUserDto } from "./create-user.dto";

// ============================================================
// 🎓 CREATE STUDENT DTO
// ============================================================

// 🎓 Contiene todos los datos necesarios para registrar un estudiante
// 🧬 Hereda: 📧 email, 🔐 password, 👤 firstName, 👤 lastName, 📱 phone? , 🖼️ avatarUrl?
// ✚ Agrega: 📄 documentType , 🔢 documentNumber
// 
// 🏫 schooId NO viene desde el cliente
// 👉 Se obtendrá desde el usuario autenticado
// 🔐 roleName tampoco viene desde el cliente
// 👉 El backend utilizará RoleName.STUDENT

// 🧩 Declaramos una clase llamada StudentDto
// ✅ Este DTO representa el sub-objeto "student" que puede venir dentro de RegisterDto cuando el rol es STUDENT
// ✅ Aquí definimos y validamos únicamente los campos propios del estudiante
export class CreateStudentDto extends CreateUserDto{

    // 📄 Document Number
    @IsNotEmpty({ message : 'El tipo de documento es obligatorio' })
    @IsEnum(DocumentType,{ message : 'Tipo de documento no válido' })
    documentType! : DocumentType;

    // 🔢 Document Number
    @Transform(({value}) => 
        typeof value === 'string'
            ? value.trim()
            : value)
    @IsNotEmpty({ message : 'El número de documento es obligatorio' })
    @IsString({ message : 'El número de documento debe ser texto' })
    @MaxLength(20, { message : 'El número de documento no puede superar 20 caracteres' })
    documentNumber! : string;
   
 

}

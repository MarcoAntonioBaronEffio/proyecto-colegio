import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { StudentDto } from "./create-student.dto";
import { Transform, Type } from "class-transformer";
import { AdministratorDto } from "./create-administrator.dto";
import { TeacherDto } from "./create-teacher.dto";
import { GuardianDto } from "./create-guardian.dto";
import { SystemAdministratorDto } from "./create-system-administrator.dto";
import { RoleName } from "src/entities/users.entity";



// ✅ Esta clase representa el payload completo que llegará al backend cuando quiere registrar un usuario según su rol
// ⭐️ Analogía simple:
// 🔹 RegisterDto = formulario grande 🧾📄 (datos generales del usuario)
// 🔹 StudentDto = sub-formulario dentro del formulario  🧾➕🎓 (datos EXTRA)

// ⭐️ Importante: aunque RegisterDto no tuviera: roleName, administrator? , student? igual hereda TODO lo de CreateUserDto

// 🧩 Creamos el DTO RegisterDto
// 🧬 "extends CreateUserDto" significa que RegisterDto HEREDA todos los campos de CreateUserDto:
// 📧 email, 👤 firstName, 👤 lastName , 🔑 password, 📱 phone, 🖼️ avatarUrl, 🧩 roleId, etc.
// ✅ O sea: RegisterDto = CreateUserDto + campos extra (student)
export class RegisterDto extends CreateUserDto {

    // ✅ roleName viene del cliente
    // 📌 Aplicamos una transformación al campo roleName antes de validarlo
    // ✅ Extraemos "value", que es el valor enviado por el cliente
    
    @Transform(({value}) => 
    typeof value === 'string'? value.trim().toUpperCase() : value)
    @IsNotEmpty({message : 'Debes enviar roleName'})
    @IsEnum(RoleName, {message : 'roleName inválido.'})
    roleName!: RoleName;
    
    // ----------------------------------------------------------------------
    // 👑 SYSTEM ADMINISTRADOR
    // ----------------------------------------------------------------------
    @IsOptional()
    @Type(() => SystemAdministratorDto)
    @ValidateNested()
    systemAdministrator? : SystemAdministratorDto;


    // ----------------------------------------------------------------------
    // 👨‍💼 ADMINISTRADOR
    // ----------------------------------------------------------------------

    // ✅ Este campo es opcional
    @IsOptional()
    // ✅ Le decimos a class-transformer que, si llega el campo "administrator" en el JSON, debe convertirlo a una instancia de AdministratorDto
    @Type(() => AdministratorDto)
    @ValidateNested()
    administrator?: AdministratorDto;



    
    // =========================================================
    // 🎓 STUDENT
    // =========================================================

    // ✅ Puede no venir
    // 🟡 @IsOptional() -> indica que el campo "student" NO es obligatorio, esto se debe a que no todos los usuarios son estudiantes
    //    Solo cuando el rol es ESTUDIANTE necesitas el objeto "student", por eso en el DTO se define como opcional.
    // 👉 Si NO lo envían, NO pasa nada ✅
    // 👉 Si SI lo envían, entonces se aplican las demás validaciones ⬇️
    @IsOptional()
    // ✅ Le dice a nest; "si viene, ese objeto es de tipo StudentDto"
    // 🧬 @Type(() => Student Dto) -> le dice a class-transformer:
    // "Cuando llegue JSON desde el request,  transforma el campo 'student' como una instanca de StudentDto "
    // 👉 Esto es CLAVE para que @ValidateNested funcione bien, porque necesita una clase real, no solo un objeto plano
    // ✅ En resumen: JSON -> StudentDto (instancia) -> validación completa
    @Type(() => StudentDto)
    // ✅ Si viene "student", valida sus propiedades (dni, studentCode, etc)
    // 🧠 ValidateNested -> le dice a class-validator:
    // "Oye, este campo no es un string/number simple, es un OBJETO"
    // 👉 Entonces valida también lo que hay dentro del objeto StudentDt
    // ✅ Le dice a nest : "ese objeto es de tipo StudentDto" (dni, studentCode, sectionId)
    // ✅ Sin esto, podría no validar las reglas internas del StudentDto.
    @ValidateNested()
    // 🎓 Campo opcional:
    // - "student?" -> puede ser undefined (no venir) ✅
    // - ": StudentDto" -> si viene, debe tener la forma de StudentDto
    student? : StudentDto;



    // =========================================================
    // 👨‍🏫 TEACHER
    // =========================================================

    // ✅ Campo opcional
    // 👉 Solo será obligatorio en la lógica del servicio cuando roleName sea TEACHER
    @IsOptional()
    // ✅ Convierte el objeto plano del JSON en una instancia real de TeacherDto
    @Type(() => TeacherDto)
    // ✅ Valida también las reglas internas de TeacherDto
    @ValidateNested()
    teacher?: TeacherDto;




    // =========================================================
    // 👨‍👩‍👦 GUARDIAN
    // =========================================================

    //✅ Campo opcional
    // 👉 Solo será obligatorio en la lógica del servicio cuando roleName sea GUARDIAN
    @IsOptional()
    // ✅ Convierte el objeto plano del JSON en una instancia real de GuardianDto
    @Type(() => GuardianDto)
    // ✅ Valida también las reglas internas de GuardianDto
    @ValidateNested()
    guardian?: GuardianDto;

    // 🏫 SCHOOL ID

    // 👉 Representa el identificador único del colegio al que pertenecerá el usuario que estamos registrando
    // 🔥 Ejemplo: schoolId = "550e8400-e29b-41d4-a716-446655440000"
    // 📌 Este campo puede utilizarse para relacionar al usuario con un colegio específico dentro del sistema
    // 👉 Por ejemplo: Usuario -> schoolId -> Colegio
    // ⚠️ No todos los usuarios necesariamente necesitan un schooolId
    // 🔥 Por ejemplo: 
    // 👑 SYSTEM_ADMINISTRATOR 
    // 👉 Puede existir sin pertenecer a ningún colegio
    //
    // 👨‍💼 ADMINISTRADOR , 🧑‍🏫 TEACHER, 🎓 STUDENT , 🧑‍🧑‍🧒‍🧒 GUARDIAN
    // 👉 Normalmente estarán relacionados con un colegio
    //
    // 🟡 @IsOptional()
    // 👉 Indica que schoolId NO es obligatorio dentro del DTO
    //
    // ✅ Si NO se envía: class-validator simplemente ignora las demás validaciones
    // ✅ Si SI se envía : Entonces deberá cumplir con @IsUUID('4')
    @IsOptional()
    // 🆔 @IsUUID('4') -> Valida que schoolId tenga el formato de un UUID versión 4 válido
    // ✅ Ejemplo válido: "550e8400-e29b-41d4-a716-446655440000" 
    // ❌ Ejemplos inválidos: "123", "colegio-1", "abc123"
    // 📌 Si el valor enviando NO tiene un formato UUID v4 válido, NestJS devolverá el mensaje personalizado indicado abajo
    @IsUUID('4',{
        message: 'schoolId debe ser un UUID válido'
    })
    // 🏫 schoolId?: string
    // 👉 El signo ? significa que este campo puede no venir dentro del request
    // 👉 Si viene, deberá ser un String y además cumplir con la validación UUID anterior 
    schoolId?: string


}
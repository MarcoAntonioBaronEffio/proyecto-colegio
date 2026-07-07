import { Transform } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, isString, IsString, IsUrl, Matches, MaxLength } from "class-validator";
import { InstitutionType, LevelsOffered } from "src/entities/school.entity";

export class CreateSchoolDto{

    // 🏫 Nombre oficial del colegio
    // 👉 Elimina espacios al inicio y al final antes de validar o guardar
    @Transform(({ value }) => value?.trim())
    // 👉 Obliga a que el nombre sea enviado
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    // 👉 Verifica que el valor recibido sea una cadena de texto
    @IsString()
    // 👉 Limita el nombre a un máximo de 150 caracteres
    @MaxLength(150,{
        message: 'El nombre no puede superar los 150 caracteres'
    })
    // 👉 El operador "!" indica a TypeScript que esta propiedad será inicializada durante el proceso de validación y creación del Dto
    name!: string;







    // 🔑 Código interno del colegio
    // 👉 Elimina espacios y convierte el código a MAYÚSCULAS para mantener un formato uniforme en toda la aplicación
    @Transform(( { value }) => value?.trim().toUpperCase())
    // 👉 El código es obligatorio
    @IsNotEmpty({ message: 'El código es obligatorio' })
    // 👉 Debe ser una cadena de texto
    @IsString()
    // 👉 Máximo de 50 caracteres
    @MaxLength(50,{
        message: 'El código no puede superar los 50 caracteres'
    })
    code!: string;






    // 🧾 RUC del colegio
    // 👉 Es opcional; algunos colegios podrían registrarse sin este dato
    @IsOptional()
    // 👉 Debe contener exactamente 11 dígitos numéricos
    @Matches(/^\d{11}$/,{
        message: 'El RUC debe contener exactamente 11 dígitos'
    })
    ruc?: string;






    // 📍 Dirección del colegio
    // 👉 Elimina espacios innecesarios
    @Transform(({value}) => value?.trim())
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Debe ser texto
    @IsString()
    address?: string;




    // 📞 Teléfono institucional
    // 👉 Elimina espacios al inicio y al final
    @Transform(({value}) => value?.trim())
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Debe ser texto
    @IsString()
    // 👉 Debe ser un número de celular peruano (9 dígiyos y empezar con 9)
    @Matches(/^9\d{8}$/,{
        message: 'El teléfono debe ser un número peruano válido de 9 dígitos'
    })
    phone?: string;






    // 📧 Correo institucional
    // 👉 Elimina espacios y convierte el correo a minúsculas, ya que los correos normalmente se almacenan en ese formato
    @Transform(({value}) => value?.trim().toLowerCase())
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Verifica que tenga un formato válido de correo electrónico
    @IsEmail({}, {
        message: 'Correo institucional inválido'
    })
    email?: string;






    // 👨‍🏫 Nombre del director(a)
    // 👉 Elimina espacios sobrantes
    @Transform(({value}) => value?.trim())
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Debe ser texto
    @IsString()
    // 👉 Limita la longitud del nombre
    @MaxLength(150,{
        message: 'El nombre de director no puede superar los 150 caracteres'
    })
    directorName?: string;





    // 🖼️ URL del logo institucional
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Verifica que sea una URL válida
    @IsUrl({},{
        message: 'La URL del logo no es válida'
    })
    logoUrl?: string;




    // 🏞️ URL de la imagen de portada
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Debe contener una URL válida
    @IsUrl({},{
        message: 'La URL de la portada no es válida'
    })
    coverImageUrl?: string;




    // 🇵🇪 Departamento donde se ubica el colegio
    // 👉 Elimina espacios sobrantes
    @Transform(({value}) => value?.trim())
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Debe ser texto
    @IsString()
    // 👉 Máximo de 80 caracteres
    @MaxLength(80,{
        message: 'El departamento no puede superar los 80 caracteres'
    })
    department?: string;





    // 🏙️ Provincia donde se ubica el colegio
    // 👉 Elimina espacios sobrantes
    @Transform(({value}) => value?.trim())
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Debe ser texto
    @IsString()
    // 👉 Máximo de 80 caracteres
    @MaxLength(80,{
        message: 'La provincia no puede superar los 80 caracteres'
    })
    province?: string;






    // 🏘️ Distrito donde se ubica el colegio
    // 👉 Elimina espacios sobrantes
    @Transform(({value}) => value?.trim())
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Debe ser texto
    @IsString()
    // 👉 Máximo de 80 caracteres
    @MaxLength(80,{
        message: 'El distrito no puede superar los 80 caracteres'
    })
    district?: string;






    // 🏛️ Tipo de institución educativa
    // 👉 Este dato es obligatorio
    @IsNotEmpty({
        message: 'El tipo de institución es obligatorio'})
    // 👉 Solo acepta uno de los valores definidos dentro del enum InstitutionType
    @IsEnum(InstitutionType,{
        message: 'Tipo de institución no válido'})
    institutionType!: InstitutionType;
    
    
    
    
    // 🎓 Niveles educativos que ofrece el colegio
    // 👉 Este dato es obligatorio
    @IsNotEmpty({
        message: 'Los niveles ofrecidos son obligatorios '
    })
    // 👉 Solo permite valores definidos en el enum LevelsOffered
    @IsEnum(LevelsOffered,{
        message: 'Nivel educativo no válido'
    })
    levelsOffered!: LevelsOffered;


 
    // 📅 Fecha de fundación del colegio
    // 👉 Campo opcional
    @IsOptional()
    // 👉 Debe recibirse en formato ISO 8601 (YYYY-MM-DD)
    @IsDateString({},{
        message: 'La fecha de fundación no es válida'
    })
    foundationDate?: string;
}
import { Transform } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, isString, IsString, IsUrl, Matches, MaxLength } from "class-validator";
import { InstitutionType, LevelsOffered } from "src/entities/school.entity";

export class CreateSchoolDto{

    // 🏫 Nombre oficial
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @IsString()
    @MaxLength(150,{
        message: 'El nombre no puede superar los 150 caracteres'
    })
    name!: string;

    // 🔑 Código interno
    @Transform(( { value }) => value?.trim().toUpperCase())
    @IsNotEmpty({ message: 'El código es obligatorio' })
    @IsString()
    @MaxLength(50,{
        message: 'El código no puede superar los 50 caracteres'
    })
    code!: string;

    // 🧾 RUC
    @IsOptional()
    @Matches(/^\d{11}$/,{
        message: 'El RUC debe contener exactamente 11 dígitos'
    })
    ruc?: string;

    // 📍 Dirección
    @Transform(({value}) => value?.trim())
    @IsOptional()
    @IsString()
    address?: string;

    // 📞 Teléfono
    @Transform(({value}) => value?.trim())
    @IsOptional()
    @IsString()
    @MaxLength(20, {
        message: 'El teléfono no puede superar los 20 caracteres'
    }
    )
    phone?: string;

    // 📧 Correo institucional
    @Transform(({value}) => value?.trim().toLowerCase())
    @IsOptional()
    @IsEmail({}, {
        message: 'Correo institucional inválido'
    })
    email?: string;

    // 👨‍🏫 Director
    @Transform(({value}) => value?.trim())
    @IsOptional()
    @IsString()
    @MaxLength(150,{
        message: 'El nombre de director no puede superar los 150 caracteres'
    })
    directorName?: string;

    // 🖼️ Logo
    @IsOptional()
    @IsUrl({},{
        message: 'La URL del logo no es válida'
    })
    logoUrl?: string;

    // 🏞️ Portada
    @IsOptional()
    @IsUrl({},{
        message: 'La URL de la portada no es válida'
    })
    coverImageUrl?: string;

    // 🇵🇪 Departamento
    @Transform(({value}) => value?.trim())
    @IsOptional()
    @IsString()
    @MaxLength(80,{
        message: 'El departamento no puede superar los 80 caracteres'
    })
    department?: string;

    // 🏙️ Provincia
    @Transform(({value}) => value?.trim())
    @IsOptional()
    @IsString()
    @MaxLength(80,{
        message: 'La provincia no puede superar los 80 caracteres'
    })
    province?: string;

    // 🧾 Distrito
    @Transform(({value}) => value?.trim())
    @IsOptional()
    @IsString()
    @MaxLength(80,{
        message: 'El distrito no puede superar los 80 caracteres'
    })
    district?: string;

    // 🏛️ Tipo de institución
    @IsNotEmpty({
        message: 'El tipo de institución es obligatorio'
    })
    @IsEnum(InstitutionType,{
        message: 'Tipo de institución no válido'
    })
    institutionType!: InstitutionType;

    // 🎓 Niveles ofrecidos
    @IsNotEmpty({
        message: 'Los niveles ofrecidos son obligatorios '
    })
    @IsEnum(LevelsOffered,{
        message: 'Nivel educativo no válido'
    })
    levelsOffered!: LevelsOffered;

    // 📅 Fundación
    @IsOptional()
    @IsDateString({},{
        message: 'La fecha de fundación no es válida'
    })
    foundationDate?: string;
}
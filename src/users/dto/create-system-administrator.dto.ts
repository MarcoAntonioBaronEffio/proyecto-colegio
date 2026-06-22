import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SystemAdministratorDto{

    // 📄 Tipo de documento de identidad
    // 👉 Campo obligatorio
    // 👉 Solo acepta valores definidos en el enum DocumentType
    // 🔹 Ejemplos válidos: DNI , PASSPORT , CE, PPT
    @IsNotEmpty({
        message: 'El tipo de documento es obligatorio'
    })
    @IsEnum(DocumentType,{
        message: 'Tipo de documento no válido'
    })
    documentType!: DocumentType;



    // 🔢 Número de documento de identidad
    // 👉 Se eliminan espacios al inicio y al final automáticamente
    // 👉 Campo obligatorio 
    // 👉 Máximo 20 caracteres

    // 🔹 Ejemplos: 74432504 , ABC123456
    @Transform(({value}) => 
        typeof value === 'string'
        ? value.trim()
        : value
    )
    @IsNotEmpty({
        message: 'El número de documento es obligatorio'
    })
    @IsString({
        message: 'El número de documento debe ser texto'
    })
    @MaxLength(20, {
        message: 'El número de documento no puede superar 20 caracteres'
    })
    documentNumber!: string;

}
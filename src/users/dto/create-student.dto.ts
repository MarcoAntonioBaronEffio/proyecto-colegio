import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, Matches } from "class-validator";


// 🧩 Declaramos una clase llamada StudentDto
// ✅ Este DTO representa el sub-objeto "student" que puede venir dentro de RegisterDto cuando el rol es STUDENT
// ✅ Aquí definimos y validamos únicamente los campos propios del estudiante
export class StudentDto{

    // 📌 Antes de validar el campo dni, aplicamos una transformación con class-transformer
    @Transform(({value}) =>
        // 🔎 Verificamos si el valor recibido realmente es un string
        typeof value === 'string'
            ? value.trim() // ✂️ Si es texto, quitamos espacios al inicio y al final, esto evita problemas como " 12345678 "
            : value) // ↩️ Si no es texto, devolvemos el valor tal como vino
    @IsNotEmpty({message : 'El DNI es obligatorio'})
    @IsString({message : 'El DNI debe ser texto'})
    // ✅ Validamos con una expresión regular que el DNI tenga exactamente 8 dígitos
    // 🔎 ^\d{8}$ significa: 
    //  - ^ => inicio del texto
    //  - \d{8} => exactamente 8 números
    //  - $ => fin del texto
    // ✅ Así evitamos letras, espacios, menos/más dígitos
    @Matches(/^\d{8}$/, { message: 'El DNI debe tener exactamente 8 dígitos' })
    dni : string;

    @Transform(({value}) =>
        typeof value === 'string'
            ? value.trim()
            : value)
    @IsNotEmpty({message : 'El studentCode es obligatorio'})
    @IsString({message : 'El studentCode no puede superar 30 caracteres'})
    studentCode : string;

}

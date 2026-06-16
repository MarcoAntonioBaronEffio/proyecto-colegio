
// 🏫 Exportamos la clase CreateClassroomDto
// 👉 Estos decoradores nos ayudan a validar automáticamente los datos

import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Min , Max, MaxLength, IsOptional} from "class-validator";

// 👉 Antes de que lleguen a la lógica del servicio
export class CreateClassroomDto{

    // 🏷️ Nombre del aula

    // 🔤 Validamos que sea texto
    @IsString()
    // 🚫 No puede estar vacío
    @IsNotEmpty()
    // ✂️ Máximo 100 caracteres
    @MaxLength(100)
    // 🏫 Nombre visible del aula
    // 👉 Ejemplo: "Aula 101"
    name! : string;


    /* --------------------------------------*/

    // 🔢 Código de aula
    
    // 🔤 Debe ser texto
    @IsString()
    // 🚫 No vacío
    @IsNotEmpty()
    // ✂️ Máximo 10 caracteres
    @MaxLength(10)

     // 🧾 Código interno
     // 👉 Ejemplo: A101 , LAB01
     code! : string;


    /* --------------------------------------*/

    // 📝 Descripción

    // 🔤 Debe ser texto
    @IsString()
    // 🟡 Campo opcional
    // 👉 El cliente puede enviarlo o no
    @IsOptional()
    // ✂️ Máximo 255 caracteres
    @MaxLength(255)
    // 📝 Descripción del aula
    // 👉 Ejemplo: "Ubicado en el segundo piso"
    description? : string;


    /* --------------------------------------*/

    // 👥 Capacidad

    // 🔄 Convierte automáticamente
    // 👉 "30" -> 30
    @Type(() => Number)
    // 🔢 Debe ser entero
    @IsInt()
    // 📉 Mínimo 1
    @Min(1)
    // 📈 Máximo 100
    @Max(100)
    // 👥 Capacidad máxima
    capacity! : number;


    /* --------------------------------------*/

    // 🏢 Piso

    // 🔄 Convierte automáticamente
    // 👉 "2" -> 2
    @Type(() => Number)

    // 🔢 Debe ser entero
    @IsInt()
    // 📉 Piso mínimo
    @Min(1)
    // 📈 Piso máximo
    @Max(10)
    // 🏢 Piso del aula
    floor!: number;
}

// 🏫 Exportamos la clase CreateClassroomDto
// 👉 Estos decoradores nos ayudan a validar automáticamente los datos

import { IsInt, IsNotEmpty, IsString, Min , Max, MaxLength} from "class-validator";

// 👉 Antes de que lleguen a la lógica del servicio
export class CreateClassroomDto{

 
    
    // 🔤 Validamos que name sea de tipo texto
    // 👉 El nombre del aula debe ser un string
    @IsString()
    // 🚫 Validamos que el nombre no esté vacío
    // 👉 Asi evitamos registrar un aula sin nombr
    @IsNotEmpty()
    // ✂️ Permitimos como máximo 100 caracteres
    @MaxLength(100)
    // 🏷️ Propiedad que almacenará el nombre visible del aula
    // 👉 Ejemplo: "Aula 101"
    name : string;



    // 🔠 Validamos que code sea un texto
    // 👉 El código interno también debe llegar como string
    @IsString()
    // 🚫 Validamos que el código no esté vacío
    // 👉 Asi evitamos registrar aulas sin código identificador
    @IsNotEmpty()
    // ✂️ Permitimos como máximo 10 caracteres
    @MaxLength(10)
    // 🧾 Propiedad donde guardaremos el código interno del aula
    // 👉 Ejemplo: "A101"
    code : string;

 
    // 🔢 Validamos que capacity sea un número entero
    // 👉 No puede ser texto, decimal ni otro tipo de dato
    @IsInt()

    // 📉 Indicamos que el valor mínimo permitido es 1 
    // 👉 No tendría sentido una capacidad de 0 o negativo
    @Min(1)

    // 📈 Indicamos que el valor máximo permitido es 100
    // 👉 Esto sirve para evitar registrar capacidades exageradas o absurdas
    @Max(100)

    // 👥 Propiedad que representa la capacidad máxima del aula
    // 👉 Es decir, cuántos estudiantes puede soportar como máximo
    capacity: number;
 
    // 🔢 Validamos que floor sea un número entero
    // 👉 El piso debe expresarse con un número entero
    @IsInt()
    // 🏢 Definimos que el piso mínimo permitido será 1
    // 👉 Así evitamos valores como 0 o negativos
    @Min(1)
    // 🏙️ Definimos que el piso máximo permitido será 10
    // 👉 Esto ayuda a mantener datos razonables dentro del sistema
    @Max(10)
    // 🏢 Propiedad que almacenará el piso donde está ubicada el aula
    // 👉 Ejemplo: 1, 2, 3, etc.
    floor: number;
  

}
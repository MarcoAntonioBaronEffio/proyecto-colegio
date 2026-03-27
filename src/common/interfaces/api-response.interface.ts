// 🔹 export:
// 👉🏼 Permite exportar esta interfaz para usarla en otros archivos del proyecto.
// Por ejemplo, podríamos importarla en nuestro controller.

// 🔹 interface:
// 👉🏼 Palabra clave de TypeScript que define una estructura o contrato.
// Es decir, describe cómo debe verse un objeto, qué propiedades tiene y de qué tipo son.

// 🔹 ApiResponse:
// 👉🏼 Es el nombre de la interfaz, y por convención en TypeScript se escriben en PascalCase (primera letra mayúscula)

// 🔹 <T>
// 👉🏼 Significa que ApiResponse puede usarse con cualquier tipo de dato dentro de data.
// Por ejemplo: 
// - ApiResponse<Alumno[] : si devuelve una lista de alumnos.
// - ApiResponse<Alumno> : si devuelve un solo alumno.
// - ApiResponse<string> : si devuelve solo un mensaje
// 💡 En otras palabras, T es una variable de tipo que se reemplazará dinámicamente.
export interface ApiResponse<T>{
    // success es una propiedad que indica si la operación fue exitosa o no.
    // su tipo es boolean : solo puede ser true o false.
    success : boolean; 

    // message representa un texto descriptivo de lo que pasó
    // su tipo es string , ejemplo => "message" : "Listado de alumnos obtenido correctamente"
    message : string;  

    // data es la parte dinámica del resultado
    // su tipo no está fijo, sino que depende del tipo de le pases a la interfaz (T)
    // null: Ahora permite null.
    data : T | null;
}

// ✅ Así ApiResponse<T> se adapta a cualquier tipo de contenido que devuelva tu API.  
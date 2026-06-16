// 📦 Importamos SetMetadata desde NestJS
// 👉 Viene del core de NestJS (@nestjs/common)

// 🧠 ¿Qué es SetMetadata?
// 🔹 Es una función que permite "adjuntar información extra" (metadata) a clases o métodos (controller o endpoints)
// 🔥 Esa metadata NO afecta la ejecución directa del código, pero sí puede ser LEIDA después por otros componentes como:
// - Guards 🛡️
// - Interceptors 🔄
// - Pipes 🧪

// 💡 Es como ponerle una "etiqueta invisible" a un endpoint

// 🧠 ¿Qué es "METADATA?
// 👉 Metadata = "información adicional" que le colocas a algo
// 👉 En este caso: a un endpoint
// 🔥 Ejemplo mental: 
// @Public()
// login()
// 👉 Eso NO cambia la lógica del método
// 👉 Solo le agrega una "etiqueta invisible"
import { SetMetadata } from "@nestjs/common";


// 🧩 CREAMOS NUESTRO DECORADOR PERSONALIZADO 
// ⭐️ SetMetadata NO crea solo el objeto
// ⭐️ SetMetadata CREA el DECORADOR completo
// 👉 Aqui estamos creando un DECORADOR llamado @Public()
// 👉 Y ese decorador, cuando se usa: guarda metadata : {isPublic: true}

// 🧠 SEPARA ESTO EN TU CABEZA
// 🧩 1. @Public() -> Es el decorador (lo que usas en el endpoint)
// 🧩 2. {isPublic : true} -> Es la METADATA (la información que se guarda)

// 👉 ¿Ni bien pones @Public ya se agrega la metadata?
// 👉 Si, en el momento que Nest procesa el decorador

// ⭐️ IMPORTANTE la metadata solo se CREA cuando usamos el decorador @Public
// 👉 ejemplo:
// @Public()
// @Post('login')
// login
// 👉 AHI recién NEST hace: 
/* 
        metadata = {
            isPublic : true     
        }
    
*/

export const Public = () => 
    
    // 🔥 SetMetadata(clave, valor)
    // 👉 clave: nombre de la metadata
    // 👉 valor: lo que quieres guardar
    SetMetadata('isPublic', true);

// 🧠 ¿Qué significa esto?
// 👉 Estas diciendo:
// 🔥 "A este endpoint agrégale una etiqueta que diga: isPublic = true"

// 👉 Internamente Nest guarda algo asi:
/* 
    {
        handler: login, 
        metadata: { isPublic: true }
    }

*/

// 🧠 ¿Quién usa esa metadata?
// 👉 Tu AuthGuard 👈
// 🔥 Aquí es donde TODO se conecta
// 🔹 Ejemplo dentro de tu guard:
// const isPublic = this.reflector.getAllAndOverride<booelean>(
//      'isPublic',
//      [context.getHandler(), context.getClass()]
//);

// 🧠 Traducción de esa línea (clave)
// 👉 "Oye Nest..."
// 🔍 Busca en el endpoint (handler)
// 🔍 O en el controller (class)
// 👉 Si existe metadata llamada 'isPublic'


// 🧠 Flujo completo (importante)
// 1️⃣ Llega request
// 👉 POST /login
// 2️⃣ Se ejecuta AuthGuard
// 3️⃣ El guard hace: const isPublic = true; <- Porque encontró @Public()
// 4️⃣ Entonces: 
/* 
    if(isPublic){
        return true; // ✅ Deja pasar SIN JWT
    }
*/
// 5️⃣ Si NO tiene @Public()
// 👉 isPublic = false
// 👉 Entonces: exige token JWT

// 🔥 Diferencia importante
// @Public() 👉 No necesito autenticación
// @UseGuards(AuthGuard('jwt))
// 👉 "Protege este endpoint"
// @Roles('ADMINISTRATOR)
// 👉 "Restringe por rol" 
 

// 🟣 3. public.decorators.ts
// 👉 Este es el PASE LIBRE 🟢
// Qué hace: 
// - Marca rutas como públicas
// Ejemplo:
// 🔹 @Public()
// 🔹 @Post('login')
// 💡 En simple: ‼️ "Aquí no revisamos token"
// ✅ Importamos ExecutionContext e Injectable desde NestJS
// ⭐️ ExecutionContext -> representa el contexto de la request (request, handler, controller)
// 🔹 En otras palabras es una caja que contiene TODO sobre la petición que está entrando
// 📦 Imagínalo asi: Cuando llega una request: 

// GET /school-year
// Authorization: Bearer abc123
// 🔹 Nest crea un objeto (ExecutionContext) que tiene:
/* 
    {
        request,    // 📤 datos HTTP (headers, body, user, etc)
        handler,    // 🎯 función que se ejecutará (endpoint)
        controller  // 🏫 clase donde está ese endpoint
    }
*/
// 🔍 Qué significa cada cosa
// 🟢 1 context.getHandler()
// 👉 Te da el endpoint exacto
// Ejemplo:
// @Get()
// findAll()
// 👉 Ese findAll es el handler
// 💡 Traducción: 🎯 ¿Qué función se va a ejecutar?

// -------------------------------------------------------

// 🔵 2 context.getClass()
// 👉 Te da el controller completo
// 🔹 Ejemplo
// @Controller('school-year)
// export class SchoolYearController{}
// 💡 Traducción: 🏫 "¿En qué clase está ese endpoint?" en este caso nos devuelve "SchoolYearController"

// -------------------------------------------------------


// 🟠 3.- context.switchToHttp().getRequest()
// 👉 Te da el request real de la petición HTTP, datos de la petición
// 💡 ¿Qué significa esto?
// 🎯 "Dame todo lo que el cliente está enviando a esta petición"
// 🧠 Paso a paso 
// 🔹 context.switchToHttp() -> cambiar a HTTP
// 👉 Le dice a Nest:
// 🗣️ "Oye ... esta petición es HTTP (no WebSocket, no GraphQL")
// 🔹 getRequest()
// 👉 Ahora si:
// 🗣️ "Dame el objeto request"

// 📦 ¿Qué contiene request? Aqui está lo importante
// 🟡 request.headers -> 👉 Cabecera de la petición: request.headers.authorization
// 💡 Ejemplo: Authorization: Bearer eyJhbGciOiJIUzI1Ni...
// 🔵 request.body -> 👉 Datos enviados por el cliente 
// 💡 Ejemplo: { "email" : "test@test.com", "password": "123456" }
// 🔴 request.user -> 👉 Aqui está la magia: request.user
// 💡 Esto NO viene del cliente directamente -> 👉 Lo agrega tu JWTStrategy
// 🧠 ¿De dónde sale request.user? Cuando usamos @UserGuards(JwtAuthGuard)
// 👉 Pasa esto:
// 1.- El guard valida el token
// 2.- JwtStrategy decodifica el JWT
// 3.- Nest guarda el paylaod aquí 👇
// 🔹 request.user = payload
// 🔥 Ejemplo real
// Si tu JWT tiene: { "sub":123", "email":"admin@test.com", "role": "ADMINISTRATOR" }
// 👉 Entonces esto nos da la decodificación del token JWT (payload): request.user = { "sub":123", "email":"admin@test.com", "role": "ADMINISTRATOR" }
// 👉 El JWT se valida y se decodifica, se obtiene el payload y se guarda en request.user, con eso ya podemos obtener el rol.

// ⭐️ Injectable -> permite que esta clase sea gestionada por el sistema de inyección de dependencias
import { ExecutionContext , Injectable } from "@nestjs/common";

// 🧠 Reflector -> herramienta para leer metadata de decorators 
// 👉 Es como un "lector" de etiquetas que tú colocas en tus endpoint
// 👉 Tú decoras tus endpoints asi:
// @Public          @Roles('ADMIN)
// @Get             @Post
// findAll(){}      create(){}

// 🔥 El problema (@Public, @Roles) no hacen nada por sí solos
// 👉 Solo colocan una especio de etiqueta invisible(metadata)
// 🧩 Entonces entra Reflactor es una herramienta que LEE esas etiquetas (metadata)
import { Reflector } from "@nestjs/core";
 
// 🛡️ AuthGuard -> guard genérico 
// 🔥 ¿Y qué hace internamente? AuthGuard('jwt') hace todo esto automáticamente:
// 1️⃣ Lee el token del header: busca esto: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// 💡 Traducción: 👉 "A ver... ¿me mandaste un token?"
// 2️⃣ Ejecuta tu estrategia JWT. Aqui entre tu: JwtStrategy. 
// 💡 Traducción: 👉 "Voy a decodificar el token y validar si es correcto"
// 3️⃣ Si todo está bien -> 👉 Agrega esto al request
// request.user = { sub:"123", email: "admin@test.com", role: "ADMINISTRATOR"  }
 
// ⭐️ Guard es una clase que decide si una request puede continuar o no
// 💡 Es como un portero de discoteca 🚪
// - Si cumples las reglas -> ✅ pasas
// - Si no -> ❌ No entras
// 🎯 ¿Dónde actúa? El guard se ejecuta ANTES de que llegue a tu endpoint
// 🔥 Ejemplo real
// @UserGuard(JwtAuthGuard)
// @Get()
// findAll(){
     //return "Datos protegidos"
//}
// 🧠 ¿Qué pasa aquí?
// 1.- Llega la request
// 2.- 🛡️ El Guard se ejecuta
// 3.- Decide:
// ✅ true -> entra al endpoint
// ❌ false -> bloquea (error)
import { AuthGuard } from "@nestjs/passport";
 
// 🧩 Marcamos la clase como Injectable para que Nest pueda crearla automáticamente
// 👉 Extendemos AuthGuard('jwt')
// 🔥 Esto es clave: le decimos que use la estrategia  JWT que tú creaste
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
 
    // 🧠 Constructor donde inyectamos Reflactor
    // 👉 Lo usaremos para saber si una ruta es pública (@Public)
    constructor(private reflector: Reflector){
        // ⚙️ Llamamos al constructor del AuthGuard base
        // 👉 Esto asegura que passport funcione correctamente internamente
        
        // 🧠 ¿Qué es passport? es una librería de autenticación para Node.js
        // 🎯 Traducción simple: passport es un motor que se encarga de autenticar usuarios
        // 🧩 ¿Qué significa "autenticar"? , 👉 verificar: 
        // 🔐 ¿El token es válido? , 👤 ¿El usuario existe?, ⌛️ ¿El token no expiró?

        // 🔥 ¿Cómo funciona passport?, trabaja con algo llamado 🧠 Estrategias (strategies)
        // 🎯 Ejemplo JWT: AuthGuard('jwt')
        // 👉 Aquí estas usando la estrategia : 🧠 "jwt"
        // 💡 Traducción: 👉 Usa passport con la estrategia JWT para validar usuarios
        super();  
    }
 
    // 🛡️ Método Principal del guard, este es el corazón del guard
    // 👉 NestJS lo ejecuta AUTOMÁTICAMENTE antes de entrar a cualquier endpoint protegido
    // 👉 Aquí decides: ¿Dejo pasar la request o la bloqueo?
    
    // 🧠 ¿Qué es canActive? es un método que NestJs ejecuta antes de que tu endpoint (controller) se ejecute.
    // 👉 Es como un filtro de seguridad.
    // 🚦 ¿Qué hace exactamente?
    // 🔹 Este método debe retornar un valor booleano
    // ✅ true -> la request pasa y llega al controller
    // ❌ false -> la request se bloquea
    // 💥 o puede lanzar un error -> UnauthorizedException

    // ⭐️ context: ExecutionContext es un objeto especial de NestJS que representa todo el contexto de la ejecución,
    //   no solo la request
    // 🔥 ¿Qué contiene context?
    // 🔹 Piensa asi: 🧠 context = una caja con TODO, dentro tiene:
    // 📩 request, 📤 response, 🎯 handler (endpoint), 🏫 class (controller)
    // 🧠 Traducción simple:
    // 🔹 context -> contexto completo
    // 🔹 switchToHttp() -> "trabajamos con HTTP"
    // 🔹 getRequest() -> "dame la request"
    canActivate(context : ExecutionContext){
 
        // 🌎1️⃣ Revisamos si el endpoint es público (@Public)
        // 🧠 this.reflector:
        // 👉 Es el lector de la metadata
        // 👉 Sirve para saber si el endpoint tiene decoradores como @Public o @Roles

        // 🧠 getAllAndOverridle<boolean> -> es un método de Reflactor que:
        // 👉 Busca "metadata" llamada 'isPublic' en el método y si no está, la busca en el controller y dame la primera que encuentres.
        
        // 🔹 Entonces:
        // 👉 Primero revisa el método o función (endpoint)
        // 👉 Luego revisa el controller completo
        // 👉 Si encuentra un valor, lo devuelve (true o false)
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            'isPublic', // 🔑 Nombre de la metadata que tú definiste en tu decorator @Public()
            [
                // 🎯 context.getHandler()
                // 👉 Obtiene el método exacto que se ejecutará
                // 👉 Ejemplo: login(), register(), createUser()
                // 💡 Traducción:
                // 🎯 ¿Esta función específica tiene @Public?
                context.getHandler(),  

                // 🏫 context.getClass()
                // 👉 Obtiene el controller completo
                // 👉 Ejemplo: AuthController, UserController
                // 💡 Traducción:
                // 🏫 ¿Todo este controller es público?
                context.getClass(), 

                // ⭐️ Esto significa: 
                // 🥇 Primero revisa el método (por ejemplo login) eso es context.getHandler()
                // 🥈 Si no encuentra nada -> revisa el controller (por ejemplo AuthController) eso es getClass()
            ]
        );      
 
        // 🟢 Si es público -> dejamos pasar SIN validar token
        // 👉 Ejemplos tipicos: 
        // @Public()
        // @Post('login)
        // login(){}

        // 💡 Si isPublic = true
        // 👉 No se ejecuta JWT
        // 👉 No se valida token
        // 👉 Pasa directo al endpoint
        if(isPublic) return true; 

        // 🔐 Si NO es público -> ejecutamos validación JWT
        // 👉 Aquí entra en juego: 
        // 🧠 canActivate(context)
        // 👉 Esto activa AuthGuard('jwt') que tú extendiste, y delega a Passport (jwt.strategy)

        // 🔥 ¿Qué hace internamente esto?
        // 1️⃣ Busca el token en el header: Authorization: Bearer <token>

        // 2️⃣ Usa passport + JwtStrategy
        // 👉 Tu JwtStrategy se encarga de validar el token

        // 3️⃣ Si el token es válido:
        // 👉 Decodifica el payload del JWT
        // 👉 Ejemplo de payload:
        /**
            {
                sub: "123",
                email: "admin@test.com",
                role: "ADMINISTRATOR"
            }
         */

        // 4️⃣ Luego inyecta en:
        // 👉 request.user 🔥 (CLAVE)
        // 👉 Aqui ya puedes usar:
        // request.user.role
        // request.user.email

        // 5️⃣ Si el token es inválido o no existe:
        // ❌ Lanza automáticamente: UnauthorizedException (401)

        // 💡 Importante:
        // 👉 Tú NO manejas el error manualmente
        // 👉 Passport lo hace por ti
        return super.canActivate(context);
    }

 
}


// 🟡 1.- 🛡️ jwt-auth-guards.ts
// 🔹 Guard encargado de PROTEGER rutas en la aplicación

// 🧠 ¿Para qué sirve?
// 👉 Decide si la request debe ser validada o no (según si es pública o protegida)
// 👉 Si la ruta es protegida -> delega la validación del token a Passport (jwt-strategy)

// 🔐 Resultado de la validación:
// 👉 Si el token es correcto -> permite el acceso
// 👉 Si el token es inválido o no existe -> bloquea la request (401)

// 🧠 ¿Cuando se ejecuta?
// 👉 ANTES de que la request llegue al controller
// 👉 Actúa como un "filtro de seguridad"

// 🧠 ¿Cómo funciona?
// 1️⃣ Revisa si la ruta es pública (@Public)
// 👉 Si es pública -> NO valida token -> pasa directo

// 2️⃣ Si NO es pública:
// 👉 Llamamos a. super.canActivate(context)
// 👉 Esto activa AuthGuard('jwt') (Passport)
// 🧠 A partir de aqui:
// 👉 El guard DELEGA la validación a Passport

// 🔐 Passport se encarga de:
// 1️⃣ Leer el token del header: Authorization: Bearer <token>
// 2️⃣ Ejecutar JwtStrategy
// 3️⃣ Validar el token (firma, expiración, etc)
// 4️⃣ Decodificar el payload
// 5️⃣ Insertar el usuario en request.user 🔥
// 6️⃣ Lanzar error 401 si el token es inválido

// ❗️ Importante:
// 👉 JwtAuthGuard NO valida el token directamente
// 👉 Solo "decide" si debe validarse o no
// 👉 La validación real ocurre en JwtStrategy

// 🧠 ¿Dónde se usa?
// 👉 Se puede aplicar en:
// 🔹 Un endpoint específico -> @UseGuards(JwtAuthGuard)
// 🔹 Un controller completo -> protege todas sus rutas
// 🔹 Globalmente -> protege toda la aplicación

// 🧠 ¿Qué NO hace?
// ❌ No maneja lógica de negocio
// ❌ No modifica datos
// ❌ Solo decide si la request puede continuar o no

// 🧠 FRASE CLAVE:
// 🛡️ "El JwtAuthGuard" es el portero que valida el token antes de entrar al sistema
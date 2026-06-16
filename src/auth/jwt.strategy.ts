// ✅ Importamos utilidades de NestJS para declarar un provider inyectable
// 👉 @Injectable permite que Nest pueda crear esta clase automáticamente (inyección de dependencias)
import { Injectable } from "@nestjs/common"; 

// ✅ PassportStrategy es una CLASE ADAPTADORA que NestJS te da para trabajar con Passport
// 🧠 Passport = una librería externa (no es de Nest) que maneja autenticación (JWT, Google, Facebook, etc.).
// 👉 El problema: Passport es "genérico" y NestJS tiene su propio sistema (DI, providers, etc.)
// 🔥 Solución: Nest crea "PassportStrategy" para "conectar" ambos mundos.

// 🧠 ¿CUÁLES SON ESOS "DOS MUNDOS?

// 🌎 MUNDO 1: NESTJS
// 👉 NestJS es un framework backend estructurado
// 👉 Tiene su propio sistema interno:
// 🧩 Inyección de dependencias (DI)
// 👉 Usa @Injectable(), @Module(), providers, etc
// 🧩 Guards: por ejemplo AuthGuard('jwt) controla si una request pasa o no
// 🧩 ExecutionContext , maneja request, response, handler, controller
// 🧩 Decorators : @Controller, @Get ,@Post, @Roles, @Public , etc
// 🔥 Resumen : NestJS tiene su propia forma de trabajar


// 🌎 MUNDO 2: PASSPORT (librería externa)
// 👉 Passport NO es de NestJS
// 👉 Es una librería independiente de Node.js
// 🧠 Passport funciona asi:
// 1.- Define la estrategia (Strategy)
// 👉 JWT, Google, Facebook, etc.

// 2.- Valida autenticación
// 👉 Pero no sabe nada de NestJS

// ❌ Problema:
// 👉 Passport NO tiene: @Injectable(), DI (inyección de dependencias), Guards, ExecutionContext
// 🔥 Resumen: Passport funciona SOLO, fuera de NESTJS

// 💥 PROBLEMA REAL
// 👉 Tienes 2 sistemas diferentes:
//    Nest JS        ❌        Passport
// (estructura)             (autenticación)
// 👉 No se entienden directamente

// 🔥 SOLUCIÓN: PassportStrategy
// 👉 Nest crea PassportStrategy para hacer de "puente"
// 🔥 Traducción: "Voy a adaptar Passport para que funcione dentro de Nest"

// 🧠 ¿Qué hace este puente?
// 🔹 Cuando haces esto: 
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt')
// 👉 Estás diciendo:
// 🧩 "Usa la lógica de Passport (Strategy)"
// 🧩 "Pero intégrala dentro de NestJS"

// 🔁 AHORA TODO FUNCIONA JUNTO
// 👉 Flujo real:
// 1.- Llega request 
// 2.- Nest ejecuta AuthGuard('jwt') // 🧠 (mundo Nest)
// 3.- AuthGuard usa PassportStrategy // 🧠 (puente)
// 4.- Passport ejecuta Strategy   // 🧠 (mundo Passport)
// 5.- Se valida el token
// 6.- Nest recibe el resultado
// 7.- Se guarda en request.user

// 🔥 RESUMEN FINAL 
// 🧩 NestJS -> estructura (guards, DI, controllers)
// 🧩 Passport -> autenticación (validar JWT)
// 🧩 PassportStrategy -> los conecta

// ⭐️ Passport valida, Nest decide qué hacer con eso

import { PassportStrategy } from "@nestjs/passport"; 

// ✅ Importamos la estrategia JWT real y el extractor de tokens
// 👉 OJO: esto NO es de NestJS, viene de la librería externa passport-jwt
// 👉 Aqui está la lógica REAL de cómo se valida un token JWT

// 🧠 1. Strategy (EL MOTOR DE VALIDACIÓN)
// 👉 Strategy es una CLASE que ya viene implementada
// 👉 Contiene TODA la lógica interna para trabajar con JWT

// 🔥 ¿Qué hace internamente Strategy?
// Cuando llega una request protegida:

// 1️⃣ Busca el token (usando ExtractJwt)
// 2️⃣ Decodifica el token
// 3️⃣ Verifica la FIRMA (secret)
// 4️⃣ Verifica si está expirado
// 5️⃣ Si TODO está bien -> llama a validate()

// 💡 O sea:
// 👉 Strategy ya hace TODO el trabajo pesado por ti
// 🔥 IMPORTANTE
// 👉 Tú NO validas manualmente el token
// 👉 Strategy lo hace automáticamente cuando configuras: super ({jwtFromRequest, secretOrKey, ignoreExpiration})

// 🧠 EJEMPLO MENTAL DE Strategy
// Imagina que llega esto.
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
// Strategy hace internamente:
// ✔️ Extraer token
// ✔️ Verificar firma con tu JWT_SECRET
// ✔️ Verificar expiración
// ✔️ Decodificar payload

// 👉 Si falla algo:
// ❌ lanza error automáticamente (401 Unauthorized)

// 👉 Si todo está bien:
// ✅ llama a validate(payload)

//--------------------------------------------------------------------------------

// 🧠 2. ExtractJwt (De donde sale el token)
// 👉 Extract es un "helper"
// 👉 Sirve para decirle a Strategy: "🔥 Oye, ¿de dónde saco el token?"
// 🧠 CASO MÁS USADO (EL TUYO) : ExtractJwt.fromAuthHeaderAsBearerToken();
// Busca en el header:
// Authorization: Bearer <token>



import {Strategy , ExtractJwt} from "passport-jwt";
 
// 🧩 Definimos el tipo del payload del JWT
// 👉 Esto representa EXACTAMENTE lo que tú guardas cuando firmas el token
// 👉 Sirve para tener tipado fuerte en el método validate()
type JwtPayload = {
    sub : string;   // 🔹 ID del usuario (subject)
    email : string; // 🔹 correo del usuario
    roleName : string; // 🔹 rol del usuario (si lo agregas al firmar)
}

// ✅ Marcamos la clase como inyectable
// 👉 Nest podrá usar esta clase automáticamente dentro del sistema de autenticación
@Injectable()
 
// ✅ Extendemos PassportStrategy con Strategy (JWT)
// 👉 'jwt' = nombre de la estrategia
// 👉 Esto conecta directamente con AuthGuard('jwt')
// 🔥 Traducción: "Cuando alguien use AuthGuard('jwt'), usa ESTE clase para validar el token"
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){ 

    // 🧠 CONSTRUCTOR -> CONFIRMA cómo se valida el token
     constructor(){
       
        // 🔥 super(...) inicializa la estrategia JWT
        // 👉 Aqui defines TODAS las reglas de validación del token
        super({ 

            // 🔹 ¿De dónde se obtiene el token?
            // 👉 Del header:
            // Authorization: Bearer <token>
            // 💡 Passport automáticamente lo extrae usando esta función
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(), 
            
            // 🔹 ¿Aceptamos tokens expirados?
            // 👉 false = NO (recomendado en producción)
            // 👉 true = aceptaría tokens vencidos (NO recomendado)
            ignoreExpiration : false, 
            
            // 🔹 Clave secreta para validar la firma del token
            // 👉 Debe ser EXACTAMENTE la misma que usaste al crear el JWT
            // 👉 Ejemplo en tu AuthService: sign(payload, {secret: JWT_SECRET})
            // ⚠️ Si no coincide -> el token será inválido
            secretOrKey : process.env.JWT_SECRET as string, 

            // 🧠 IMPORTANTE:
            // 👉 Si el token pasa todas las validaciones (firma + expiración)
            // 👉 Passport continuará y ejecutará el método validate()
        });
    }

 
    // ✅ Método clave -> validate()
    // 👉 Este método se ejecuta automáticamente cuando el token es válido

    // 🧠 ¿Qué recibe?
    // 👉 El payload ya:
    // 🔐 validado (firma correcta)
    // ⌛️ verificado (no expirado)
    // 📦 decodificado

    // 🔥 IMPORTANTE:
    // 👉 Aqui ya NO estás validando el token
    // 👉 Eso YA lo hizo Passport antes

    // 🧠 Este método sirve para:
    // 👉 Decidir qué datos quieres guardar en request.user
    async validate (payload : JwtPayload){

        // 🧠 payload contiene lo que tú firmaste en el JWT
        // 👉 Ejemplo:
        /* 
            sub: "123",
            email : "admin@test.com",
            roleName : "ADMINISTRATOR"
        */

        // 🔥 Lo que retornes aqui:
        // 👉 se guarda automáticamente en: request.user

        // 💡 Ejemplo final:
        /* 
            request.user ) {
                sub: "123",
                email : "admin@test.com",
                roleName: "ADMINISTRATOR"
            }
        */

        // 🔥 PREGUNTA CLAVE:
        // 👉 ¿Quién recibe esto?
        // 👉 Si el token es válido esto lo recibe automáticamente NestJs y lo guarda en: request.user
        // ⭐️ Passport toma este return y se lo asigna automáticamente a: request.user
        // 🧠 Resultado final: En cualquier controller o guard tendrás:
        /* 
            request.user = {
                sub: "123",
                email: "admin@test.com",
                roleName: "ADMINISTRATOR"
            }
        */
        return {
            sub: payload.sub,
            email : payload.email,
            roleName : payload.roleName
        };

        
    }
}

// 🔵 2. jwt.strategy.ts
// 👉 Este es el VERIFICADOR del token 🧠
// Qué hace
// - Toma el token
// - Lo decodifica
// - Verifica que sea válido
// - Extrae datos (userId, role, email)
// 💡 En simple: ❗️ ¿El token es real o fake?
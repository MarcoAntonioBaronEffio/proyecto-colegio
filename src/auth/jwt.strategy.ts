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
import { JwtPayload } from "./types/jwt-payload-type";
 
// 🧩 El tipo JwtPayload se encuentra definido en un archivo independientemente
// 👉 Define la estructura (molde) de los datos que se almacenan dentro del JWT
// 👉 No contiene datos reales; únicamente describe qué propiedades tendrá el payload cuando el token sea generado y posteriormente validado
//
// 💡 Ejemplo de estructura:
/* 
    {
        sub : string;
        email : string;
        roleId : string;
        roleName : string;
        schoolId : string;
    }
*/


// ✅ Marcamos la clase como inyectable
// 👉 NestJS podrá crear e inyectar automáticamente una instancia de esta estrategia dentro del sistema de autenticación
@Injectable()
 
// ✅ Extendemos PassportStrategy utilizando la estrategia JWT
// 👉 'jwt' es el nombre de la estrategia
// 👉 Esto la conecta directamente con AuthGuard('jwt')
//
// 💡 Traducción: "Cuando una ruta utilice AuthGuard('jwt'), Passport usará esta clase para validar el token.
// 🧠 Flujo general: JWT -> AuthGuard('jwt) -> JwtStrategy -> validate() -> request.user
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){ 

    // 🧠 Constructor de la estrategia JWT
    // 👉 Aquí configuramos las reglas que Passport utilizará para validar los tokens recibidos en las peticiones
    constructor(){
       
        // 🔥 super(...) inicializa la estrategia JWT
        // 👉 Todas las opciones definidas aquí serán utilizadas por Passport para autenticar el token
        super({ 

            // 🔹 ¿De dónde se obtiene el token?
            // 👉 Del header - encabezado:
            // Authorization: Bearer <token>
            // 💡 Passport extraerá automáticamente el token desde dicho header
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(), 
            
            // 🔹 ¿Se permiten tokens expirados?
            // 👉 false = NO (recomendado en producción)
            // 👉 true = aceptaría tokens vencidos (NO recomendado)
            ignoreExpiration : false, 
            
            // 🔹 Clave secreta utilizada para verificar la firma del JWT
            // 👉 Debe coincidir exactamente con la clave utilizada por JwtModule al momento de firmar los tokens
            // 👉 Ejemplo de firma: return await this.jwt.signAsync(payload)
            //
            // 💡 Aunque aquí no veas el secret, JwtService utiliza internamente la configuración registrada en JwtModule
            // 🔹 Si la clave usada para verificar y la clave usada para firmar no conciden: ❌ El token será rechazado
            secretOrKey : process.env.JWT_SECRET as string, 

            // 🧠 Si el token:
            // ✅ Tiene una firma válida
            // ✅ No está expirado
            //
            // 🔹 Passport ejecutará automáticamente el método: validate(payload)
        });
    }

 
    // ✅ Método clave -> validate()
    // 👉 Este método se ejecuta automáticamente después de que Passport haya validado correctamente el JWT.
    // 
    // 🔹 Verifica la firma del token
    // 🔹 Verifica que no esté expirado
    // 🔹 Decodifica el payload
    //
    // ⚠️ IMPORTANTE:
    // 🔹 En este punto NO estás validando el token
    // 🔹 Passport ya hizo todo ese trabajo antes de llegar aquí
    //
    // 🧠 ¿Qué recibe?
    // 👉 Recibe un payload que fue firmado al generar el JWT
    // 👉 Su "estructura" está definida por el tipo JwtPayload
    //
    // 🔹 Ejemplo:
    /*
        {
            "sub" : "123",
            "email" : "admin@test.com",
            "roleId" : "456",
            "roleName" : "ADMINISTRATOR",
            "schoolId" : "789"
        }
    */

    // 👉 
    async validate (payload : JwtPayload) {

        // 🔥 Todo lo que retornes aquí será asignado automáticamente a request.user por Passport.
        // 🔹 Como nuestro payload ya contiene exactamente los datos que queremos tener disponibles durante la petición, 
        //    simplemente lo retornamos completo.
        // 
        // 👉 Resultado:
        /*
        
            request.user = {
                sub : "123",
                email : "admin@test.com",
                roleId : "456",
                roleName : "ADMINISTRATOR",
                schoolId : "789"
            }

            // 🏫 Nota: 
            // 👉 schoolId puede ser undefined cuando el usuario es SYSTEM_ADMINISTRATOR, ya que no pertecene a ningún colegio.
         */
        return payload
 
        
    }
}

// 🔵 2. jwt.strategy.ts
// 👉 Estrategia JWT utilizada por Passport para autenticar usuarios.
//
// 🧠 ¿Qué hace?
// ✅ Obtiene el token desde el header Authorization
// ✅ Verifica la firma del JWT
// ✅ Verifica que el token no esté expirado
// ✅ Decodifica el payload
// ✅ Extrae la información del usuario
// ✅ Construye el objeto que terminará en request.user
//
// 💡 En palabras simples:
// 👉 Se encarga de responder: ¿Este token es válido y a qué usuario pertenece?

// 🔥 Si el token es inválido
// ❌ La petición será rechazada automáticamente

// 🔥 Si el token el válido
// ✅ Se ejecutará el método validate()
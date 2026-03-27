// ✅ Importamos utilidades de NestJS para declarar un provider inyectable
import { Injectable } from "@nestjs/common";
// ✅ PassportStrategy es el adaptador de Nest para estrategias de Passport
import { PassportStrategy } from "@nestjs/passport";
// ✅ Importamos la ESTRATEGIA concreta (Strategy) y el extractor de tokens (ExtractJwt)
// ¡OJO! Esto viene de 'passport-jwt' (no de 'passport')
import { ExtractJwt, Strategy } from "passport-jwt";

// 🧩 Definimos el "shape" del payload de Tú firmas al crear el JWT.
// Así tendrás tipado en 'validate(payload : JwtPayload)'.

type JwtPayload = {
    sub : string;   // 🔹 ID del usuario (subject)
    email : string; // 🔹 correo del usuario
    role : string; // 🔹 rol del usuario (si lo agregas al firmar)
}

// ✅ Marcamos la clase como inyectable para que nest pueda crearla y usarla como provider
@Injectable()
// ✅ Extendemos de PassportStrategy pasándole la estrategia JWT nativa para passport-jwt
// 🔹 'jwt' -> Passport usa la estrategia que registraste con el nombre 'jwt'
// De esa manera tu AuthGuard('jwt') encuentra la estrategia y valida el token correctamente.
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){ 

    // El constructor configura CÓMO se valida el token
    constructor(){
        // 🔹 super ({...}) inicializa la estrategia de Passport.
        // Lo que pongas aquí define:
        // - de donde sale el token,
        // - si se ignora las expiraciones,
        // - y con qué clave se verifica la firma
        super({
            // 🔹 ¿De dónde se obtiene el JWT? Del header Authorization: "Bearer <token>"
            // 🔹 Extraemos el token
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 🔹 Si el token expiró, NO lo aceptamos (comportamiento recomendado)
            ignoreExpiration : false,
            // 🔹 Clave para verificar la firma del JWT
            // - Debe ser la MISMA que usaste al firmarlo en el login (AuthService)
            // - TS ve proccess.env como string | undefined , por eso hacemos 'as string'
            secretOrKey : process.env.JWT_SECRET as string,
            // 🟢 Si todo está OK, devuelve un objeto (user o datos del payload)
            // Lo que retornes aquí queda en req.user para tus controladores 
        });
    }

    // ✅ Este método recibe el payload del token JWT ya verificado y decodificado, O sea el token ya pasó todas las 
    // comprobaciones técnicas (firma y expiración)
    // ✅ El método se ejecuta de forma automática. Tú no lo llamas manualmente de ningún lado, sino que Passport lo hace
    //    por tí internamente cuando un token pasa la verificación.
    // ✅ Si la firma del token es válida, Passport llamará a este método.
    // Lo que RETORNES aquí se adjunta a 'req.user' en tus controladores protegidos.
    // - No es necesario volver a consultar DB si ya confías en el payload, pero puedes hacerlo si quieres
    // enriquecer 'req.user' con más info.
    async validate (payload : JwtPayload){
        return {
            sub: payload.sub,
            email : payload.email,
            role : payload.role
        };
    }


}
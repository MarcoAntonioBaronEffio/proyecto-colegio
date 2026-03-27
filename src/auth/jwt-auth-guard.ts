// ✅ Importamos el decorador @Injectable() de Nest.
// Marcar una clase como "injectable" permite que Nest las gestione dentro del contenedor de
// dependencias. En este guard en particular no inyectamos nada, pero es buena práctica y permite
// extenderlo en el futuro.
import { Injectable } from "@nestjs/common";

// ✅ Importamos AuthGuard desde @nestjs/passport.
// AuthGuard es un guard genérico que ya implementa la integración con Passport.
// Recibe el "nombre" de una estrategia de Passport y se encarga de:
// - Lee credenciales (por ejemplo, el JWT del header Authorization).
// - Llamar a la estrategia correspondiente (JwtStrategy en tu caso).
// - Manejar respuestas 401/403 automáticamente si la validación falla.
import { AuthGuard } from "@nestjs/passport";

// ✅ Decoramos la clase para que Nest pueda instanciarla y, si quisiéramos,
// inyectarla en otros lugares (o extenderla con dependencias).
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    // 🧠 Puntos importantes:
    // - El string 'jwt' DEBE coincidir con el nombre de la estrategia de Passport que registraste
    // en tu JwtStrategy. Si no especificaste un nombre en el segundo parámetro, por defecto también es 'jwt'.

    // 🔹 Al extender AuthGuard ('jwt'), heredas el comportamiento estándar:
    // - Buscas el token en Authorization: Bearer <token>.
    // - Ejecuta JwtStrategy.validate(payload) si el token es válido.
    // - Si todo OK, adjunta el usuario decodificado en request.user y deja pasar.
    // - Si falla (token ausente/expirado/inválido), lanza 401 automáticamente.

    // 🔹 No necesitamos escribir código adicional aquí a menos que quieras PERSONALIZAR:
    // - fromRequest: dónde leer el token (por cookie, query, etc.) -> eso suele ir en la estrategia.
    // - handleRequest: cómo manejar el resultado/errores antes de devolver request.user.
    // - canActive: lógica extra previa a la validación.
}
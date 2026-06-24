import { Request } from "express";
import { JwtPayload } from "src/auth/types/jwt-payload-type";

// 🛡️ Extiende el Request de Express agregando la propiedad "user" que será inyectada por JWTStragety
export interface AuthRequest extends Request{

    // 👤 Usuario autenticado obtenido desde el JWT validado
    user: JwtPayload;

}
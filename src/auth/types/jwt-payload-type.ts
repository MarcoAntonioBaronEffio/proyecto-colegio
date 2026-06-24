// 📦 Información que viaja dentro del JWT

// 🔹 Lo utilizaremos para :
// 1️⃣ Firmar el token: async signToken(user: JwtPayload)
// 👉 Aquí TypeScript sabe exactamente qué datos pueden ir dentro del JWT
//
// 2️⃣ En JwtStrategy: async validate (payload: JwtPayload)
// 👉 Aquí TypeScript sabe exactamente qué datos salieron del JWT
//
// 3️⃣ En AuthRequest: export interface AuthRequest extend Request { user: JwtPayload }
// 👉 Aquí TypeScript sabe exactamente qué existe dentro de: req.user
//
// 4️⃣ En los Controllers: @Req() req: AuthRequest
// 👉 Entonces tienes: req.user.sub | req.user.email | req.user.roleId | req.user.roleName | req.user.schoolId

// ✅ Flujo completo
// 🔹 signToken()
// 🔹 JwtStrategy.validate()
// 🔹 AuthRequest.user
// 🔹 Controllers

export type JwtPayload = {
   
    // 🆔 Id del usuario
    sub: string;

    // 📧 Correo
    email: string;

    // 🎭 ID del rol
    roleId : string;

    // 🏷️ Nombre del rol
    roleName : string;

    // 🏫 Colegio al que pertenece el usuario 
    // 🔹 Opcional porque SYSTEM_ADMINISTRATOR no pertenece a ningún colegio
    schoolId?: string;

}
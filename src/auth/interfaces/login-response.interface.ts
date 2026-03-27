// 🧩 Interface: estructura (shape) de la respuesta de /auth/login
// Usamos 'interface' en lugar de 'type' para describir objetos con propiedades
// nominales y facilitar futuras extensiones.

// 🔐 Respuesta que enviará el backend al hacer login correctamente
export interface LoginResponse{

    // 🗝️ Token JWT que el cliente debe enviar luego en:
    // Authorization: Bearer <access_token>
    accessToken : string;
    // 👤 Resumen de datos públicos del usuario autenticado.
    // ⚠️ Evita incluir campos sensibles (passwordHash, etc.)
    // Summary -> Resumen en español 
    user: UserSummary;

}

// 👤 Interface auxiliar para describir los datos públicos del usuario
// La separamos para reutilizarla en otros endpoints si lo deseas.
// 🔹 UserSummary => español: resumen de usuario
export interface UserSummary{
    // 🆔 Identificador único del usuario (UUID o número, según tu entidad)
    id: string;
    // 📧 Email del usuario (ya validado y transformado en el DTO)
    email: string;
    // 🎭 Rol del usuario (ej: 'admin', 'docente') o su UUID de rol
    roleId : string;
    // 📝 (Opcional) Nombre visible del usuario; usa "?" para indicar que puede no venir
    // name?: string;
    // 🧩 (Opcional) Agrega aquí otros campos NO sensibles que quieras exponer
    // avatarUrl?: string;
    // lastLoginAt?: string;
    //
    // 🏷️ Nombre del rol (sirve para decidir pantallas en Android/Jetpack compose)
    roleName : string;
}
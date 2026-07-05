import { RoleName } from "src/common/enums/user-role.enum";
 

// 📌 FALTA COMENTAR
// 📌 Esto es lo que nos devuelve la validación
export interface AuthUser{
    sub : string;
    email : string;
    roleId : string;
    roleName : RoleName;
    schoolId? : string;
}


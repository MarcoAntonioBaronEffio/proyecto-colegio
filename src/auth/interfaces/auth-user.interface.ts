import { RoleName } from "src/common/enums/user-role.enum";
 
export interface AuthUser{
    sub : string;
    email : string;
    roleId : string;
    roleName : RoleName;
    schoolId? : string;
}


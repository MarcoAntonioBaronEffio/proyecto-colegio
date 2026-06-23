import { Injectable } from "@nestjs/common"; 
import { MenuOption } from "../interfaces/menu-option.interface";
import { RoleName } from "../enums/user-role.enum";

@Injectable()
export class MenuService {

    getMenuByRole (role : RoleName) : MenuOption[] {

        switch(role){

            case RoleName.ADMINISTRATOR:
                return [
                    {
                        title : 'Inicio',
                        icon  : 'home'
                    },
                    {
                        title : 'Años escolares',
                        icon : 'home'
                    }
                ];

            case RoleName.GUARDIAN:
                return [
                    {
                        title : 'Inicio',
                        icon : 'groups'
                    },
                    {
                        title: 'Mis hijos',
                        icon : 'groups'    
                    },
                    {
                        title: 'Notas',
                        icon : 'grading'
                    }
                ];

             default : return[]          
        }
    }
}
import { Injectable } from "@nestjs/common";
import { UserRole } from "../enums/user-role.enum";
import { MenuOption } from "../interfaces/menu-option.interface";

@Injectable()
export class MenuService {

    getMenuByRole (role : UserRole) : MenuOption[] {

        switch(role){

            case UserRole.ADMINISTRATOR:
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

            case UserRole.GUARDIAN:
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
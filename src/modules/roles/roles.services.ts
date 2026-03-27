import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rol } from "src/entities/rol.entity";
import { Repository } from "typeorm";

// 🔹 Injectable -> Decorador que registra esta clase en el sistema de inyección de dependencias de Nest.
// Así Nest puede construirla e inyectarla donde se necesite (ej: en un controlador).
@Injectable()
export class RolesServices {
    
    // 🔹 constructor de inyección de dependencias.
    // 🔹 @InjectRepository(Rol) pide el repositorio específico para la entidad Rol.
    // Cuando usas TypeORM en NestJS, cada entidad (en mi caso Rol) tiene un repositorio asociado.
    // Ese repositorio es el que te da acceso directo a la base de datos para esa entidad: puedes hacer
    // ".find()", ".save()", ".delete()", etc.
    // Lo que hace @InjectRepository(Rol) es decirle a NestJS:
    // 👉🏼 Por favor, dame el repositorio que corresponda a la entidad "Rol" y colócalo dentro de esta clase
    // (el servicio) para que yo pueda usarlo.
    // 🔹 private readonly repo: Repository<Rol>' crea un propiedad privada de solo lectura llamada "repo"
    // del tipo Repository<Rol>, Nest la inicializa automáticamente.
    // 🔹 Con esto estamos diciendo "Inyéctame el repositorio que controla la tabla basada en la entidad Rol, 
    // y guárdalo en la propiedad privada "repo" para utilizarlo dentro del servicio".
    constructor(@InjectRepository(Rol) private repo: Repository<Rol>){}

    // 🔹 findAll() -> Método de servicio para listar todos los roles.
    // - Devolvemos Promise<Rol[]> de forma explícita para mayor claridad.
    // - Podríamos usar "async" y "await", pero no es necesario aquí porque retornar la promesa
    // de this.repo.find() ya es suficiente.
    findAll() : Promise<Rol[]>{ 

        // 🔹 repo.find() devuelve todos los registros de la tabla 'rol' según la entidad configurada.
        // Acepta opciones (where, relations, order, etc).
        // si en el futuro necesitas filtrar o traer relaciones.
        return this.repo.find();
    }
}
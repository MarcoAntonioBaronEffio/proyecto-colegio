import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rol } from "src/entities/rol.entity";
import { RolesServices } from "./roles.services";
import { RolesController } from "./roles.controller";

// 📦 ¿Qué es un módulo en Nest?
//Un módulo @Module es como una cajita organizada que agrupa:
// ✅ Sus propios controladores
// ✅ Sus propios servicios
// ✅ Sus propios repositorios (entities)
// ✅ (Opcionalmente) cosas que exporta para otros módulos

@Module({
    // 📦 imports: 
    // Aquí definimos qué "módulos externos" necesita este módulo para funcionar.
    // En este caso, TypeOrmModule.forFeature([Rol]) registra el Repository<Rol> para que pueda
    // ser inyectado en el servicio mediante @InjectRepository(Rol).
    // 👉🏼 Sin este import NO podríamos acceder a la base de datos desde RolesServices.
    imports : [TypeOrmModule.forFeature([Rol])],

    // ⚒️ providers: 
    // Aquí registramos los servicios que pertenecen a este módulo.
    // Nest podrá inyectar RolesServices en el controlador u otros lugares dentro del módulo.
    providers: [RolesServices],

    // 🎮  controllers: controladores que pertenecen a este módulo.
    // Aquí declaras el controlador que manejaraán las rutas HTTP relacionadas a "roles".
    controllers : [ RolesController],

    // ⭐️ Exportamos para que UsuarioModule (y cualquier otro) pueda @InjectRepository(Rol).
    // Sin este export, UsuarioModule no podría inyectar Repository<Rol>.
    //🚀 exports: Exportamos TypeOrmModule para que OTROS módulos puedan también inyectar Repository<Rol>
    //si importan este módulo. (Sirve si otro módulo necesita el repositorio de Rol).
    exports : [TypeOrmModule],
})

// ✅ Exportamos la clase del módulo para poder importarla en AppModule u otros módulos.
export class RolesModule{}
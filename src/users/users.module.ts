// ✅ Importamos el decorador @Module
// Nos permite declarar esta clase como un módulo de NestJS
import { Module } from '@nestjs/common';

// ✅ Importamos TypeOrmModule
// Este módulo es el puente que permite a Nest trabajar con TypeOrm.
// Gracias a él podemos conectarnos a la base de datos y usar entidades y repositorios
import { TypeOrmModule } from '@nestjs/typeorm';

// ✅ Importamos la entidad User
// Esta entidad representa la tabla 'users' en la base de datos.
import { User } from 'src/entities/users.entity';

// ✅ Importamos el servicio de usuarios:
// Contendrá la lógica de negocio (ej: crear usuario)
import { UsersService } from './users.service';

// ✅ Importamos el controlador de usuarios:
// Manejará las rutas HTTP como /users, /users/:id, etc
import { UsersController } from './users.controller';
import { Rol } from 'src/entities/rol.entity';
import { Administrator } from 'src/entities/administrator.entity';

@Module({
  // 📦 imports:
  // 👉🏼 Aquí agregaremos recursos externos que éste módulo necesita.
  // 👉🏼 TypeOrmModule.forFeature([User]) habilita que podamos inyectar Repository<User> usando @InjectRepository(User) en el servicio.
  imports : [TypeOrmModule.forFeature([User, Rol, Administrator])],

  // ⚒️ providers:
  // 👉🏼 Aquí declaramos los servicios que éste módulo ofrece.
  // 👉🏼 Nest podrá inyectar UserService en controladores u otros servicios.
  providers: [UsersService],

  // 🎮 controller:
  // 👉🏼 Aquí registramos los controladores que atenderán peticiones HTTP.
  // 👉🏼 UsersController manejará rutas como /users.
  controllers: [UsersController],

  // 🚀 exports:
  // 👉🏼 Exportamos TypeOrmModule para que otros módulos también puedan usar Repository<User> si necesitan esta entidad.
  // ✅ Exportarmos UserService para que otro módulo lo use.
  exports: [TypeOrmModule, UsersService],
})

// ✅ Exportamos el módulo para poder importarlo en AppModule u otros módulos.
export class UsersModule {}

// Este archivo define el módulo de NestJs para la funcionalidad de "Años escolares (SchoolsYears)". Un
// módulo agrupa y encapsula todo lo relacionado: entidades (TypeOrm), servicios (lógica de negocio) y 
// controladores (endpoints HTTP).

// 🧱 'Module' es el decorador que convierte una clase en Módulo de Nest.
// Aquí declararemos qué importamos, qué proveemos y qué exponemos.
import { Module } from '@nestjs/common';

// 🗃️ 'TypeOrmModule' nos permite registrar entidades para que Nest inyecte automáticamente sus repositorios (Repository<Entidad>). 
import { TypeOrmModule } from '@nestjs/typeorm';
// 🏫 Entidad que mapea la tabla 'school_years' en la base de datos
import { SchoolYear } from 'src/entities/school-year.entity';
// 🧠 Servicio con la lógica de negocio (crear, listar, activar, etc)
import { SchoolYearsService } from './school-years.service';
// 🌐 Controlador que expone rutas HTTP (POST/GET/PATCH)
import { SchoolYearsController } from './school-years.controller';
import { School } from 'src/entities/school.entity';

@Module({
  // 📦 imports: otros módulos o integraciones que este módulo necesita.
  // - 'TypeOrmModule.forFeature([SchoolYear])' registra el repositorio de SchoolYear para inyección vía constructor.
  imports: [TypeOrmModule.forFeature([SchoolYear, School])],
  // 🚪 controllers: clases que manejan las peticiones HTTP
  // Aquí vive la capa "web" : valida entrada (DTOs), llama al servicio y retorna una respuesta tipada (interfaces).
  controllers: [SchoolYearsController],
  // 🔧 providers: clases inyectables (servicios, estrategias, guards, etc.).
  // Colocamos el servicio para que Nest lo cree y administre su ciclo de vida.
  providers: [SchoolYearsService],
  // 🔁 exports: lo que este módulo pone a disposición de otros módulos que lo importen. Exportamos el servicio
  // para poder inyectarlo desde fuera (por ejemplo, si otro módulo necesita saber el año activo).
  // 👉🏼 Si algún módulo externo también necesitara el repositorio, puedes exportar 'TypeOrmModule.forFeature([SchoolYear])
  // desde un módulo compartido: aquí normalmente con el Service basta.
  exports: [SchoolYearsService],
})

// 🏷️ La clase del módulo. No contiene lógica; el decorador @Module de arriba es quien define la "configuración" del módulo.
export class SchoolYearsModule {}

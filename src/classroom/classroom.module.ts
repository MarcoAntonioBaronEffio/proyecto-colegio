import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { Classroom } from 'src/entities/classroom.entity';

// 🏗️ Decorador @Module()
// 👉 Convierte esta clase en un módulo de NestJS
// 👉 Un módulo sirve para organizar funcionalidades relacionadas
// 👉 En este caso:
// 🔹 Todo lo relacionado con classrooms (aulas)
@Module({

    // 📚 Imports
    // 👉 Aquí registramos todo lo que este módulo necesita usar
    imports:[
        // 🗄️ TypeOrmModule.forFeature()
        // 👉 Le dice a NestJS:
        // "Quiero usar el repositorio de Classroom dentro de este módulo"

        // 👉 Gracias a esto podremos hacer:
        // 🔹 @InjectRepository(Classroom)

        // 👉 Y NestJS podrá inyectar automáticamente:
        // Repository<Classroom>
        TypeOrmModule.forFeature([Classroom]),
    ],

    // 🚏 Controllers
    // 👉 Aqui registramos los controladores HTTP
    // 👉 Los controllers exponen endpoints: POST, GET, PATCH, DELETE
    controllers: [
        // 🏫 Controlador de aulas
        ClassroomController],

    // 🧠 Providers
    // 👉 Aqui registramos servicios e inyectables
    // 👉 NestJS podrá inyectarlos automáticamente
    providers: [
        // 💉 Servicio principal de classrooms
        // 👉 Contiene toda la lógica:
        // 🔹 crear, actualizar, eliminar, cambiar estado, búsquedas
        ClassroomService],

    // 📤 Exports
    // 👉 Exportamos cosas que otros módulos podrían usar
    // 👉 Por ahora no exportamos nada
    // 
    exports: [ClassroomService],
})

// 🟥 export class ClassroomModule
// 👉 Define la clase del módulo
// 👉 NestJS usa esta clase como referencia interna
export class ClassroomModule {

    // 📦 Clase vacía
    // 👉 Toda la configuración real está arriba en @Module()

    // 👉 Esta clase NO necesita:
    // ❌ métodos, propiedades, constructor

    // 👉 NestJS usa esta clase únicamente como:
    // 🔹 identificador, contenedor, referencia del módulo

}

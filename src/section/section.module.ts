import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from 'src/entities/grade.entity';
import { Section } from 'src/entities/section.entity';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';

// 🏗️ Declaramos el módulo
// ✅ @Module() recibe un objeto de configuración con:
// 🔹 imports: módulos que este módulo necesita
// 🔹 controllers: controladores que exponen endepointa
// 🔹 providers: servicios/inyectables (lógica)
// 🔹 exports: lo que quieres "prestar" a otros módulos
@Module({

    // 📚 imports: Importamos repositorios disponibles en este módulo
    // ✅ Todo lo que pongas en imports se "habilita" dentro del contexto de este módulo
    // En este caso, registramos las entidades Section y Grade para que TypeORM pueda crear los repositorios sectionRepo y gradeRepo
    imports : [
        // 🗄️ Habilita inyección de repositorios para Section y Grade
        TypeOrmModule.forFeature([
            Section, // 🧾 Habilita el repositorio de la tabla sections
            Grade    // 🏷️ Habilita el repositorio de la tabla grades
        ])
    ],

    // 🛣️ controllers : exponen los endpointa HTTP
    // Este módulo tendrá el SectionController para manejar todas las rutas HTTP.
    controllers : [
        SectionController // 🚏 Endpoints: POST, GET, PATCH, etc.
    ],

    // 🧠 providers: aquí registramos los servicios que este módulo usará
    // Esto permite que NestJS pueda inyectarlos donde se necesitan.
    providers : [
        SectionService // 💉 Servicio con toda la lógica de manejo de secciones
    ],

    

    // ❗ NOTA: No exportamos nada aquí porque las secciones solo serán usadas internamente
})
// 🟥 1.- export class SectionModule {...} -> Define una clase normal de TypeScript
// Pero cuando tiene un decorador @Module() encima, NestJS la reconoce como un módulo
// Por eso debe estar "export" -> para que NestJS pueda importarla desde AppModule

// 🟦 2.- ¿Por qué la clase está vacía? -> Porque en NestJS: 👉🏼 Toda la configuración real del módulo NO va dentro de la clase, 
//.       sino dentro del decorador @Module() que está arriba

// 🟩 3.- ¿Entonces para qué sirve la clase?
// La clase es simplemente un:
// 🧩 "contenedor"
// 🏷️ "nombre del módulo"
// 🗂️ "identificador"
// NestJS necesita una clase para: Registrarla como módulo, poder importarla en otros módulos, hacer organización de proyecto
// reconocer su metadata (los providers, controllers, imports, exports)
// 🔹 Pero:
// ❗ La clase NO ejecuta código
// ❗ No guarda variables
// ❗ No tiene métodos
// Es simplemente un cascarón que NESTJS usa como referencia
export class SectionModule {
    // 📦 La clase está vacía porque NestJS se encarga de todo automáticamente.
    // 🧠 Solo sirve como contenedor de configuración gracias al decorador @Module().

   
}{}

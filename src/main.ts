// 🔹 Importa NestFactory, que sirve para crear la aplicación NestJS a partir del módulo principal (AppModule).
import { NestFactory } from '@nestjs/core';
// 🔹 Importa AppModule, que es el módulo raíz de tu aplicación. Dentro de él se conectan los controladores, servicios y otros módulos
import { AppModule } from './app.module';

// 🔹 Declara la función boostrap()
// La palabra async significa que dentro usaremos operaciones asíncronas con await.
async function bootstrap() {
  // 👉🏼 Crea la aplicación de NestJS usando el AppModule.
  // 🔹 NestFactory.create(AppModule) -> inicializa la app.
  // 🔹 await -> espera a que termine de crearse antes de continuar.
  // 🔹 const app -> ahora tienes una instancia de la aplicación INestApplication
  const app = await NestFactory.create(AppModule);

  // 🔹 Esto establece un prefijo global.
  // Esto significa que todas las rutas de tus controladores comenzarán con /api.
  // Ejemplo: si en tu AlumnoController tienes @Get('alumnos') , la URL real será:
  // http://localhost:3000/api/alumnos
  app.setGlobalPrefix('api');

  //🔹 Levanta el servidor por un puerto específico
  // process.env.PORT -> intenta usar el puerto que venga en las variables de entorno (útil en despliegues en la nube como Heroku)
  // ?? 3000 -> si no encuentra proccess.env.PORT, por defecto usará el puerto 3000.
  // await -> espera a que el servidor está escuchando antes de continuar.
  await app.listen(process.env.PORT ?? 3000);
}

// 🔹 Llama a la función boostrap(), para que la aplicación NestJS arranque 🚀.
bootstrap();

// 🔑 Resumen
// 🔹 NestFactory.create(AppModule): crea la app.
// 🔹 setGlobalPrefix('api') : pone el prefijo 'api' a todas las rutas.
// 🔹 listen(PORT) : arranca el servidor en el puerto definido.
// 🔹 boostrap() : es la función principal que arranca todo.


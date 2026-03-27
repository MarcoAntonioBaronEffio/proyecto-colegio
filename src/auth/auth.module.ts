// ⛳ Decorador @Module para declarar un módulo de Nest 
import { Module } from '@nestjs/common';
// 🔐 Módulo que expone JwtService (firmar/verificar tokens)
import { JwtModule } from '@nestjs/jwt';
// 🛂 Integración con Passport (estrategias, guards)
import { PassportModule } from '@nestjs/passport';
// 🧠 Servicio con la lógica de autenticación (validar user, firmar token)
import { AuthService } from './auth.service';
// 🚪 Endpoints de login/refresh/etc.
import { AuthController } from './auth.controller';
// 👥 Módulo de usuarios (repositorios/servicios para buscar users)
import { UsersModule } from 'src/users/users.module';
// 🎯 Estrategia Passport que leerá y validará el JWT en cada request 
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  // 🔹 imports -> Módulos externos o internos que exportan algo que necesitas,
  // vienen desde afuera
  imports:[
    // ⭐️ Este módulo quiere usar cosas que exporta UserModule, no importa el módulo por sí mismo - importa lo que ese módulo exporta, en 
    //   este caso exporta UserService.
    UsersModule, // ➕ Lo necesitamos para buscar usuarios (por email/id) al validar el token
    PassportModule, // ➕ Habilita guards como AuthGuard('jwt') y el ciclo de Passport
    // ➕ Configuramos JwtModule: define cómo se FIRMAN los tokens por defecto (clave secreta, expiración, algoritmo)
    // Esta configuración será usada por JwtService.signAsync en toda la app.
    // 🔹 JwtModule necesita "secret" cuando se registra
    // 🔹 Entonces registras JWT de forma async para asegurar que Config esté listo antes
    // 🔹 registerAsync -> "espera a que cargue el ConfigService antes de registrar el módulo JwtModule"
    // Registra el módulo JWT de forma asíncrona, esperando a que las variables del ".env" estén disponibles.
    // Esto lo usamos en lugar de JwtModuke.register({...}) porque queremos leer valores desde ConfigService, que a su vez
    // obtiene datos del archivo .env
    JwtModule.registerAsync({
      // 🔹 imports -> Módulos externos o internos que exportan algo que necesitas
      // 🔹 ConfigModule carga el ".env"
      //  Carga módulos que este factory necesita.
      // factory -> es una función que fabrica o crea un objeto de configuración en tiempo de ejecución
      // Aquí importamos ConfigModule porque la fábrica usará ConfigService para leer .env
      // 🔸 imports: [ConfigModule] -> Carga el módulo "ConfigModule" antes de ejecutar esta configuración.
      // ✅ Esto garantiza que el ConfigService (que lee el .env) ya esté listo. 
      // Si no lo pones, "ConfigService" estará undefined
      imports: [
        ConfigModule,
        ],
      // 🔹 inject -> Le dice a Nest qué dependencias debe inyectar a la fábrica.
      // 🔹 ConfigService es el que te deja leer JWT_SECRET
      // Al listar ConfigService, Nest creará y pasará una instancia al useFactory.
      // 🔸 inject: [ConfigService] -> "Dile a Nest que inyecte una instancia del ConfigService" dentro de la función de abajo "userFactory".
      inject: [ConfigService],
      // 🔹 useFactory -> es una función (puede ser async) que retorna las opciones de JwtModule.
      // Recibe el ConfigService gracias a "inject".
      // 🔸 useFactory: [config: ConfigService] -> Es la función fábrica que crea y devuelve el objeto de configuración del JwtModule.
      // En resumen:
      // - Esta función fabrica el objeto que JwtModule necesita.
      // - Usa el ConfigService para leer variables del ".env".
      // - Retorna un objeto con "secret" y "signOptions".
      useFactory: (config: ConfigService) => {
        // 📥 Leemos las variables del .env con tipado genérico <string>
        // 🔹 JWT_SECRET: clave secreta usada para firmar/verificar tokens (HS256 por defecto).
        // 🔹 JWT_EXPIRES: duración del token (ej: "1d", "15m")
      const secret = config.get<string>('JWT_SECRET');
      const expiresIn = config.get<string>('JWT_EXPIRES');

      // 🛑 Si no hay secreto, lanzamos un error temprano y claro.
      // Suele pasar cuando:
      // - Falta la variable en .env
      // - Hay espacios extra
      // - ConfigModule.forRoot() no se ejecutó antes
      if (!secret) {
        throw new Error(
          'JWT_SECRET no está definido. Revisa tu .env (sin espacios) y el orden de ConfigModule.forRoot().',
        );
      }

      // ✅ Devolvemos la configuración esperada por JwtModule.
      // - secret -> la clave con la que firmaremos (HS256 por defecto)
      // - signOptions.expiresIn -> duración del token (acepta string o number)
      return {
        // 🔸 secret -> Clave secreta el .env
        secret,
        // 🔸 signOptions -> Configuración extra del token
        signOptions: { 
          // 🔸 expiresIn -> Tiempo de vida del token
          //expiresIn as any Si tu ConfigService devuelve string.
          expiresIn: expiresIn as any }, // ✅ forzamos compatibilidad de tipo
      };
      // 🧭 En resumen (la versión corta y precisa)
      // 🔸 ConfigModule -> carga el archivo .env y deja las variables disponibles en toda la app.
      // 🔸 ConfigService -> es la clase que te permite leer esas variables desde cualquier parte (por
      //ejemplo, config.get('JWT_SECRET')).
      // 🔸 useFactory -> es una función que usa ese ConfigService para fabricar el objeto de configuración que
      // necesita el JwtModule.
      // Este objeto ({secret: signOptions}) -> le dice a JwtModule cómo firmar los tokens
    },
    }),
  ],

  // 🎛️ Controladores que exponen rutas (p. ej., POST /auth/login)
  controllers: [AuthController],
  
  // 🔹 providers -> Servicios/estrategias que tú defines, vienen desde dentro
  // 🧩 Proveedores disponibles dentro de este módulo:
  // - AuthService: lógica de login/validación y formado de JWT.
  // - JwtStrategy: cómo extraer el token del header y validarlo en cada request protegida.
  providers: [AuthService , JwtStrategy],

  // 🔹 Servicios que quieres compartir
  // 📤 Exportamos AuthService para usarlo desde otros módulos si hace falta (ej:  para emitir
  //en otro flujo).
  // No es necesario exportar JwtModule; Nest comparte su JwtService dentro del grafo del módulo actual.
  exports: [AuthService],
  
})


// 🧩 Módulo listo: al importarlo en AppModule 
export class AuthModule {}



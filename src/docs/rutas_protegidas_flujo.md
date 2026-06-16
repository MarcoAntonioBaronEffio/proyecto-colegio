🗂️ ORDEN REAL SEGUN MIS ARCHIVOS

🟢 1. public.decorators.ts y roles.decorator.ts
📂 common/decorators/

👉 AQUI EMPIEZA TODO

@Public()
@Roles('ADMINISTRATOR')

🔥 Qué hacen:
- public.decorator.ts -> crea @Public y guarda en su metadata { isPublic : true }
- roles.decorator.ts -> crea @Roles y guarda en su metadata { roles : [ ... ] }
👉 Crean decoradores y guardan metadata, no ejecutan lógic


🟡 2. auth.controller.ts
📂 auth/
👉 Aquí defines tus endpoints

@Post('login')
@Public()
login(){}

@Get('users')
@Roles('ADMINISTRATOR')
findAll(){}

👉 Aqui se usan los decorators

🔴 3. jwt-auth-guard-ts
📁 auth/
👉🥇 PRIMER GUARD que se ejecuta
🔥 Función: verifica si el endpoint es público

const isPublic = this.reflector.getAllAndOverride(...)

Resultado
Caso                 Acción
@Public         🔓 Pasa sin JWT
NO              🔒 Exige token


🔵 4. jwt.strategy.ts
📂 👉 SOLO se ejecuta si NO es público
🔥 Función: 
- Lee token
- Lo valida
- Lo decodifica

request.user = payload

👉 Aqui nace 🔥 : request.user

🟣5. roles.guard.ts
📁 common/guards/
👉🥈 SEGUNDO GUARD
🔥 Función:
- Verifica si el usuario tiene el rol correcto

const requiredRoles = this.reflector.getAllAndOverride(...)

requiredRoles.includes(user.roleName)

🟢 6.auth.servide.ts
📂 auth/
👉 Aqui está la lógica real (login, generar JWT, etc)

🟢7. auth.module.ts
📁 auth/
👉 Aqui se conecta todo
- Guards
- Strategy
- Service
- Controller



----------------------------------------------------------------------------------------


🧠🔥 FLUJO COMPLETO 

1️⃣ public.decorators.ts / roles.decorator.ts
        ⬇️ (guardian metadata)

2️⃣ auth.controller.ts
        ⬇️ (llega request)

3️⃣ jwt-auth-guard.ts
    ¿Es público?
        ⬇️
    No
        ⬇️

4️⃣ jwt.strategy.ts
        ⬇️
    decodifica token -> request.user

5️⃣ roles.guard.ts
        ⬇️
    valida roles

6️⃣ auth.controller.ts
        ⬇️
7️⃣ auth.service.ts

----------------------------------------------------------------------------------------

🎯 FORMA FÁCIL DE RECORDAR 
🧩 Decorators -> 🛡️ Guards -> 🔐 Strategy -> 🛡️ Roles -> 🎯 Controller -> ⚙️ Service

----------------------------------------------------------------------------------------

💡 MAPEO DIRECTO (TU CARPETA)

    Archivo                        Rol
public.decorator.ts         Marca endpoint público
roles.decorator.ts          Define roles
jwt-auth-guard.ts           Decide si validar JWT
jwt.strategy.ts             Decodifica token
roles.guard.ts              Valida permisos
auth.controller.ts          Recibe request
auth.services.ts            Lógica de negocio
auth.module.ts              Conecta todo

----------------------------------------------------------------------------------------

🔥 FRASE CLAVE 
👉 "Los decoradores solo marcan, los guards deciden, la strategy valida y el controller ejecuta"
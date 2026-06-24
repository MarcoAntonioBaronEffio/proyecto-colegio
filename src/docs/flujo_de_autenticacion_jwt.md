📋 FLUJO DE AUTENTICACIÓN JWT Y RESOLUCIÓN DE CONTEXTO ESCOLAR

Login
  ⬇️
Usuario envía email y contraseña
  ⬇️
AuthService valida las credenciales
  ⬇️
Se genera un JWT
  ⬇️
Dentro del JWT se almacenan:

    - sub (ID del usuario)
    - email
    - roleId
    - roleName
    - schoolId
  ⬇️
El cliente recibe el token
  ⬇️
El cliente envía el token en cada petición protegida:

    Authorization: Bearer<token>

  ⬇️
JwtAuthGuard intercepta la petición
  ⬇️
JwtStrategy valida la firma y expiración del JWT
  ⬇️
JwtStrategy extrae y devuelve el payload
  ⬇️
Passport asigna el payload a req.user
  ⬇️
El Controller obtiene los datos del usuario autenticado mediante req.user
  ⬇️
El Service accede a req.user.schoolId
  ⬇️
El schoolId se utiliza para asociar registros al colegio correspondiente y aplicar aislamiento  de datos entre colegios

✅ Resultado:
🔹 El frontend no necesita enviar schoolId en cada petición. 
🔹 El backend determina automáticamente el colegio a partir del usuario autenticado mediante el JWT
🔹 Los administradores solo pueden crear y gestionar recursos de su propio colegio
🔹 Se evita que un usuario manipule el schoolId desde el cliente

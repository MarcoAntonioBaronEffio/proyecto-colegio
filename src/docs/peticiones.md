// ✅ Orden correcto
Petición HTTP -> router de Nest identifica el controller -> pipes (validación DTO) -> método del controller se ejecuta -> service

✅ tenant -> en un SaaS, un tenant es: Un cliente independiente dentro del mismo sistema

🧠 Ahora la prioridad número 1 es : Aislamiento perfecto por school_id: Un colegio JAMÁS puede ver datos de otro

✅ Crear roles de forma automática: npm run seed:role
✅ Crear colegio de forma automática: npm run seed:school


🌟 Año escolar

⭐️ REGISTRAR NUEVO AÑO ESCOLAR

POST : http://localhost:3000/api/school-years

{
    "year": 2028,
    "startsOn" : "2028-03-01",
    "endsOn" : "2028-12-01"
}

⭐️ LISTAR TODOS LOS AÑOS ESCOLARES

GET : http://localhost:3000/api/school-years

--------------------------------------------------------------------------


⭐️ REGISTRAR ADMINISTRADOR EN DESARROLLO (PODEMOS MANDAR EL ID DEL ROL)

POST : http://localhost:3000/api/auth/register

{
    "email" : "admin2@admin.com",
    "firstName" : "Luis",
    "lastName" : "Díaz",
    "password" : "12345678",
    "phone" : "9700003048",
    "avatarUrl" : null,
    "roleId":"4d54bafb-1b35-4865-ae11-3133f6796505"
   
}

⭐️ REGISTRAR ADMINISTRADOR (CON EL NOMBRE DEL ROL <- (ASI DEBERÁ SER))

POST : http://localhost:3000/api/auth/register


{
    "email" : "admin3@admin.com",
    "firstName" : "Mario",
    "lastName" : "Gómez",
    "password" : "12345678",
    "phone" : "9700003058",
    "avatarUrl" : null,
    "roleName":"ADMINISTRADOR"
   
}

--------------------------------------------------------------------------

⭐️ REGISTRAR STUDENT (CON NOMBRE DEL ROL) - ESTUDIANTE
⭐️ DEBO QUITAR "sectionId" del payload, ya que "sectionId" debe ir en la matrícula.

POST http://localhost:3000/api/auth/register

{
    "email" : "alumno2@cole.com",
    "firstName" : "Anderson",
    "lastName" : "Effio",
    "password" : "12345678",
    "phone" : "123456789",
    "avatarUrl" : null,
    "roleName":"STUDENT",
    "student" : {
        "dni" : "13131313",
        "studentCode" : "ALU-0002"
    }
    
}


--------------------------------------------------------------------------


⭐️ REGISTRAR ADMINISTRADOR (CON NOMBRE DEL ROL) - ADMINISTRADOR

POST http://localhost:3000/api/auth/register

{
    "email" : "admin2@test.com",
    "firstName" : "Juan",
    "lastName" : "Perez3",
    "password" : "12345678",
    "phone" : "9700003041",
    "avatarUrl" : null,
    "roleName":"ADMINISTRATOR",
    "administrator" : {
        "dni" : "12121215",
        "workCode" : "ADM-0002"
    }
    
}

----------------------------------------------------------------------------

⭐️ REGISTRAR TEACHER (CON NOMBRE DEL ROL) - PROFESOR
 
POST http://localhost:3000/api/auth/register


{
  "firstName": "Carlos",
  "lastName": "Ramirez",
  "email": "carlos.ramirez@colegio.com",
  "password": "12345678",
  "phone": "987654321",
  "avatarUrl": null,
  "roleName": "TEACHER",
  "teacher": {
    "dni": "12345678",
    "teacherCode": "DOC-001",
    "specialty": "Matemática y Física"
  }
}



----------------------------------------------------------------------------

⭐️ REGISTRAR GUARDIAN (CON NOMBRE DEL ROL) - APODERADO

http://localhost:3000/api/auth/register

{
  "email": "apoderado1@gmail.com",
  "firstName": "Carlos",
  "lastName": "Ramirez",
  "password": "12345678",
  "phone": "987654321",
  "roleName": "GUARDIAN",
  "guardian": {
    "dni": "12345678",
    "relationship": "PADRE"
  }
}




----------------------------------------------------------------------------



⭐️ REGISTRAR SCHOOL YEARS (AÑOS ESCOLARES)

POST http://localhost:3000/api/school-years

{
    "year" : 2026,
    "startsOn" : "2026-03-15",
    "endsOn" : "2026-12-15"
}

------------------------------------------------------------------------------

⭐️ REGISTRAR GRADES (GRADOS)

POST http://localhost:3000/api/grades/
El nivel se manda en inglés , pero desde el front debo mandarlo antes en español

{
    "gradeNumber" : 1,
     "level" : "PRIMARY"
}


⭐️ OBTENER GRADES (GRADOS)
GET http://localhost:3000/api/grades/

{
    "success": true,
    "message": "Listado de grados obtenido",
    "data": [
        {
            "id": "15c5373f-c726-43db-a627-3b483cb207d5",
            "gradeNumber": 1,
            "level": "PRIMARY",
            "status": "ACTIVE",
            "createdAt": "2026-04-20T19:23:33.817Z",
            "updatedAt": "2026-04-20T19:23:33.817Z",
            "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
        }
    ]
}

-----------------------------------------------------------------------------

⭐️ REGISTRAR SECTIONS (SECCIONES)

POST http://localhost:3000/sections

{
  "gradeId": "dc16c090-fd52-4d8a-9263-6d569666d34c",
  "name": "A",
  "shift": "MORNING"
}


-----------------------------------------------------------------------------

⭐️ REGISTRAR CLASSROOMS (AULAS)


http://localhost:3000/api/classrooms
 

{
  "name": "Aula 101",
  "code": "A101",
  "capacity": 30,
  "floor": 1
}

-----------------------------------------------------------------------------

⭐️ REGISTRAR MATRÍCULA


http://localhost:3000/api/enrollments

{
  "studentId": "6a454a7b-28a3-4fb1-bd07-59176d41f4e6",
  "sectionId":"ca80279c-aa11-4bb1-b27c-8d8d50241489"

}

-----------------------------------------------------------------------------

⭐️ LISTAR MATRICULAS

http://localhost:3000/api/enrollments
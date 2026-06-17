✅ CREAR ADMINISTRADOR

POST -> http://localhost:3000/api/auth/register

 
➡️ petición

{
    "email" : "admin@test.com",
    "password" : "12345678",
    "firstName" : "Marco",
    "lastName" : "Barón",
    "roleName": "ADMINISTRATOR",
    "administrator" :{
        "documentType" : "DNI",
        "documentNumber" : "12345678"
    }
}

⬅️ respuesta:

{
    "succes": true,
    "message": "Administrador registrado con éxito",
    "data": {
        "id": "05077f10-4a7a-4d36-9a95-a06b6a5a0dd4",
        "email": "admin@test.com",
        "firstName": "Marco",
        "lastName": "Barón",
        "role": {
            "id": "f200e50c-9467-4639-95b3-70c22c0bf9f4"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-01T17:52:01.099Z",
        "updatedAt": "2026-06-01T17:52:01.099Z"
    }
}
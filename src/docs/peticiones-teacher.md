✅ CREAR PROFESOR

POST -> http://localhost:3000/api/auth/register

➡️ petición

{
    "email" : "teacher@test.com",
    "password" : "12345678",
    "firstName" : "Carlos",
    "lastName" : "Ramirez",
    "roleName" : "TEACHER",
    "teacher" : {
        "documentType": "DNI",
        "documentNumber" : "11122233",
        "professionalTitle": "Licenciado en Educación"
    }
}

⬅️ respuesta

{
    "succes": true,
    "message": "Usuario registrado con éxito",
    "data": {
        "id": "8a6a699a-a663-4353-821c-4babd24502cd",
        "email": "teacher@test.com",
        "firstName": "Carlos",
        "lastName": "Ramirez",
        "role": {
            "id": "19b51ec4-3e93-47b1-8022-5d04f46ac3e9"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-01T18:52:23.981Z",
        "updatedAt": "2026-06-01T18:52:23.981Z"
    }
}
✅ CREAR ALUMNO

POST -> http://localhost:3000/api/auth/register

➡️ petición

{
    "email" : "student@test.com",
    "password" : "12345678",
    "firstName" : "María",
    "lastName" : "Pérez",
    "roleName" : "STUDENT",
    "student" : {
        "documentType" : "DNI",
        "documentNumber" : "11223344"
    }
}

⬅️ Respuesta

{
    "succes": true,
    "message": "Estudiante registrado con éxito",
    "data": {
        "id": "7bab1799-c82d-46da-92b0-04bdb2eb77e9",
        "email": "student@test.com",
        "firstName": "María",
        "lastName": "Pérez",
        "role": {
            "id": "47150b43-055d-4567-bba7-8d08328d5184"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-01T18:36:39.971Z",
        "updatedAt": "2026-06-01T18:36:39.971Z"
    }
}
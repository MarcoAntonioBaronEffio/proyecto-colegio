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
    "success": true,
    "message": "Estudiante registrado con éxito",
    "data": {
        "id": "6f5dca4e-53ac-4176-9ec6-b0565da925ad",
        "email": "student@test.com",
        "firstName": "María",
        "lastName": "Pérez",
        "role": {
            "id": "c7c1c104-97fc-45a8-82cc-3f1362cecf15"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-24T09:53:27.104Z",
        "updatedAt": "2026-06-24T09:53:27.104Z",
        "school": {
            "id": "c5fd365c-a158-4e33-a734-cbf30781dbc9"
        }
    }
}
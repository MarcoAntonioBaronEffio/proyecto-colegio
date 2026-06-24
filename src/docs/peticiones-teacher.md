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
    "success": true,
    "message": "Profesor registrado con éxito",
    "data": {
        "id": "c7b3347d-7bd2-49fd-8cbf-6318287a02b8",
        "email": "teacher@test.com",
        "firstName": "Carlos",
        "lastName": "Ramirez",
        "role": {
            "id": "78a0cc51-934c-4b56-a7ff-a367d394f35b"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-24T09:52:55.225Z",
        "updatedAt": "2026-06-24T09:52:55.225Z",
        "school": {
            "id": "c5fd365c-a158-4e33-a734-cbf30781dbc9"
        }
    }
}
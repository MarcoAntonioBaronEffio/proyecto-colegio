✅ CREAR APODERADO

POST -> http://localhost:3000/api/auth/register

➡️ petición

{
    "email" : "guardian@test.com",
    "password": "12345678",
    "firstName" : "Juan",
    "lastName": "Pérez",
    "roleName": "GUARDIAN",
    "guardian": {
        "documentType": "DNI",
        "documentNumber": "87654321"
    }
}

⬅️ respueta

{
    "success": true,
    "message": "Apoderado registrado con éxito",
    "data": {
        "id": "9240ca18-66e1-49b1-a6b5-4166d78801e5",
        "email": "guardian@test.com",
        "firstName": "Juan",
        "lastName": "Pérez",
        "role": {
            "id": "92746d96-9481-4ad8-bc97-a11ba9c3f73f"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-24T09:22:58.235Z",
        "updatedAt": "2026-06-24T09:22:58.235Z",
        "school": {
            "id": "c5fd365c-a158-4e33-a734-cbf30781dbc9"
        }
    }
}
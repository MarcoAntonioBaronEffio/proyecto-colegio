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
    "succes": true,
    "message": "Usuario registrado con éxito",
    "data": {
        "id": "bc8e1298-4235-4fd2-ba07-1da169dedd26",
        "email": "guardian@test.com",
        "firstName": "Juan",
        "lastName": "Pérez",
        "role": {
            "id": "bdfea457-6b5a-4226-b700-33b2333dd517"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-01T18:29:49.927Z",
        "updatedAt": "2026-06-01T18:29:49.927Z"
    }
}
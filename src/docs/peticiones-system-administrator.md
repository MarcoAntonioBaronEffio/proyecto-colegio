✅ CREAR SYSTEM ADMINISTRATOR

POST -> http://localhost:3000/api/auth/register
POST -> https://proyecto-colegio-production.up.railway.app/api/auth/register

➡️ petición:

{
    "email": "systemadmin22@admin.com",
    "password": "12345678",
    "firstName": "Marco Tony",
    "lastName": "Barón Effio",
    "documentType": "DNI",
    "documentNumber": "12345672"
}

⬅️ respuesta:

{
    "success": true,
    "message": "System Administrator registrado con éxito",
    "data": {
        "id": "7fda0179-fae5-4ffe-854b-e63981a2ded0",
        "email": "systemadmin22@admin.com",
        "firstName": "Marco Tony",
        "lastName": "Barón Effio",
        "role": {
            "id": "7e9ae337-1fca-4b6a-8ed5-30ee50a41c26"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-08-30T22:47:01.145Z",
        "updatedAt": "2026-08-30T22:47:01.145Z"
    }
}
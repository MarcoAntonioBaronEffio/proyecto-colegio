✅ CREAR SYSTEM ADMINISTRATOR

POST -> http://localhost:3000/api/auth/register
POST -> https://proyecto-colegio-production.up.railway.app/api/auth/register

➡️ petición:

{
    "email": "systemadmin@admin.com",
    "password": "12345678",
    "firstName": "Marco Antonio",
    "lastName" : "Barón Effio",
    "roleName" : "SYSTEM_ADMINISTRATOR",
    "systemAdministrator": {
        "documentType" : "DNI",
        "documentNumber": "12345678"
    }
}

⬅️ respuesta:

{
    "succes": true,
    "message": "System Administrator registrado con éxito",
    "data": {
        "id": "1ad72de7-d119-4acf-a95b-c5b318994ae8",
        "email": "systemadmin@admin.com",
        "firstName": "Marco Antonio",
        "lastName": "Barón Effio",
        "role": {
            "id": "7e9ae337-1fca-4b6a-8ed5-30ee50a41c26"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-23T00:54:18.833Z",
        "updatedAt": "2026-06-23T00:54:18.833Z"
    }
}
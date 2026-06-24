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
    "success": true,
    "message": "System Administrator registrado con éxito",
    "data": {
        "id": "e54db3f8-bd18-499c-a679-6269444a8c4e",
        "email": "systemadmin@admin.com",
        "firstName": "Marco Antonio",
        "lastName": "Barón Effio",
        "role": {
            "id": "e707fdcf-d0fa-40b7-a5c8-9c89ffb576c3"
        },
        "phone": null,
        "address": null,
        "avatarUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-06-24T06:48:43.578Z",
        "updatedAt": "2026-06-24T06:48:43.578Z"
    }
}
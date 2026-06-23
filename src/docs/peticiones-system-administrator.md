✅ CREAR SYSTEM ADMINISTRATOR

POST -> http://localhost:3000/api/auth/register
POST -> https://proyecto-colegio-production.up.railway.app/api/auth/register

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
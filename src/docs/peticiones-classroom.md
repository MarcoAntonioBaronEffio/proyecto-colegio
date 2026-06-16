✅ CREAR AULA

POST -> http://localhost:3000/api/classrooms


➡️ petición

{
    "name" : "Aula 101",
    "code" : "A101",
    "description" : "Ubicado en el primer piso",
    "capacity" : 30,
    "floor" : 1
}

⬅️ respuesta: 

{
    "success": true,
    "message": "Aula creada correctamente",
    "data": {
        "id": "4db6f471-d9ed-4264-9737-0f595118ce5d",
        "name": "Aula 101",
        "code": "A101",
        "description": "Ubicado en el primer piso",
        "capacity": 30,
        "floor": 1,
        "status": "ACTIVE",
        "createdAt": "2026-05-10T06:25:26.538Z",
        "updatedAt": "2026-05-10T06:25:26.538Z"
    }
}

-----------------------------------------------------------------------------

✅ OBTENER TODAS LAS AULAS

GET -> http://localhost:3000/api/classrooms

➡️ petición : NO LLEVA BODY

⬅️ respuesta :

{
    "success": true,
    "message": "Aulas obtenidas correctamente",
    "data": [
        {
            "id": "4db6f471-d9ed-4264-9737-0f595118ce5d",
            "name": "Aula 101",
            "code": "A101",
            "description": "Ubicado en el primer piso",
            "capacity": 30,
            "floor": 1,
            "status": "ACTIVE",
            "createdAt": "2026-05-10T06:25:26.538Z",
            "updatedAt": "2026-05-10T06:25:26.538Z"
        },
        {
            "id": "5953437e-1fe6-436f-b56f-6ed78867b2ac",
            "name": "Aula 102",
            "code": "A102",
            "description": "Ubicado en el primer piso",
            "capacity": 30,
            "floor": 1,
            "status": "ACTIVE",
            "createdAt": "2026-05-10T06:46:52.643Z",
            "updatedAt": "2026-05-10T06:46:52.643Z"
        }
    ]
}
 
-----------------------------------------------------------------------------

✅ OBTENER AULA POR ID

GET -> http://localhost:3000/api/classrooms/UUID

Ejemplo: http://localhost:3000/api/classrooms/4db6f471-d9ed-4264-9737-0f595118ce5d

➡️ petición: NO LLEVA BODY

⬅️ respuesta:

{
    "success": true,
    "message": "Aula encontrada",
    "data": {
        "id": "4db6f471-d9ed-4264-9737-0f595118ce5d",
        "name": "Aula 101",
        "code": "A101",
        "description": "Ubicado en el primer piso",
        "capacity": 30,
        "floor": 1,
        "status": "ACTIVE",
        "sections": [],
        "createdAt": "2026-05-10T06:25:26.538Z",
        "updatedAt": "2026-05-10T06:25:26.538Z"
    }
}

-----------------------------------------------------------------------------

✅ ACTUALIZAR AULA

PATCH -> http://localhost:3000/api/classrooms/UUID

Ejemplo: PATCH http://localhost:3000/api/classrooms/4db6f471-d9ed-4264-9737-0f595118ce5d

➡️ petición: 

{
    "name" : "Aula Multimedia",
    "capacity" : 40
}

⬅️ respuesta: 

{
    "success": true,
    "message": "Aula actualizada correctamente",
    "data": {
        "id": "4db6f471-d9ed-4264-9737-0f595118ce5d",
        "name": "Aula Multimedia",
        "code": "A101",
        "description": "Ubicado en el primer piso",
        "capacity": 40,
        "floor": 1,
        "status": "ACTIVE",
        "sections": [],
        "createdAt": "2026-05-10T06:25:26.538Z",
        "updatedAt": "2026-05-10T06:50:12.759Z"
    }
}

-----------------------------------------------------------------------------
 
 ✅ CAMBIAR ESTADO DEL AULA

 PATCH http://localhost:3000/api/classrooms/UUID/status

 Ejemplo: http://localhost:3000/api/classrooms/4db6f471-d9ed-4264-9737-0f595118ce5d/status

 ➡️ petición:

 🔴 Inactivar aula

 {
    "status" : "INACTIVE"
 }

 🟢 Activar aula

 {
    "status" : "ACTIVE"
 }


 ⬅️ respuesta: 

 {
    "success": true,
    "message": "Estado del aula actualizado correctamente",
    "data": {
        "id": "4db6f471-d9ed-4264-9737-0f595118ce5d",
        "name": "Aula Multimedia",
        "code": "A101",
        "description": "Ubicado en el primer piso",
        "capacity": 40,
        "floor": 1,
        "status": "INACTIVE",
        "createdAt": "2026-05-10T06:25:26.538Z",
        "updatedAt": "2026-05-10T07:01:11.276Z"
    }
}

-----------------------------------------------------------------------------

✅ ELIMINAR AULA

DELETE http://localhost:3000/api/classrooms/UUID

Ejemplo: http://localhost:3000/api/classrooms/4db6f471-d9ed-4264-9737-0f595118ce5d

➡️ petición -> NO LLEVA BODY

⬅️ respuesta:

{
    "success": true,
    "message": "Aula eliminada correctamente",
    "data": {
        "name": "Aula Multimedia",
        "code": "A101",
        "description": "Ubicado en el primer piso",
        "capacity": 40,
        "floor": 1,
        "status": "INACTIVE",
        "sections": [],
        "createdAt": "2026-05-10T06:25:26.538Z",
        "updatedAt": "2026-05-10T07:01:11.276Z"
    }
}
✅ CREAR SECCIÓN

POST -> http://localhost:3000/api/sections

❕ UNA SECCIÓN SOLO PERTENECE A UN AULA EN UN UNICO TURNO


➡️ petición

{
    "name" : "B",
    "shift" : "AFTERNOON",
    "gradeId" : "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
    "classroomId" : "bd76e1b5-a4ba-427d-b24a-915de7da7423"
}

// ⬅️ respuesta

{
    "success": true,
    "message": "Sección creada correctamente",
    "data": {
        "id": "1ae2fbb4-5bc2-4d3c-b324-f33d33efbdf6",
        "name": "B",
        "shift": "AFTERNOON",
        "status": "ACTIVE",
        "grade": {
            "id": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
            "gradeNumber": 1,
            "level": "SECONDARY",
            "status": "ACTIVE",
            "createdAt": "2026-04-20T19:39:05.710Z",
            "updatedAt": "2026-04-20T19:39:05.710Z"
        },
        "gradeId": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
        "classroom": {
            "id": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
            "name": "13",
            "code": "A13",
            "description": "Aula de la azotea",
            "capacity": 20,
            "floor": 3,
            "status": "ACTIVE",
            "createdAt": "2026-05-13T20:20:18.461Z",
            "updatedAt": "2026-05-21T03:06:06.994Z"
        },
        "classroomId": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
        "createdAt": "2026-05-24T19:16:04.734Z",
        "updatedAt": "2026-05-24T19:16:04.734Z"
    }
}


⚠️ SI INTENTAS ASIGNAR UNA SECCIÓN A UN AULA YA OCUPADA EN EL MISMO TURNO, EL SERVIDOR RESPONDERÁ:

{
    "message": "Ya existe la sección \"A\" en este grado para el turno AFTERNOON.",
    "error": "Bad Request",
    "statusCode": 400
}

-----------------------------------------------------------------------------

✅ OBTENER TODAS LAS SECCIONES

GET -> http://localhost:3000/api/sections

➡️ petición: NO LLEVA BODY

⬅️ respuesta:

{
    "success": true,
    "message": "Secciones obtenidas correctamente",
    "data": [
        {
            "id": "cc9edc29-d5c7-4b73-b86a-782e83e14cd9",
            "name": "A",
            "shift": "MORNING",
            "status": "INACTIVE",
            "grade": {
                "id": "15c5373f-c726-43db-a627-3b483cb207d5",
                "gradeNumber": 1,
                "level": "PRIMARY",
                "status": "ACTIVE",
                "createdAt": "2026-04-20T19:23:33.817Z",
                "updatedAt": "2026-04-20T19:23:33.817Z",
                "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
            },
            "gradeId": "15c5373f-c726-43db-a627-3b483cb207d5",
            "classroom": {
                "id": "9609411a-1695-429e-9ac3-4ee089e11b6e",
                "name": "Aula 01",
                "code": "A01",
                "description": "Aula 01 ubicado en el primer piso",
                "capacity": 26,
                "floor": 1,
                "status": "ACTIVE",
                "createdAt": "2026-05-25T05:47:57.450Z",
                "updatedAt": "2026-05-25T05:47:57.450Z"
            },
            "classroomId": "9609411a-1695-429e-9ac3-4ee089e11b6e",
            "createdAt": "2026-05-29T21:20:22.144Z",
            "updatedAt": "2026-05-29T21:21:07.711Z"
        },
        {
            "id": "d61a101f-5df0-4cdd-9e7e-b8522df81e5f",
            "name": "D",
            "shift": "AFTERNOON",
            "status": "INACTIVE",
            "grade": {
                "id": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
                "gradeNumber": 1,
                "level": "SECONDARY",
                "status": "ACTIVE",
                "createdAt": "2026-04-20T19:39:05.710Z",
                "updatedAt": "2026-04-20T19:39:05.710Z",
                "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
            },
            "gradeId": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
            "classroom": {
                "id": "b0660c29-ac4d-4c12-b132-eefab9d0c1e4",
                "name": "Aula 104",
                "code": "A104",
                "description": "Ubicada en El primer piso",
                "capacity": 22,
                "floor": 1,
                "status": "ACTIVE",
                "createdAt": "2026-05-13T23:40:09.098Z",
                "updatedAt": "2026-05-13T23:40:09.098Z"
            },
            "classroomId": "b0660c29-ac4d-4c12-b132-eefab9d0c1e4",
            "createdAt": "2026-05-28T19:25:30.771Z",
            "updatedAt": "2026-05-29T21:18:21.364Z"
        },
        {
            "id": "8f9adde6-f07e-420d-a737-e045131b23c2",
            "name": "E",
            "shift": "MORNING",
            "status": "ACTIVE",
            "grade": {
                "id": "15c5373f-c726-43db-a627-3b483cb207d5",
                "gradeNumber": 1,
                "level": "PRIMARY",
                "status": "ACTIVE",
                "createdAt": "2026-04-20T19:23:33.817Z",
                "updatedAt": "2026-04-20T19:23:33.817Z",
                "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
            },
            "gradeId": "15c5373f-c726-43db-a627-3b483cb207d5",
            "classroom": {
                "id": "5953437e-1fe6-436f-b56f-6ed78867b2ac",
                "name": "Aula 102",
                "code": "A102",
                "description": "Ubicado en el primer piso",
                "capacity": 30,
                "floor": 1,
                "status": "ACTIVE",
                "createdAt": "2026-05-10T06:46:52.643Z",
                "updatedAt": "2026-05-10T06:46:52.643Z"
            },
            "classroomId": "5953437e-1fe6-436f-b56f-6ed78867b2ac",
            "createdAt": "2026-05-28T19:36:07.198Z",
            "updatedAt": "2026-05-29T21:18:15.840Z"
        },
        {
            "id": "390c1332-ced9-4ed8-a27f-dbb762b20139",
            "name": "F",
            "shift": "MORNING",
            "status": "ACTIVE",
            "grade": {
                "id": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
                "gradeNumber": 1,
                "level": "SECONDARY",
                "status": "ACTIVE",
                "createdAt": "2026-04-20T19:39:05.710Z",
                "updatedAt": "2026-04-20T19:39:05.710Z",
                "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
            },
            "gradeId": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
            "classroom": {
                "id": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
                "name": "13",
                "code": "A13",
                "description": "Aula de la azotea",
                "capacity": 20,
                "floor": 3,
                "status": "ACTIVE",
                "createdAt": "2026-05-13T20:20:18.461Z",
                "updatedAt": "2026-05-29T20:23:39.996Z"
            },
            "classroomId": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
            "createdAt": "2026-05-27T22:47:06.604Z",
            "updatedAt": "2026-05-29T21:18:12.240Z"
        },
        {
            "id": "e0553c66-7f08-46f6-8c14-66051dfc4e21",
            "name": "M",
            "shift": "MORNING",
            "status": "ACTIVE",
            "grade": {
                "id": "15c5373f-c726-43db-a627-3b483cb207d5",
                "gradeNumber": 1,
                "level": "PRIMARY",
                "status": "ACTIVE",
                "createdAt": "2026-04-20T19:23:33.817Z",
                "updatedAt": "2026-04-20T19:23:33.817Z",
                "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
            },
            "gradeId": "15c5373f-c726-43db-a627-3b483cb207d5",
            "classroom": {
                "id": "c866fc16-51c8-42dd-a84c-0fb4bdb6a578",
                "name": "Aula 69",
                "code": "sex69",
                "description": "sexxx",
                "capacity": 22,
                "floor": 1,
                "status": "ACTIVE",
                "createdAt": "2026-05-29T17:42:27.105Z",
                "updatedAt": "2026-05-29T17:42:27.105Z"
            },
            "classroomId": "c866fc16-51c8-42dd-a84c-0fb4bdb6a578",
            "createdAt": "2026-05-29T19:21:09.760Z",
            "updatedAt": "2026-05-29T21:18:11.261Z"
        },
        {
            "id": "b504fd2e-75dd-4ea8-a605-478dbd65b2f7",
            "name": "X",
            "shift": "MORNING",
            "status": "INACTIVE",
            "grade": {
                "id": "15c5373f-c726-43db-a627-3b483cb207d5",
                "gradeNumber": 1,
                "level": "PRIMARY",
                "status": "ACTIVE",
                "createdAt": "2026-04-20T19:23:33.817Z",
                "updatedAt": "2026-04-20T19:23:33.817Z",
                "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
            },
            "gradeId": "15c5373f-c726-43db-a627-3b483cb207d5",
            "classroom": {
                "id": "d307cdda-c3b9-45fc-907a-965bb7668c24",
                "name": "Aula 1000",
                "code": "A1000",
                "description": "Aula mil",
                "capacity": 25,
                "floor": 1,
                "status": "ACTIVE",
                "createdAt": "2026-05-27T22:08:36.664Z",
                "updatedAt": "2026-05-27T22:08:36.664Z"
            },
            "classroomId": "d307cdda-c3b9-45fc-907a-965bb7668c24",
            "createdAt": "2026-05-28T19:05:00.435Z",
            "updatedAt": "2026-05-29T21:18:13.691Z"
        },
        {
            "id": "5619e168-a747-43e6-9ff6-0426da4c2ce8",
            "name": "Z",
            "shift": "MORNING",
            "status": "ACTIVE",
            "grade": {
                "id": "e7c53880-daec-4f75-afdf-f74cb39ff7fa",
                "gradeNumber": 6,
                "level": "PRIMARY",
                "status": "ACTIVE",
                "createdAt": "2026-04-24T07:04:49.793Z",
                "updatedAt": "2026-04-24T07:11:40.347Z",
                "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
            },
            "gradeId": "e7c53880-daec-4f75-afdf-f74cb39ff7fa",
            "classroom": {
                "id": "8cd2621a-5999-4c62-9dae-77026c742fc5",
                "name": "Laboratorio",
                "code": "Lab01",
                "description": "ssadas",
                "capacity": 11,
                "floor": 1,
                "status": "ACTIVE",
                "createdAt": "2026-05-27T22:09:27.754Z",
                "updatedAt": "2026-05-27T22:26:22.490Z"
            },
            "classroomId": "8cd2621a-5999-4c62-9dae-77026c742fc5",
            "createdAt": "2026-05-28T19:05:55.323Z",
            "updatedAt": "2026-05-28T19:05:55.323Z"
        },
        {
            "id": "e734721a-048a-4a02-b6dc-8301dc96d264",
            "name": "Z",
            "shift": "AFTERNOON",
            "status": "INACTIVE",
            "grade": {
                "id": "ee3a689d-4ad9-4923-99c2-14905e88b267",
                "gradeNumber": 3,
                "level": "PRIMARY",
                "status": "ACTIVE",
                "createdAt": "2026-04-21T23:41:13.623Z",
                "updatedAt": "2026-04-22T03:44:35.859Z",
                "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
            },
            "gradeId": "ee3a689d-4ad9-4923-99c2-14905e88b267",
            "classroom": {
                "id": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
                "name": "13",
                "code": "A13",
                "description": "Aula de la azotea",
                "capacity": 20,
                "floor": 3,
                "status": "ACTIVE",
                "createdAt": "2026-05-13T20:20:18.461Z",
                "updatedAt": "2026-05-29T20:23:39.996Z"
            },
            "classroomId": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
            "createdAt": "2026-05-24T20:33:21.540Z",
            "updatedAt": "2026-05-29T21:18:23.525Z"
        },
        {
            "id": "fd186fa3-0f7a-4911-830a-5e714850be75",
            "name": "Z",
            "shift": "AFTERNOON",
            "status": "ACTIVE",
            "grade": {
                "id": "5aa8082a-57ca-4aff-a526-98b30c4852f3",
                "gradeNumber": 5,
                "level": "SECONDARY",
                "status": "ACTIVE",
                "createdAt": "2026-05-28T18:49:07.381Z",
                "updatedAt": "2026-05-28T18:49:07.381Z",
                "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
            },
            "gradeId": "5aa8082a-57ca-4aff-a526-98b30c4852f3",
            "classroom": {
                "id": "8cd2621a-5999-4c62-9dae-77026c742fc5",
                "name": "Laboratorio",
                "code": "Lab01",
                "description": "ssadas",
                "capacity": 11,
                "floor": 1,
                "status": "ACTIVE",
                "createdAt": "2026-05-27T22:09:27.754Z",
                "updatedAt": "2026-05-27T22:26:22.490Z"
            },
            "classroomId": "8cd2621a-5999-4c62-9dae-77026c742fc5",
            "createdAt": "2026-05-28T19:24:04.647Z",
            "updatedAt": "2026-05-28T19:24:04.647Z"
        }
    ]
}

-----------------------------------------------------------------------------

✅ OBTENER SECCIÓN POR ID

GET -> http://localhost:3000/api/sections/UUID

Ejemplo: http://localhost:3000/api/sections/e734721a-048a-4a02-b6dc-8301dc96d264

➡️ petición: NO LLEVA BODY

⬅️ respuesta: 

{
    "success": true,
    "message": "Sección encontrada",
    "data": {
        "id": "e734721a-048a-4a02-b6dc-8301dc96d264",
        "name": "Z",
        "shift": "AFTERNOON",
        "status": "ACTIVE",
        "grade": {
            "id": "ee3a689d-4ad9-4923-99c2-14905e88b267",
            "gradeNumber": 3,
            "level": "PRIMARY",
            "status": "ACTIVE",
            "createdAt": "2026-04-21T23:41:13.623Z",
            "updatedAt": "2026-04-22T03:44:35.859Z",
            "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
        },
        "gradeId": "ee3a689d-4ad9-4923-99c2-14905e88b267",
        "classroom": {
            "id": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
            "name": "13",
            "code": "A13",
            "description": "Aula de la azotea",
            "capacity": 20,
            "floor": 3,
            "status": "ACTIVE",
            "createdAt": "2026-05-13T20:20:18.461Z",
            "updatedAt": "2026-05-21T03:06:06.994Z"
        },
        "classroomId": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
        "createdAt": "2026-05-24T20:33:21.540Z",
        "updatedAt": "2026-05-24T22:31:57.497Z"
    }
}
-----------------------------------------------------------------------------

✅ ACTUALIZAR SECCIÓN

PATCH -> http://localhost:3000/api/sections/UUID

Ejemplo: PATCH http://localhost:3000/api/sections/e734721a-048a-4a02-b6dc-8301dc96d264

➡️ petición:

{
    "name" : "Z",
    "shift" : "AFTERNOON",
    "gradeId" : "ee3a689d-4ad9-4923-99c2-14905e88b267",
    "classroomId" : "5953437e-1fe6-436f-b56f-6ed78867b2ac"
}

⬅️ respuesta: 

{
    "success": true,
    "message": "Sección actualizada correctamente",
    "data": {
        "id": "e734721a-048a-4a02-b6dc-8301dc96d264",
        "name": "Z",
        "shift": "AFTERNOON",
        "status": "ACTIVE",
        "grade": {
            "id": "ee3a689d-4ad9-4923-99c2-14905e88b267",
            "gradeNumber": 3,
            "level": "PRIMARY",
            "status": "ACTIVE",
            "createdAt": "2026-04-21T23:41:13.623Z",
            "updatedAt": "2026-04-22T03:44:35.859Z",
            "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
        },
        "gradeId": "ee3a689d-4ad9-4923-99c2-14905e88b267",
        "classroom": {
            "id": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
            "name": "13",
            "code": "A13",
            "description": "Aula de la azotea",
            "capacity": 20,
            "floor": 3,
            "status": "ACTIVE",
            "createdAt": "2026-05-13T20:20:18.461Z",
            "updatedAt": "2026-05-21T03:06:06.994Z"
        },
        "classroomId": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
        "createdAt": "2026-05-24T20:33:21.540Z",
        "updatedAt": "2026-05-24T22:31:57.497Z"
    }
}





-----------------------------------------------------------------------------

✅ CAMBIAR ESTADO DE LA SECCIÓN

PATCH http://localhost:3000/api/sections/UUID/status

Ejemplo: http://localhost:3000/api/sections/cc9edc29-d5c7-4b73-b86a-782e83e14cd9/status

➡️ petición:

🔴 Inactivar sección

{
    "status" : "INACTIVE"
}

🟢 Activar sección

{
    "status" : "ACTIVE"
}

⬅️ respuesta:

{
    "success": true,
    "message": "Estado de la sección actualizado correctamente",
    "data": {
        "id": "cc9edc29-d5c7-4b73-b86a-782e83e14cd9",
        "name": "A",
        "shift": "MORNING",
        "status": "INACTIVE",
        "grade": {
            "id": "15c5373f-c726-43db-a627-3b483cb207d5",
            "gradeNumber": 1,
            "level": "PRIMARY",
            "status": "ACTIVE",
            "createdAt": "2026-04-20T19:23:33.817Z",
            "updatedAt": "2026-04-20T19:23:33.817Z",
            "schoolYearId": "5736114e-f351-448b-9287-f88baaabe1fa"
        },
        "gradeId": "15c5373f-c726-43db-a627-3b483cb207d5",
        "classroom": {
            "id": "9609411a-1695-429e-9ac3-4ee089e11b6e",
            "name": "Aula 01",
            "code": "A01",
            "description": "Aula 01 ubicado en el primer piso",
            "capacity": 26,
            "floor": 1,
            "status": "ACTIVE",
            "createdAt": "2026-05-25T05:47:57.450Z",
            "updatedAt": "2026-05-25T05:47:57.450Z"
        },
        "classroomId": "9609411a-1695-429e-9ac3-4ee089e11b6e",
        "createdAt": "2026-05-29T21:20:22.144Z",
        "updatedAt": "2026-05-29T21:21:07.711Z"
    }
}

-----------------------------------------------------------------------------

✅ ELIMINAR SECCIÓN

DELETE http://localhost:3000/api/sections/UUID

Ejemplo: http://localhost:3000/api/sections/0f897e05-3034-41a0-a205-7fe3bbe5e61a

➡️ petición -> NO LLEVA BODY

⬅️ respuesta:

{
    "success": true,
    "message": "Sección eliminada correctamente",
    "data": {
        "name": "A",
        "shift": "MORNING",
        "status": "ACTIVE",
        "gradeId": "5ef5e1ab-9e33-4127-bed2-c14f6c941715",
        "classroomId": "bd76e1b5-a4ba-427d-b24a-915de7da7423",
        "createdAt": "2026-05-24T21:11:40.303Z",
        "updatedAt": "2026-05-24T21:11:40.303Z"
    }
}
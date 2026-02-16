# GraphQL Queries para Vetra

## Endpoints Disponibles

- **Supergraph**: `http://localhost:4001/d/graphql`
- **DAOs**: `http://localhost:4001/graphql/dao`
- **Proposals**: `http://localhost:4001/graphql/proposal`
- **Tasks**: `http://localhost:4001/graphql/task`

## Variables de entorno

```bash
VETRA_DRIVE_ID=preview-81d3e4ae  # Drive donde están tus documentos
```

---

## 📊 DAOs Queries

### Listar todos los DAOs

```graphql
query GetAllDaos($driveId: String!) {
  Dao {
    getDocuments(driveId: $driveId) {
      id
      name
      documentType
      createdAtUtcIso
      lastModifiedAtUtcIso
      revision
      state {
        name
        description
        ownerUserId
        members {
          id
          name
          role
          joinedAt
        }
      }
    }
  }
}
```

**Variables:**
```json
{
  "driveId": "preview-81d3e4ae"
}
```

### Obtener un DAO específico

```graphql
query GetDao($docId: PHID!) {
  Dao {
    getDocument(docId: $docId) {
      id
      name
      state {
        name
        description
        ownerUserId
        members {
          id
          name
          role
          joinedAt
        }
      }
    }
  }
}
```

**Variables:**
```json
{
  "docId": "c47942a1-4450-4571-a355-75313765abc3"
}
```

### Crear un DAO

```graphql
mutation CreateDao($name: String!, $driveId: String) {
  Dao_createDocument(name: $name, driveId: $driveId)
}
```

**Variables:**
```json
{
  "name": "Mi Nuevo DAO",
  "driveId": "preview-81d3e4ae"
}
```

### Actualizar nombre de DAO

```graphql
mutation SetDaoName($docId: PHID, $driveId: String, $input: Dao_SetDaoNameInput!) {
  Dao_setDaoName(docId: $docId, driveId: $driveId, input: $input)
}
```

**Variables:**
```json
{
  "docId": "c47942a1-4450-4571-a355-75313765abc3",
  "driveId": "preview-81d3e4ae",
  "input": {
    "name": "Nombre Actualizado"
  }
}
```

---

## 📋 Proposals Queries

### Listar todas las Proposals

```graphql
query GetAllProposals($driveId: String!) {
  Proposal {
    getDocuments(driveId: $driveId) {
      id
      name
      state {
        title
        description
        status
        createdBy
        createdAt
        daoId
        budget
        deadline
        closedAt
      }
    }
  }
}
```

**Variables:**
```json
{
  "driveId": "preview-81d3e4ae"
}
```

### Obtener una Proposal específica

```graphql
query GetProposal($docId: PHID!) {
  Proposal {
    getDocument(docId: $docId) {
      id
      name
      state {
        title
        description
        status
        createdBy
        createdAt
        daoId
        budget
        deadline
        closedAt
      }
    }
  }
}
```

**Variables:**
```json
{
  "docId": "11094174-259b-4628-b87f-b7709fd1c935"
}
```

### Crear una Proposal

```graphql
mutation CreateProposal($name: String!, $driveId: String) {
  Proposal_createDocument(name: $name, driveId: $driveId)
}
```

**Variables:**
```json
{
  "name": "Nueva Proposal",
  "driveId": "preview-81d3e4ae"
}
```

### Actualizar detalles de Proposal

```graphql
mutation SetProposalDetails($docId: PHID, $driveId: String, $input: Proposal_SetProposalDetailsInput!) {
  Proposal_setProposalDetails(docId: $docId, driveId: $driveId, input: $input)
}
```

**Variables:**
```json
{
  "docId": "11094174-259b-4628-b87f-b7709fd1c935",
  "driveId": "preview-81d3e4ae",
  "input": {
    "title": "Propuesta Actualizada",
    "description": "Nueva descripción",
    "budget": 5000,
    "deadline": "2026-12-31T23:59:59Z"
  }
}
```

### Actualizar status de Proposal

```graphql
mutation UpdateProposalStatus($docId: PHID, $driveId: String, $input: Proposal_UpdateProposalStatusInput!) {
  Proposal_updateProposalStatus(docId: $docId, driveId: $driveId, input: $input)
}
```

**Variables:**
```json
{
  "docId": "11094174-259b-4628-b87f-b7709fd1c935",
  "driveId": "preview-81d3e4ae",
  "input": {
    "status": "OPEN"
  }
}
```

---

## ✅ Tasks Queries

### Listar todas las Tasks

```graphql
query GetAllTasks($driveId: String!) {
  Task {
    getDocuments(driveId: $driveId) {
      id
      name
      state {
        title
        description
        status
        assignee
        proposalId
        daoId
        deadline
        budget
        createdAt
        createdBy
        updatedAt
        documents {
          id
          kind
          url
        }
      }
    }
  }
}
```

**Variables:**
```json
{
  "driveId": "preview-81d3e4ae"
}
```

### Obtener una Task específica

```graphql
query GetTask($docId: PHID!) {
  Task {
    getDocument(docId: $docId) {
      id
      name
      state {
        title
        description
        status
        assignee
        proposalId
        daoId
        deadline
        budget
        createdAt
        createdBy
        updatedAt
      }
    }
  }
}
```

**Variables:**
```json
{
  "docId": "0bab2e68-ee9f-44d4-a881-690552be5aaa"
}
```

### Crear una Task

```graphql
mutation CreateTask($name: String!, $driveId: String) {
  Task_createDocument(name: $name, driveId: $driveId)
}
```

**Variables:**
```json
{
  "name": "Nueva Task",
  "driveId": "preview-81d3e4ae"
}
```

### Actualizar detalles de Task

```graphql
mutation SetTaskDetails($docId: PHID, $driveId: String, $input: Task_SetTaskDetailsInput!) {
  Task_setTaskDetails(docId: $docId, driveId: $driveId, input: $input)
}
```

**Variables:**
```json
{
  "docId": "0bab2e68-ee9f-44d4-a881-690552be5aaa",
  "driveId": "preview-81d3e4ae",
  "input": {
    "title": "Task Actualizada",
    "description": "Nueva descripción de la task",
    "budget": 1000,
    "deadline": "2026-12-31T23:59:59Z"
  }
}
```

### Actualizar status de Task

```graphql
mutation UpdateTaskStatus($docId: PHID, $driveId: String, $input: Task_UpdateTaskStatusInput!) {
  Task_updateTaskStatus(docId: $docId, driveId: $driveId, input: $input)
}
```

**Variables:**
```json
{
  "docId": "0bab2e68-ee9f-44d4-a881-690552be5aaa",
  "driveId": "preview-81d3e4ae",
  "input": {
    "status": "IN_PROGRESS"
  }
}
```

### Asignar Task

```graphql
mutation AssignTask($docId: PHID, $driveId: String, $input: Task_AssignTaskInput!) {
  Task_assignTask(docId: $docId, driveId: $driveId, input: $input)
}
```

**Variables:**
```json
{
  "docId": "0bab2e68-ee9f-44d4-a881-690552be5aaa",
  "driveId": "preview-81d3e4ae",
  "input": {
    "assignee": "juan.perez@example.com"
  }
}
```

---

## 🔍 Schema Introspection

### Ver todos los tipos disponibles

```graphql
query GetSchema {
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

### Ver queries disponibles

```graphql
query GetQueries {
  __schema {
    queryType {
      fields {
        name
        description
        args {
          name
          type {
            name
            kind
          }
        }
      }
    }
  }
}
```

### Ver mutations disponibles

```graphql
query GetMutations {
  __schema {
    mutationType {
      fields {
        name
        description
        args {
          name
          type {
            name
            kind
          }
        }
      }
    }
  }
}
```

---

## 🛠️ Cómo usar con Apollo Client

### Instalación

```bash
npm install @apollo/client graphql
```

### Setup básico

```typescript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4001/d/graphql',
  cache: new InMemoryCache(),
});

// Ejemplo de query
const GET_DAOS = gql`
  query GetDaos($driveId: String!) {
    Dao {
      getDocuments(driveId: $driveId) {
        id
        name
        state {
          name
          description
        }
      }
    }
  }
`;

// Ejecutar query
client
  .query({
    query: GET_DAOS,
    variables: { driveId: 'preview-81d3e4ae' },
  })
  .then(result => console.log(result));
```

---

## 🔗 Testing con curl

```bash
# Ejemplo: Listar DAOs
curl -X POST http://localhost:4001/graphql/dao \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetDaos($driveId: String!) { Dao { getDocuments(driveId: $driveId) { id name state { name description } } } }",
    "variables": { "driveId": "preview-81d3e4ae" }
  }'
```

---

## 📍 Dónde están almacenados los datos

Los documentos están almacenados en el **Drive de Vetra**:

- **Drive ID**: `preview-81d3e4ae` (Vetra Preview)
- **Ubicación física**: Base de datos local de Vetra (SQLite/PGLite)
- **Acceso**: A través del reactor GraphQL en `http://localhost:4001`
- **Persistencia**: Los datos persisten mientras el drive existe en Vetra

Cada documento (DAO, Proposal, Task) es un documento individual dentro del drive, con:
- ID único (PHID)
- Tipo de documento (`roxium/dao`, `roxium/proposal`, `roxium/task`)
- Estado (state) con los campos específicos del modelo
- Operaciones (operations) que representan el historial de cambios

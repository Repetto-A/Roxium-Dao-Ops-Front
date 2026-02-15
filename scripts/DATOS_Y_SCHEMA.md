# 📊 Guía Completa: Datos y Schema de Vetra

## 🎯 Resumen Rápido

Tienes **3 formas** de explorar y consultar tus datos:

1. **🔧 Scripts CLI** - Línea de comandos (lo más rápido)
2. **🌐 GraphQL Playground** - Interfaz visual en el navegador
3. **📱 Apollo Client** - Desde tu aplicación React/Next.js

---

## 📍 Ubicación de tus Datos

### Datos actuales encontrados:

- **8 DAOs** en el sistema
- **4 Proposals** (1 DRAFT, 1 OPEN, 1 CLOSED, 1 ARCHIVED)
- **5 Tasks** (2 TODO, 1 IN_PROGRESS, 1 DONE, 1 ARCHIVED)

### Almacenamiento físico:

```
/home/repe/projects/claudio/roxium-dao-vetra/.ph/drive-storage/
├── document-preview-81d3e4ae.json    (Drive principal con índice)
├── document-<dao-id>.json            (Cada DAO)
├── document-<proposal-id>.json       (Cada Proposal)
└── document-<task-id>.json           (Cada Task)
```

**Nota**: Cada documento es un archivo JSON independiente que contiene:
- `header`: Metadata (ID, tipo, fechas)
- `state`: Estado actual del documento
- `operations`: Historial completo de cambios

---

## 1️⃣ Explorar con Scripts CLI

### Ver todos tus datos:

```bash
cd /home/repe/projects/claudio/roxium-dao-ops-front
bash scripts/query-data.sh
```

Salida:
```
📊 DAOS: 8 encontrados
📋 PROPOSALS: 4 encontradas
✅ TASKS: 5 encontradas
```

### Ver un documento específico:

```bash
bash scripts/explore-storage.sh c47942a1-4450-4571-a355-75313765abc3
```

Muestra:
- Tipo de documento
- Estado completo (JSON)
- Número de operaciones
- Fechas de creación/modificación

---

## 2️⃣ GraphQL Playground (Interfaz Visual)

### Opción A: Altair GraphQL Client

1. **Instalar Altair** (extensión Chrome/Firefox):
   - Chrome: https://chrome.google.com/webstore/detail/altair-graphql-client/
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/altair-graphql-client/

2. **Configurar endpoint**:
   ```
   URL: http://localhost:4001/d/graphql
   ```

3. **Ejemplo de query**:
   ```graphql
   query GetDaos {
     Dao {
       getDocuments(driveId: "preview-81d3e4ae") {
         id
         name
         state {
           name
           description
           members {
             id
             name
             role
           }
         }
       }
     }
   }
   ```

### Opción B: GraphiQL Online

1. Ir a: https://graphiql-online.com/
2. Configurar endpoint: `http://localhost:4001/d/graphql`
3. Pegar queries del archivo `scripts/graphql-queries.md`

### Opción C: Instalar GraphQL Playground localmente

```bash
npm install -g graphql-playground
graphql-playground
```

Abrir: `http://localhost:3000`

---

## 3️⃣ Apollo Client (Desde tu App)

### Setup en Next.js

#### 1. Instalar dependencias:

```bash
npm install @apollo/client graphql
```

#### 2. Crear Apollo Client:

```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_VETRA_GRAPHQL_URL || 'http://localhost:4001/d/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

#### 3. Envolver tu app con ApolloProvider:

```typescript
// app/layout.tsx
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ApolloProvider client={apolloClient}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
```

#### 4. Usar en componentes:

```typescript
import { useQuery, gql } from '@apollo/client';

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

function DaoList() {
  const { loading, error, data } = useQuery(GET_DAOS, {
    variables: { driveId: 'preview-81d3e4ae' },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.Dao.getDocuments.map((dao) => (
        <li key={dao.id}>{dao.state.name}</li>
      ))}
    </ul>
  );
}
```

---

## 📚 Endpoints GraphQL Disponibles

| Endpoint | Descripción |
|----------|-------------|
| `http://localhost:4001/d/graphql` | **Supergraph** - Todos los tipos |
| `http://localhost:4001/graphql/dao` | Solo DAOs |
| `http://localhost:4001/graphql/proposal` | Solo Proposals |
| `http://localhost:4001/graphql/task` | Solo Tasks |

**Recomendación**: Usa el supergraph (`/d/graphql`) para queries que necesiten múltiples tipos.

---

## 🔍 Schema Introspection

### Ver schema completo en CLI:

```bash
# Ver todos los tipos
curl -X POST http://localhost:4001/d/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name kind } } }"}' | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf-8')), null, 2))"

# Ver queries disponibles
curl -X POST http://localhost:4001/d/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { queryType { fields { name } } } }"}'

# Ver mutations disponibles
curl -X POST http://localhost:4001/d/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { mutationType { fields { name } } } }"}'
```

### Ver schema en GraphQL Playground:

En cualquier cliente GraphQL, esta query muestra todo el schema:

```graphql
query IntrospectionQuery {
  __schema {
    queryType { name }
    mutationType { name }
    types {
      name
      kind
      description
      fields {
        name
        description
        type {
          name
          kind
        }
      }
    }
  }
}
```

---

## 💾 Estructura de un Documento

Cada archivo JSON en el storage tiene esta estructura:

```json
{
  "header": {
    "id": "c47942a1-4450-4571-a355-75313765abc3",
    "documentType": "roxium/dao",
    "name": "Mi DAO",
    "createdAtUtcIso": "2026-02-12T22:00:43.772Z",
    "lastModifiedAtUtcIso": "2026-02-12T22:00:43.772Z",
    "revision": {
      "document": 1,
      "global": 1,
      "local": 0
    }
  },
  "state": {
    "global": {
      "name": "Mi DAO",
      "description": "Descripción del DAO",
      "ownerUserId": "user123",
      "members": []
    },
    "local": {}
  },
  "operations": {
    "global": [
      {
        "index": 0,
        "timestamp": "2026-02-12T22:00:43.772Z",
        "type": "SET_DAO_NAME",
        "input": { "name": "Mi DAO" },
        "hash": "sha1:abc123..."
      }
    ],
    "local": []
  }
}
```

**Campos importantes**:
- `state.global`: Estado actual del documento
- `operations.global`: Historial completo de cambios (event sourcing)
- `header.revision`: Versión del documento

---

## 🛠️ Queries Útiles

### Listar todos los documentos del drive:

```graphql
query ListDriveDocuments {
  Dao {
    getDocuments(driveId: "preview-81d3e4ae") {
      id
      name
      state { name }
    }
  }
  Proposal {
    getDocuments(driveId: "preview-81d3e4ae") {
      id
      state { title status }
    }
  }
  Task {
    getDocuments(driveId: "preview-81d3e4ae") {
      id
      state { title status }
    }
  }
}
```

### Buscar por ID específico:

```graphql
query GetDaoById {
  Dao {
    getDocument(docId: "c47942a1-4450-4571-a355-75313765abc3") {
      id
      name
      state {
        name
        description
        members {
          id
          name
          role
        }
      }
    }
  }
}
```

### Filtrar proposals por DAO:

```graphql
query GetProposalsByDao {
  Proposal {
    getDocuments(driveId: "preview-81d3e4ae") {
      id
      state {
        title
        status
        daoId
      }
    }
  }
}
```

Luego filtrar en el cliente:
```typescript
const proposals = data.Proposal.getDocuments.filter(
  p => p.state.daoId === "c47942a1-4450-4571-a355-75313765abc3"
);
```

---

## 📖 Documentación Completa

- **Queries disponibles**: Ver `scripts/graphql-queries.md`
- **Ejemplos de uso**: Ver archivos en `lib/vetra/queries.ts`
- **Hooks React**: Ver archivos en `hooks/useDaos.ts`, `useProposals.ts`, `useTasks.ts`

---

## 🎓 Ejemplos Prácticos

### Ejemplo 1: Dashboard con datos en tiempo real

```typescript
import { useQuery, gql } from '@apollo/client';

const DASHBOARD_QUERY = gql`
  query Dashboard($driveId: String!) {
    Dao {
      getDocuments(driveId: $driveId) {
        id
        state { name members { id } }
      }
    }
    Proposal {
      getDocuments(driveId: $driveId) {
        id
        state { status }
      }
    }
    Task {
      getDocuments(driveId: $driveId) {
        id
        state { status }
      }
    }
  }
`;

function Dashboard() {
  const { data, loading } = useQuery(DASHBOARD_QUERY, {
    variables: { driveId: 'preview-81d3e4ae' },
    pollInterval: 5000, // Actualizar cada 5 segundos
  });

  if (loading) return <Loading />;

  const stats = {
    daos: data.Dao.getDocuments.length,
    proposals: {
      total: data.Proposal.getDocuments.length,
      open: data.Proposal.getDocuments.filter(p => p.state.status === 'OPEN').length,
    },
    tasks: {
      total: data.Task.getDocuments.length,
      done: data.Task.getDocuments.filter(t => t.state.status === 'DONE').length,
    },
  };

  return <StatsDisplay stats={stats} />;
}
```

### Ejemplo 2: Exportar todos los datos a JSON

```bash
# Crear backup de todos los datos
curl -X POST http://localhost:4001/d/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query Backup($driveId: String!) { Dao { getDocuments(driveId: $driveId) { id state } } Proposal { getDocuments(driveId: $driveId) { id state } } Task { getDocuments(driveId: $driveId) { id state } } }",
    "variables": {"driveId": "preview-81d3e4ae"}
  }' > backup-$(date +%Y%m%d).json
```

---

## 🚀 Tips Pro

1. **Usar fragmentos** para queries repetitivas:
   ```graphql
   fragment DaoFields on Dao_GetDocumentResult {
     id
     name
     state { name description }
   }

   query GetDaos($driveId: String!) {
     Dao {
       getDocuments(driveId: $driveId) {
         ...DaoFields
       }
     }
   }
   ```

2. **Batching de queries** con Apollo:
   ```typescript
   const [getDaos, getProposals] = useQueries([
     { query: GET_DAOS },
     { query: GET_PROPOSALS },
   ]);
   ```

3. **Caché local** con Apollo:
   ```typescript
   const { data } = useQuery(GET_DAOS, {
     fetchPolicy: 'cache-and-network',
   });
   ```

---

## 📞 Soporte

- **Scripts**: `scripts/query-data.sh` - Ver datos
- **Explorer**: `scripts/explore-storage.sh` - Explorar archivos
- **Queries**: `scripts/graphql-queries.md` - Ejemplos completos
- **Docs**: Esta guía - Referencia completa

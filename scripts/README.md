# 🚀 Herramientas para Explorar Datos de Vetra

## 📁 Archivos Disponibles

| Archivo | Descripción |
|---------|-------------|
| `query-data.sh` | Ver todos tus DAOs, Proposals y Tasks |
| `explore-storage.sh` | Explorar archivos JSON del storage |
| `interactive-explorer.sh` | Menú interactivo completo |
| `graphql-queries.md` | Queries GraphQL de referencia |
| `DATOS_Y_SCHEMA.md` | Guía completa con ejemplos |

## 🎯 Inicio Rápido

### 1. Ver todos tus datos (más simple):

```bash
cd /home/repe/projects/claudio/roxium-dao-ops-front
bash scripts/query-data.sh
```

### 2. Explorador interactivo (recomendado):

```bash
bash scripts/interactive-explorer.sh
```

Menú con opciones:
- Ver todos los DAOs
- Ver todas las Proposals
- Ver todas las Tasks
- Buscar por ID
- Ver schema GraphQL
- Exportar datos
- Ver estadísticas

### 3. Ver un documento específico:

```bash
bash scripts/explore-storage.sh <ID>

# Ejemplo:
bash scripts/explore-storage.sh c47942a1-4450-4571-a355-75313765abc3
```

## 📊 Tus Datos Actuales

**Resumen rápido** (ejecuta `bash scripts/query-data.sh`):

```
📊 DAOS: 8 encontrados
📋 PROPOSALS: 4 encontradas
   - DRAFT: 1
   - OPEN: 1
   - CLOSED: 1
   - ARCHIVED: 1
✅ TASKS: 5 encontradas
   - TODO: 2
   - IN_PROGRESS: 1
   - DONE: 1
   - ARCHIVED: 1
```

## 📍 Ubicación Física

```
/home/repe/projects/claudio/roxium-dao-vetra/.ph/drive-storage/
├── document-<dao-id>.json        (Cada DAO)
├── document-<proposal-id>.json   (Cada Proposal)
└── document-<task-id>.json       (Cada Task)
```

## 🌐 Endpoints GraphQL

```bash
# Supergraph (todos los tipos)
http://localhost:4001/d/graphql

# Endpoints específicos
http://localhost:4001/graphql/dao
http://localhost:4001/graphql/proposal
http://localhost:4001/graphql/task
```

## 📖 Documentación Completa

Lee `DATOS_Y_SCHEMA.md` para:
- Cómo usar Apollo Client
- Queries GraphQL completas
- Ejemplos de código
- Schema introspection
- Tips avanzados

## 💡 Ejemplos Rápidos

### Ver DAOs con curl:

```bash
curl -X POST http://localhost:4001/graphql/dao \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetDaos($driveId: String!) { Dao { getDocuments(driveId: $driveId) { id state { name description } } } }",
    "variables": {"driveId": "preview-81d3e4ae"}
  }'
```

### Buscar por ID:

```bash
curl -X POST http://localhost:4001/graphql/dao \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetDao($docId: PHID!) { Dao { getDocument(docId: $docId) { id state { name } } } }",
    "variables": {"docId": "c47942a1-4450-4571-a355-75313765abc3"}
  }'
```

### Exportar todo a JSON:

```bash
bash scripts/interactive-explorer.sh
# Opción 6: Exportar datos
```

O manualmente:
```bash
curl -X POST http://localhost:4001/d/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query Backup($driveId: String!) { Dao { getDocuments(driveId: $driveId) { id state } } Proposal { getDocuments(driveId: $driveId) { id state } } Task { getDocuments(driveId: $driveId) { id state } } }",
    "variables": {"driveId": "preview-81d3e4ae"}
  }' > backup.json
```

## 🛠️ Uso con Apollo Client

Ver ejemplo completo en `DATOS_Y_SCHEMA.md`, sección "Apollo Client".

Resumen:
```typescript
import { useQuery, gql } from '@apollo/client';

const GET_DAOS = gql`...`;
const { data, loading } = useQuery(GET_DAOS, {
  variables: { driveId: 'preview-81d3e4ae' }
});
```

## 🎓 Recursos Adicionales

- **Queries de referencia**: `graphql-queries.md`
- **Guía completa**: `DATOS_Y_SCHEMA.md`
- **Código de ejemplo**: `../lib/vetra/queries.ts`
- **Hooks React**: `../hooks/useDaos.ts`

## 🔧 Troubleshooting

### Error: "Cannot connect to GraphQL"

Verifica que Vetra esté corriendo:
```bash
# En otra terminal
cd /home/repe/projects/claudio/roxium-dao-vetra
ph vetra
```

### Error: "Document not found"

Usa el script para ver todos los IDs:
```bash
bash scripts/query-data.sh
```

### Quiero ver el schema completo

Opción 1: Script interactivo (opción 5)
```bash
bash scripts/interactive-explorer.sh
```

Opción 2: Query de introspección
```bash
curl -X POST http://localhost:4001/d/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}'
```

## 📚 Próximos Pasos

1. Prueba el explorador interactivo: `bash scripts/interactive-explorer.sh`
2. Lee la guía completa: `cat scripts/DATOS_Y_SCHEMA.md`
3. Experimenta con queries: Ver `scripts/graphql-queries.md`
4. Integra Apollo Client en tu app (ver guía)

---

**Nota**: Todos los datos están en el drive `preview-81d3e4ae`. Puedes cambiar esto modificando la variable `VETRA_DRIVE_ID`.

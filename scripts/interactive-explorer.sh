#!/bin/bash
# Interactive Data Explorer para Vetra

VETRA_URL="http://localhost:4001"
DRIVE_ID="${VETRA_DRIVE_ID:-preview-81d3e4ae}"

function show_menu() {
  clear
  echo "╔════════════════════════════════════════╗"
  echo "║   VETRA INTERACTIVE DATA EXPLORER      ║"
  echo "╚════════════════════════════════════════╝"
  echo ""
  echo "1) Ver todos los DAOs"
  echo "2) Ver todas las Proposals"
  echo "3) Ver todas las Tasks"
  echo "4) Buscar por ID"
  echo "5) Ver schema GraphQL"
  echo "6) Exportar todos los datos a JSON"
  echo "7) Ver estadísticas"
  echo "8) Salir"
  echo ""
  echo -n "Selecciona una opción: "
}

function view_daos() {
  echo ""
  echo "📊 Cargando DAOs..."
  curl -X POST "$VETRA_URL/graphql/dao" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"query GetDaos(\$driveId: String!) { Dao { getDocuments(driveId: \$driveId) { id name state { name description ownerUserId members { id name role } } } } }\",\"variables\":{\"driveId\":\"$DRIVE_ID\"}}" \
    2>/dev/null | node -e "
      const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
      const daos = data.data?.Dao?.getDocuments || [];
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log(\`Total: \${daos.length} DAOs\`);
      console.log('═══════════════════════════════════════');
      daos.forEach((dao, i) => {
        console.log('');
        console.log(\`[\${i+1}] \${dao.state.name || 'Sin nombre'}\`);
        console.log(\`    ID: \${dao.id}\`);
        console.log(\`    Descripción: \${dao.state.description || 'N/A'}\`);
        console.log(\`    Owner: \${dao.state.ownerUserId || 'N/A'}\`);
        console.log(\`    Miembros: \${dao.state.members.length}\`);
      });
      console.log('');
    "
  read -p "Presiona Enter para continuar..."
}

function view_proposals() {
  echo ""
  echo "📋 Cargando Proposals..."
  curl -X POST "$VETRA_URL/graphql/proposal" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"query GetProposals(\$driveId: String!) { Proposal { getDocuments(driveId: \$driveId) { id state { title description status daoId budget deadline createdBy createdAt } } } }\",\"variables\":{\"driveId\":\"$DRIVE_ID\"}}" \
    2>/dev/null | node -e "
      const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
      const proposals = data.data?.Proposal?.getDocuments || [];
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log(\`Total: \${proposals.length} Proposals\`);
      console.log('═══════════════════════════════════════');
      const byStatus = {};
      proposals.forEach(p => {
        byStatus[p.state.status] = (byStatus[p.state.status] || 0) + 1;
      });
      console.log('');
      console.log('Por estado:');
      Object.keys(byStatus).forEach(status => {
        console.log(\`  \${status}: \${byStatus[status]}\`);
      });
      console.log('');
      proposals.forEach((prop, i) => {
        console.log('');
        console.log(\`[\${i+1}] \${prop.state.title || 'Sin título'}\`);
        console.log(\`    ID: \${prop.id}\`);
        console.log(\`    Estado: \${prop.state.status}\`);
        console.log(\`    DAO: \${prop.state.daoId || 'N/A'}\`);
        console.log(\`    Budget: \${prop.state.budget || 'N/A'}\`);
        console.log(\`    Deadline: \${prop.state.deadline ? new Date(prop.state.deadline).toLocaleDateString() : 'N/A'}\`);
      });
      console.log('');
    "
  read -p "Presiona Enter para continuar..."
}

function view_tasks() {
  echo ""
  echo "✅ Cargando Tasks..."
  curl -X POST "$VETRA_URL/graphql/task" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"query GetTasks(\$driveId: String!) { Task { getDocuments(driveId: \$driveId) { id state { title description status proposalId assignee budget deadline } } } }\",\"variables\":{\"driveId\":\"$DRIVE_ID\"}}" \
    2>/dev/null | node -e "
      const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
      const tasks = data.data?.Task?.getDocuments || [];
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log(\`Total: \${tasks.length} Tasks\`);
      console.log('═══════════════════════════════════════');
      const byStatus = {};
      tasks.forEach(t => {
        byStatus[t.state.status] = (byStatus[t.state.status] || 0) + 1;
      });
      console.log('');
      console.log('Por estado:');
      Object.keys(byStatus).forEach(status => {
        console.log(\`  \${status}: \${byStatus[status]}\`);
      });
      console.log('');
      tasks.forEach((task, i) => {
        console.log('');
        console.log(\`[\${i+1}] \${task.state.title || 'Sin título'}\`);
        console.log(\`    ID: \${task.id}\`);
        console.log(\`    Estado: \${task.state.status}\`);
        console.log(\`    Proposal: \${task.state.proposalId || 'N/A'}\`);
        console.log(\`    Asignado a: \${task.state.assignee || 'Sin asignar'}\`);
        console.log(\`    Budget: \${task.state.budget || 'N/A'}\`);
      });
      console.log('');
    "
  read -p "Presiona Enter para continuar..."
}

function search_by_id() {
  echo ""
  echo -n "Ingresa el ID del documento: "
  read doc_id

  if [ -z "$doc_id" ]; then
    echo "❌ ID no puede estar vacío"
    read -p "Presiona Enter para continuar..."
    return
  fi

  echo ""
  echo "🔍 Buscando documento $doc_id..."

  # Try DAO first
  result=$(curl -s -X POST "$VETRA_URL/graphql/dao" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"query GetDao(\$docId: PHID!) { Dao { getDocument(docId: \$docId) { id name documentType state { name description ownerUserId members { id name role } } } } }\",\"variables\":{\"docId\":\"$doc_id\"}}" | node -e "
      const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
      if (data.data?.Dao?.getDocument) {
        const doc = data.data.Dao.getDocument;
        console.log('');
        console.log('✓ Encontrado como DAO:');
        console.log('  Nombre:', doc.state.name || 'Sin nombre');
        console.log('  Descripción:', doc.state.description || 'N/A');
        console.log('  Owner:', doc.state.ownerUserId || 'N/A');
        console.log('  Miembros:', doc.state.members.length);
        process.exit(0);
      } else {
        process.exit(1);
      }
    ")

  if [ $? -eq 0 ]; then
    echo "$result"
    read -p "Presiona Enter para continuar..."
    return
  fi

  # Try Proposal
  result=$(curl -s -X POST "$VETRA_URL/graphql/proposal" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"query GetProposal(\$docId: PHID!) { Proposal { getDocument(docId: \$docId) { id state { title description status daoId budget } } } }\",\"variables\":{\"docId\":\"$doc_id\"}}" | node -e "
      const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
      if (data.data?.Proposal?.getDocument) {
        const doc = data.data.Proposal.getDocument;
        console.log('');
        console.log('✓ Encontrado como Proposal:');
        console.log('  Título:', doc.state.title || 'Sin título');
        console.log('  Estado:', doc.state.status);
        console.log('  DAO:', doc.state.daoId || 'N/A');
        console.log('  Budget:', doc.state.budget || 'N/A');
        process.exit(0);
      } else {
        process.exit(1);
      }
    ")

  if [ $? -eq 0 ]; then
    echo "$result"
    read -p "Presiona Enter para continuar..."
    return
  fi

  # Try Task
  result=$(curl -s -X POST "$VETRA_URL/graphql/task" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"query GetTask(\$docId: PHID!) { Task { getDocument(docId: \$docId) { id state { title description status proposalId assignee } } } }\",\"variables\":{\"docId\":\"$doc_id\"}}" | node -e "
      const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
      if (data.data?.Task?.getDocument) {
        const doc = data.data.Task.getDocument;
        console.log('');
        console.log('✓ Encontrado como Task:');
        console.log('  Título:', doc.state.title || 'Sin título');
        console.log('  Estado:', doc.state.status);
        console.log('  Proposal:', doc.state.proposalId || 'N/A');
        console.log('  Asignado a:', doc.state.assignee || 'Sin asignar');
        process.exit(0);
      } else {
        process.exit(1);
      }
    ")

  if [ $? -eq 0 ]; then
    echo "$result"
  else
    echo "❌ Documento no encontrado con ID: $doc_id"
  fi

  read -p "Presiona Enter para continuar..."
}

function view_schema() {
  echo ""
  echo "📖 Schema GraphQL disponible:"
  echo ""
  echo "Endpoints:"
  echo "  • Supergraph: http://localhost:4001/d/graphql"
  echo "  • DAOs:       http://localhost:4001/graphql/dao"
  echo "  • Proposals:  http://localhost:4001/graphql/proposal"
  echo "  • Tasks:      http://localhost:4001/graphql/task"
  echo ""
  echo "Consulta el archivo scripts/graphql-queries.md para queries completas"
  echo ""
  read -p "Presiona Enter para continuar..."
}

function export_data() {
  local filename="vetra-backup-$(date +%Y%m%d-%H%M%S).json"
  echo ""
  echo "📦 Exportando todos los datos..."
  curl -X POST "$VETRA_URL/d/graphql" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"query Backup(\$driveId: String!) { Dao { getDocuments(driveId: \$driveId) { id name state } } Proposal { getDocuments(driveId: \$driveId) { id state } } Task { getDocuments(driveId: \$driveId) { id state } } }\",\"variables\":{\"driveId\":\"$DRIVE_ID\"}}" \
    2>/dev/null > "$filename"

  if [ $? -eq 0 ]; then
    echo "✅ Datos exportados a: $filename"
    echo "   Tamaño: $(du -h "$filename" | cut -f1)"
  else
    echo "❌ Error al exportar datos"
  fi
  echo ""
  read -p "Presiona Enter para continuar..."
}

function view_stats() {
  echo ""
  echo "📊 Calculando estadísticas..."
  curl -X POST "$VETRA_URL/d/graphql" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"query Stats(\$driveId: String!) { Dao { getDocuments(driveId: \$driveId) { id state { members { id } } } } Proposal { getDocuments(driveId: \$driveId) { id state { status } } } Task { getDocuments(driveId: \$driveId) { id state { status } } } }\",\"variables\":{\"driveId\":\"$DRIVE_ID\"}}" \
    2>/dev/null | node -e "
      const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
      const daos = data.data?.Dao?.getDocuments || [];
      const proposals = data.data?.Proposal?.getDocuments || [];
      const tasks = data.data?.Task?.getDocuments || [];

      console.log('');
      console.log('═══════════════════════════════════════');
      console.log('           ESTADÍSTICAS VETRA          ');
      console.log('═══════════════════════════════════════');
      console.log('');
      console.log('📊 DAOs:');
      console.log(\`   Total: \${daos.length}\`);
      const totalMembers = daos.reduce((sum, d) => sum + (d.state.members?.length || 0), 0);
      console.log(\`   Total miembros: \${totalMembers}\`);
      console.log('');
      console.log('📋 Proposals:');
      console.log(\`   Total: \${proposals.length}\`);
      const propByStatus = {};
      proposals.forEach(p => {
        propByStatus[p.state.status] = (propByStatus[p.state.status] || 0) + 1;
      });
      Object.keys(propByStatus).forEach(status => {
        console.log(\`   \${status}: \${propByStatus[status]}\`);
      });
      console.log('');
      console.log('✅ Tasks:');
      console.log(\`   Total: \${tasks.length}\`);
      const taskByStatus = {};
      tasks.forEach(t => {
        taskByStatus[t.state.status] = (taskByStatus[t.state.status] || 0) + 1;
      });
      Object.keys(taskByStatus).forEach(status => {
        console.log(\`   \${status}: \${taskByStatus[status]}\`);
      });
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log('');
    "
  read -p "Presiona Enter para continuar..."
}

# Main loop
while true; do
  show_menu
  read option

  case $option in
    1) view_daos ;;
    2) view_proposals ;;
    3) view_tasks ;;
    4) search_by_id ;;
    5) view_schema ;;
    6) export_data ;;
    7) view_stats ;;
    8) echo ""; echo "👋 ¡Hasta luego!"; echo ""; exit 0 ;;
    *) echo ""; echo "❌ Opción inválida"; sleep 1 ;;
  esac
done

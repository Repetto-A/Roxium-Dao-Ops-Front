#!/bin/bash
# Script para consultar datos de Vetra GraphQL

VETRA_URL="http://localhost:4001"
DRIVE_ID="${VETRA_DRIVE_ID:-preview-81d3e4ae}"

echo "==================================="
echo "VETRA DATA EXPLORER"
echo "==================================="
echo "Drive ID: $DRIVE_ID"
echo ""

# Query para obtener DAOs
echo "📊 DAOS:"
echo "-----------------------------------"
curl -X POST "$VETRA_URL/graphql/dao" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"query GetDaos(\$driveId: String!) { Dao { getDocuments(driveId: \$driveId) { id name state { name description ownerUserId members { id name role joinedAt } } } } }\",\"variables\":{\"driveId\":\"$DRIVE_ID\"}}" \
  2>/dev/null | node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
    const daos = data.data?.Dao?.getDocuments || [];
    daos.forEach((dao, i) => {
      console.log(\`\${i+1}. \${dao.state.name || 'Unnamed'}\`);
      console.log(\`   ID: \${dao.id}\`);
      console.log(\`   Description: \${dao.state.description || 'N/A'}\`);
      console.log(\`   Members: \${dao.state.members.length}\`);
      console.log('');
    });
    if (daos.length === 0) console.log('   No DAOs found');
  "

echo ""
echo "📋 PROPOSALS:"
echo "-----------------------------------"
curl -X POST "$VETRA_URL/graphql/proposal" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"query GetProposals(\$driveId: String!) { Proposal { getDocuments(driveId: \$driveId) { id name state { title description status daoId budget deadline createdBy createdAt } } } }\",\"variables\":{\"driveId\":\"$DRIVE_ID\"}}" \
  2>/dev/null | node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
    const proposals = data.data?.Proposal?.getDocuments || [];
    proposals.forEach((prop, i) => {
      console.log(\`\${i+1}. \${prop.state.title || 'Unnamed'}\`);
      console.log(\`   ID: \${prop.id}\`);
      console.log(\`   Status: \${prop.state.status}\`);
      console.log(\`   DAO: \${prop.state.daoId}\`);
      console.log(\`   Budget: \${prop.state.budget || 'N/A'}\`);
      console.log('');
    });
    if (proposals.length === 0) console.log('   No proposals found');
  "

echo ""
echo "✅ TASKS:"
echo "-----------------------------------"
curl -X POST "$VETRA_URL/graphql/task" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"query GetTasks(\$driveId: String!) { Task { getDocuments(driveId: \$driveId) { id name state { title description status daoId proposalId assignee budget deadline createdBy createdAt } } } }\",\"variables\":{\"driveId\":\"$DRIVE_ID\"}}" \
  2>/dev/null | node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
    const tasks = data.data?.Task?.getDocuments || [];
    tasks.forEach((task, i) => {
      console.log(\`\${i+1}. \${task.state.title || 'Unnamed'}\`);
      console.log(\`   ID: \${task.id}\`);
      console.log(\`   Status: \${task.state.status}\`);
      console.log(\`   Proposal: \${task.state.proposalId}\`);
      console.log(\`   Assignee: \${task.state.assignee || 'Unassigned'}\`);
      console.log('');
    });
    if (tasks.length === 0) console.log('   No tasks found');
  "

echo ""
echo "==================================="

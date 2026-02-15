#!/bin/bash
# Script para explorar el almacenamiento de Vetra

STORAGE_DIR="/home/repe/projects/claudio/roxium-dao-vetra/.ph/drive-storage"

echo "==================================="
echo "VETRA STORAGE EXPLORER"
echo "==================================="
echo "Location: $STORAGE_DIR"
echo ""

# Función para mostrar un documento
show_document() {
  local file=$1
  local doc_id=$(basename "$file" .json | sed 's/document-//')

  echo "Document ID: $doc_id"
  echo "File: $file"
  echo "Size: $(du -h "$file" | cut -f1)"
  echo ""

  # Extraer información básica del JSON
  if [ -f "$file" ]; then
    node -e "
      const fs = require('fs');
      const doc = JSON.parse(fs.readFileSync('$file', 'utf-8'));
      console.log('Document Type:', doc.header?.documentType || 'Unknown');
      console.log('Name:', doc.header?.name || 'Unnamed');
      console.log('Created:', doc.header?.createdAtUtcIso || 'N/A');
      console.log('Last Modified:', doc.header?.lastModifiedAtUtcIso || 'N/A');
      console.log('Operations Count:', doc.operations?.global?.length || 0);
      console.log('');
      console.log('State:');
      console.log(JSON.stringify(doc.state?.global || doc.state, null, 2).substring(0, 500));
      console.log('');
    "
  fi
}

# Si se proporciona un ID, mostrar ese documento
if [ -n "$1" ]; then
  file="$STORAGE_DIR/document-$1.json"
  if [ -f "$file" ]; then
    show_document "$file"
  else
    echo "❌ Document not found: $1"
    echo ""
    echo "Available documents:"
    ls -1 "$STORAGE_DIR"/document-*.json | grep -v "preview\|vetra\|roxium" | sed 's/.*document-//' | sed 's/.json//'
  fi
  exit 0
fi

echo "📄 DOCUMENT MODEL FILES:"
echo "-----------------------------------"
ls -lh "$STORAGE_DIR"/document-roxium_*.json 2>/dev/null | awk '{print $9, "-", $5}' | sed 's|.*/||'

echo ""
echo "🗄️ DRIVE FILES:"
echo "-----------------------------------"
ls -lh "$STORAGE_DIR"/document-*-81d3e4ae.json 2>/dev/null | awk '{print $9, "-", $5}' | sed 's|.*/||'

echo ""
echo "📊 USER DOCUMENTS:"
echo "-----------------------------------"
count=$(ls -1 "$STORAGE_DIR"/document-*.json 2>/dev/null | grep -v "preview\|vetra\|roxium" | wc -l)
echo "Total: $count documents"
echo ""

# Listar documentos por tipo
echo "By type:"
for file in "$STORAGE_DIR"/document-*.json; do
  if [[ ! "$file" =~ (preview|vetra|roxium) ]]; then
    doc_type=$(node -e "const fs = require('fs'); const doc = JSON.parse(fs.readFileSync('$file', 'utf-8')); console.log(doc.header?.documentType || 'Unknown');" 2>/dev/null)
    echo "  - $doc_type"
  fi
done | sort | uniq -c

echo ""
echo "==================================="
echo ""
echo "💡 Usage:"
echo "  View specific document: $0 <document-id>"
echo "  Example: $0 c47942a1-4450-4571-a355-75313765abc3"
echo ""

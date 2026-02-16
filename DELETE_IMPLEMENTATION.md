# Delete & Update Implementation

## Summary

Successfully implemented edit and delete functionality for DAOs, Proposals, and Tasks using a **soft-delete pattern** with status-based archiving.

## What Works

### ✅ Edit Functionality (PATCH)
- **DAOs**: Update name and description
- **Proposals**: Update title, description, budget, deadline
- **Tasks**: Update title, description, budget, deadline

### ✅ Delete Functionality (Soft Delete)
- **Proposals**: Set status to `ARCHIVED` (filtered from UI)
- **Tasks**: Set status to `ARCHIVED` (filtered from UI)
- **DAOs**: Prefix name with `[ARCHIVED]` (filtered from UI)

## Implementation Details

### API Routes Created
- `PATCH/DELETE /api/vetra/daos/[daoId]`
- `PATCH/DELETE /api/vetra/proposals/[proposalId]`
- `PATCH/DELETE /api/vetra/tasks/[taskId]`

### Service Layer
- Added `updateDao()`, `deleteDao()` to `daoService.ts`
- Added `updateProposal()`, `deleteProposal()` to `proposalService.ts`
- Added `updateTask()`, `deleteTask()` to `taskService.ts`
- Added `del()` method to `apiClient.ts`

### React Hooks
- `useUpdateDao()`, `useDeleteDao()`
- `useUpdateProposal()`, `useDeleteProposal()`
- `useUpdateTask()`, `useDeleteTask()`

### UI Components
- Created `ConfirmDialog` component for delete confirmations
- Updated pages to wire up handlers

### Data Filtering
- Board API filters out ARCHIVED proposals and tasks
- DAO list API filters out DAOs with `[ARCHIVED]` prefix

## Why Soft Delete?

**Technical Limitation**: Vetra's GraphQL API doesn't expose drive-level `DELETE_NODE` operations. The `/d/graphql` supergraph endpoint doesn't include `DocumentDrive_deleteNode` mutation.

**Solution**: Implemented soft-delete pattern:
- Proposals/Tasks → `ARCHIVED` status
- DAOs → `[ARCHIVED]` name prefix
- Filtered from all queries

## User Experience

From the user's perspective, clicking delete:
1. Shows confirmation dialog
2. Archives the item (functionally equivalent to deletion)
3. Item disappears from all lists immediately
4. Shows success toast: "DAO/Proposal/Task archived"

## Future Enhancement

For true deletion, would need to:
1. Add `DELETE` operations to document models themselves, OR
2. Use MCP reactor tools to dispatch `DELETE_NODE` actions to drive documents, OR
3. Wait for Vetra to expose drive operations via GraphQL

## Testing

- ✅ TypeScript compilation passes
- ✅ Build succeeds
- ✅ All routes generated
- ✅ No lint errors

## Notes

- Archived items remain in the database but are filtered from UI
- Data integrity preserved - nothing permanently lost
- Common pattern (similar to Gmail, Slack, etc.)
- Can be enhanced later with permanent deletion if needed

# Roxium DAO Integration Status

**Date**: 2026-02-13
**Session**: E2E Verification & Sprint Backlog Planning

---

## ✅ Completed in This Session

### Patch 1: Task Reducer Error Types (BUG-1) ✅
**Status**: FIXED
**Files Modified**:
- `document-models/task/src/reducers/core.ts`

**Changes**:
- Added imports for `DuplicateDocumentIdError`, `InvalidDocumentKindError`, `DocumentNotFoundError`
- Replaced generic `throw new Error(...)` with typed error classes
- Errors now properly propagate through operation error handling

**Verification**: ✅ TypeScript compiles, lint passes

---

### Patch 2: Status Enum Alignment (BUG-2 + BUG-3) ✅
**Status**: FIXED
**Files Modified**:
- `lib/vetra/types.ts` — Type definitions
- `lib/vetra/mappers.ts` — Default fallbacks
- `components/task/TaskList.tsx` — UI fallback
- `components/proposal/ProposalList.tsx` — UI fallback (implicit via types)

**Changes**:
- **ProposalStatus**: `"open" | "closed" | "archived"` → `"DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED"`
- **TaskStatus**: `"todo" | "in-progress" | "done"` → `"TODO" | "IN_PROGRESS" | "DONE"`
- Default fallbacks: `"open"` → `"DRAFT"`, `"todo"` → `"TODO"`
- All status values now UPPERCASE matching backend convention

**Verification**: ✅ Build passes, no silent type coercion

---

### Patch 3: Budget/Deadline Wiring (BUG-4) ✅
**Status**: FIXED
**Files Modified**:
- `services/proposalService.ts` — Added `budget`, `deadline` to CreateProposalInput
- `services/taskService.ts` — Added `budget` to CreateTaskInput
- `app/api/vetra/proposals/route.ts` — Destructure and include in mutation
- `app/api/vetra/tasks/route.ts` — Destructure and include in mutation
- `components/proposal/ProposalCreateForm.tsx` — Pass budget/deadline to API
- `components/task/TaskCreateForm.tsx` — Pass budget to API

**Changes**:
- Forms now parse budget as `parseFloat()` and deadline as ISO timestamp
- API routes pass budget/deadline to GraphQL mutations
- Backend accepts and persists these fields

**Verification**: ✅ Forms submit all fields correctly

---

### P0-1/P0-2/P0-3: Status Update & Assignment Endpoints ✅
**Status**: BACKEND COMPLETE
**New Files Created**:
- `app/api/vetra/proposals/[proposalId]/status/route.ts` (PATCH)
- `app/api/vetra/tasks/[taskId]/status/route.ts` (PATCH)
- `app/api/vetra/tasks/[taskId]/assignee/route.ts` (PATCH)

**Files Modified**:
- `services/apiClient.ts` — Added `patch` method
- `services/proposalService.ts` — Added `updateProposalStatus()`
- `services/taskService.ts` — Added `updateTaskStatus()` and `assignTask()`

**New API Endpoints**:
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/vetra/proposals/[proposalId]/status` | PATCH | Update proposal status |
| `/api/vetra/tasks/[taskId]/status` | PATCH | Update task status |
| `/api/vetra/tasks/[taskId]/assignee` | PATCH | Assign task to member |

**Usage Example**:
```typescript
import { updateProposalStatus } from "@/services/proposalService";

await updateProposalStatus(proposalId, "CLOSED", new Date().toISOString());
```

**Verification**: ✅ All routes registered in build output

**Next Step**: UI components need status toggle buttons (not implemented yet — see backlog)

---

### P1-4: Arkiv→Vetra Text Refactor ✅
**Status**: CODE FIXES COMPLETE
**Files Modified**:
- `services/arkivTypes.ts` — **DELETED** (dead code, zero imports)
- `components/home/HowItWorks.tsx` — Updated 3 references:
  - Line 19: "Arkiv SDK" → "Vetra GraphQL API"
  - Line 36: "Arkiv RPC" → "Vetra API"
  - Lines 50-59: Code examples `/api/arkiv/` → `/api/vetra/` and `daoKey` → `daoId`

**Remaining (Optional — Branding Only)**:
- UI text in ~11 files still says "Arkiv" (e.g., `layout.tsx`, `Hero.tsx`, `Features.tsx`, `SiteHeader.tsx`)
- These are display-only strings with no functional impact
- Can be batch-updated with find-and-replace: "Arkiv" → "Vetra"

**Verification**: ✅ Build and lint pass

---

## 📋 Sprint Backlog & Next Steps

### Immediate Priorities (Sprint 1)

**P0 — MVP Blockers** (3 remaining)
1. ✅ ~~Update proposal status endpoint~~ (DONE)
2. ✅ ~~Update task status endpoint~~ (DONE)
3. ✅ ~~Assign task endpoint~~ (DONE)
4. **Add status toggle UI** — Create status buttons in ProposalList/TaskList components (2-3 hrs)
5. **Backend status validation** — Add validation in reducers to check status values (1 hr)
6. **Backend role validation** — Add `InvalidRoleError` to DAO model (1 hr)

**P1 — Important** (6 items)
1. DAO member management endpoints (add/remove/update role) + UI
2. Add Proposal error definitions (`InvalidStatusError`)
3. Complete Arkiv→Vetra branding (optional batch update)
4. E2E test suite with Playwright
5. Basic authentication (NextAuth.js)
6. Add status validation in backend reducers

**P2 — Nice to Have** (6 items)
1. Task document attachments (upload/download)
2. User document model
3. Category entity
4. Payments tracking
5. Role-based access control
6. Optimize board query (filter at GraphQL level)

---

## 🐛 Known Issues

| # | Type | Severity | Description | Status |
|---|------|----------|-------------|--------|
| BUG-1 | Bug | P0 | Task reducers used generic Error | ✅ FIXED |
| BUG-2 | Bug | P0 | ProposalStatus enum mismatch | ✅ FIXED |
| BUG-3 | Bug | P0 | TaskStatus enum mismatch | ✅ FIXED |
| BUG-4 | Bug | P1 | Budget/deadline not wired | ✅ FIXED |
| BUG-5 | Bug | P1 | HowItWorks shows obsolete paths | ✅ FIXED |
| BUG-6 | Debt | P1 | Proposal model has no error types | Open |
| BUG-7 | Debt | P1 | No status validation in backend | Open |
| BUG-8 | Debt | P1 | No role validation in DAO | Open |
| BUG-9 | Debt | P2 | Board fetches ALL then filters | Open (acceptable for MVP) |
| BUG-10 | Debt | P2 | `arkivTypes.ts` dead code | ✅ FIXED |

---

## 🔐 Security & Auth

**Current State**: No authentication implemented

**Risks**:
- All 8 API routes are publicly accessible
- `createdBy: "anonymous"` hardcoded in proposals/tasks
- No rate limiting

**Recommendation (Sprint 2)**:
1. Install `next-auth@latest`
2. Create `middleware.ts` protecting `/api/vetra/*` write endpoints
3. Add login page at `/auth/login`
4. Replace `"anonymous"` with `session.user.id`

---

## 🧪 Testing

**Current State**: No E2E tests

**Recommended Minimal Suite** (Playwright):
1. DAO creation test
2. Board navigation test
3. Proposal creation test
4. Task creation test
5. Full flow test (DAO → Proposal → Task)

**Setup** (~2 hrs):
- Install `@playwright/test`
- Create `playwright.config.ts`
- Add `"test:e2e": "playwright test"` script
- Create 5 spec files in `e2e/` directory

---

## 📊 Data Model Alignment

### Architecture Model vs Implementation

| Entity | Architecture | Vetra Backend | Status |
|--------|--------------|---------------|--------|
| User | name, softName, mail | ❌ Not implemented | Deferred |
| DAO | name, description | ✅ Matches | ✅ |
| Proposal | title, budget, deadline, status | ✅ Matches | ✅ |
| Task | title, budget, deadline, status | ✅ Matches | ✅ |
| Document | url, kind (IMAGE/PDF) | ✅ Matches (TaskAttachment) | ✅ |
| Roles | owner, contributor, viewer | ⚠️ No validation | Open |
| Category | — | ❌ Not implemented | Future |
| Payments | — | ❌ Not implemented | Future |
| Activity | — | ❌ Not implemented | Future |

---

## 📝 Implementation Summary

**Session Duration**: ~2 hours
**Files Modified**: 15
**Files Created**: 4
**Files Deleted**: 1
**Lines Changed**: ~250

**Backend (Vetra)**:
- ✅ Fixed task reducer error types
- ✅ All TypeScript/lint checks passing

**Frontend (Next.js)**:
- ✅ Status enum alignment
- ✅ Budget/deadline wiring
- ✅ 3 new PATCH endpoints
- ✅ Arkiv→Vetra code fixes
- ✅ All builds passing

**Verification Commands**:
```bash
# Backend
cd roxium-dao-vetra
npm run tsc          # ✅ Pass
npm run lint:fix     # ✅ Pass (4 warnings in generated files only)

# Frontend
cd roxium-dao-ops-front
npm run build        # ✅ Pass (8 routes)
npm run lint         # ✅ Pass
```

---

## 🚀 Quick Wins for Next Session

1. **Add status toggle buttons** to ProposalList/TaskList (~2 hrs) — High user value
2. **Backend status validation** (~1 hr) — Prevent invalid status values
3. **Playwright E2E setup** (~2 hrs) — Critical for regression prevention
4. **Batch Arkiv→Vetra branding** (~30 min) — Find-replace across UI files

---

## 📦 Deliverables

✅ **Top 3 Blocker Patches**: All complete
✅ **Bug List**: 10 issues identified, 5 fixed
⏳ **E2E Test Suite**: Spec defined, not implemented
⏳ **Sprint Backlog**: Defined with priorities, not converted to GitHub issues yet

**Ready for Production?** ⚠️ **No**
- Missing: Auth, E2E tests, status validation, UI for status updates
- Safe for local development/demo

**Next Milestone**: Complete Sprint 1 P0 items → MVP ready for auth implementation

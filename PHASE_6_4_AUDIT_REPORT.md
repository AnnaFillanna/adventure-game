# Phase 6.4 Audit Report: Campaign & Episode Architecture
**Date:** 2026-10-31  
**Status:** ❌ **ISSUES FOUND - NOT READY FOR COMMIT**  
**Action Required:** Critical fixes needed before production commit

---

## Summary of Findings

Phase 6.4 created the basic campaign infrastructure (5 chapters, 30 episodes) but has **significant structural and data issues** that must be resolved before commit.

---

## 1. CRITICAL: Episode Event Structure

### Issue
- **Current state:** `createEpisode()` creates only **1 event per episode**
- **Expected state:** GAME_DESIGN.md documents **4+ events per episode**
- **Impact:** Gameplay is severely incomplete

### Example (Episode 01 - "Das Flüstern im Sand")
**GAME_DESIGN.md documents:**
```
Ereignisse:
1. Botschaft des Magiers lesen
2. Fußspuren virtuell untersuchen
3. einen Nebelschatten im Lernkampf bannen
4. den Botenstein zusammensetzen
```

**Current implementation:**
```typescript
events: [
  {
    id: `episode_01_whisper_sand_event_1`,
    type: 'story_beat',
    titleKey: `episodes.01.event_1.title`,  // ← Only 1 event!
    // Missing: event_2, event_3, event_4
  }
]
```

### Data to Extract
- All 30 episodes × 4 events = **120+ event definitions**
- From: GAME_DESIGN.md sections "#### NN – [Title]" → "Ereignisse:"
- Each event needs: type, order, rewards, prerequisite conditions, interaction data

### Files Affected
- `src/game/campaign/campaignData.ts` – helper function `createEpisode()` incomplete
- `src/locales/de.ts` – missing episode event translations

---

## 2. TypeScript Compilation Errors

### Issue A: Missing Type-Only Imports
**Error Message:**
```
'Campaign' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
```

**Files:**
- `src/game/campaign/campaignData.ts:11`
- `src/game/campaign/episodeManager.ts:13`
- `src/game/campaign/__tests__/campaign.test.ts:41`

**Fix:** Change to type-only imports
```typescript
// Current (WRONG):
import { Campaign, Chapter, Episode } from '../../types/campaign';

// Correct:
import type { Campaign, Chapter, Episode } from '../../types/campaign';
```

### Issue B: Invalid Episode Status Value
**Error Message:**
```
Argument of type '"in_progress"' is not assignable to parameter of type '"locked" | "unlocked" | undefined'.
```

**Files:**
- `src/game/campaign/__tests__/campaign.test.ts:197, 252, 270`

**Issue:** Episode status values don't match type definition. Defined as:
```typescript
status?: 'locked' | 'unlocked';
```

But tests use:
```typescript
status: 'in_progress'  // ← Invalid
```

**Fix:** Align status values or update type definition

### Issue C: Duplicate Property in Localization File
**Error Message:**
```
src/locales/de.ts(481,3): error TS1117: An object literal cannot have multiple properties with the same name.
```

**Issue:** `chapters` property defined twice in localization object (lines 262 and 488)

---

## 3. Localization Key Mismatch

### Issue
Campaign data expects different key paths than what's in `de.ts`:

**Current campaignData.ts:**
```typescript
titleKey: 'chapters.01.title'  // Expects: chapters.01.title
introKey: 'chapters.01.intro'  // Expects: chapters.01.intro
```

**Current de.ts structure:**
```typescript
chapters: {
  '01': {
    title: 'Die verfluchten Lande',
    // ✓ Correct key path: chapters['01'].title
  }
}
```

**But test expects:**
```typescript
getText('campaigns.firstLight.chapters.chapter1.title')  // ← Different path structure!
```

### Problem
- Inconsistent key naming convention (numeric vs. named)
- Tests expect nested campaign structure that doesn't exist in de.ts

---

## 4. Missing Persistence Layer

### Issue
Campaign progress is stored **only in memory**:
- No localStorage integration
- No save/load mechanism for campaign progress
- No state synchronization with GameWorld store
- **Result:** Campaign progress lost on page reload

### Files Missing
```
src/game/campaign/persistenceManager.ts  ← Not created
src/game/campaign/campaignStorage.ts     ← Not created
```

### Required Implementation
```typescript
// Persistence checklist:
- Save campaign progress to localStorage
- Load campaign progress on app startup
- Version-safe migration for old saves
- Sync with Zustand GameWorld store
- Handle corrupted saves gracefully
```

---

## 5. Missing Event Metadata

### Issue
Events are defined as generic "story_beat" without actual gameplay data:

**Current:**
```typescript
events: [
  {
    id: `${id}_event_1`,
    type: 'story_beat',  // ← Too generic
    titleKey: `episodes.01.event_1.title`,
    descriptionKey: `episodes.01.event_1.description`,
    rewards: { xp: 25, gold: 10 },  // ← Made-up values
  }
]
```

**Missing:**
- Event interaction type (dialogue, collect, combat, puzzle, etc.)
- GPS waypoint data (distance, coordinates simulation)
- Prerequisites and unlock conditions
- Dialogue options / NPC interactions
- Combat enemy definitions
- Collection targets (coins, artifacts, etc.)
- Puzzle definitions

### Data Source
All of this is documented in GAME_DESIGN.md but **not extracted**

---

## 6. Episode Prerequisites Not Fully Chained

### Issue
Episodes 7, 13, 19, 25 are chapter starts but:

**Current:**
```typescript
createEpisode('episode_07_city_mirror', 7, 'chapter_02_sunken_paths', 
  'episodes.07.title', 'episodes.07.description')  // ← No prerequisite!
```

**Expected:** Episode 7 should require Episode 6 completion
```typescript
createEpisode('episode_07_city_mirror', 7, 'chapter_02_sunken_paths', 
  'episodes.07.title', 'episodes.07.description', 
  'episode_06_moorkeeper_crown')  // ← Chapter boss as prerequisite
```

### Verification Needed
Confirm all 30 episodes have correct prerequisite chain from 1→30

---

## 7. Episode Rewards Not Validated

### Issue
Reward values were **generated algorithmically** and don't match GAME_DESIGN.md:

**Current (algorithmically generated):**
```typescript
const createEpisode = (..., isBoss: boolean = false) => {
  return {
    // ...
    events: [{
      rewards: { xp: isBoss ? 75 : 25, gold: isBoss ? 50 : 10 },
      // ← Hard-coded, no source validation
    }]
  }
}
```

**Required:** Extract from GAME_DESIGN.md
```
Belohnungen: 20 Gold, ein Heiltrank, freigeschaltetes Tagebuch.
```

Each episode has unique rewards that must be documented in IMPLEMENTATION_ROADMAP.md or hard-coded after verification.

---

## 8. Test Failures

### Failing Tests (3 failures, 186 passing)

**Test 1: Episode Order in Chapter**
```
FAIL: Kapitel 2 sollte Episoden 7-12 enthalten
Expected: [7, 8, 9, 10, 11, 12]
Received: [10, 11, 12, 7, 8, 9]
```
→ Issue: Test compares unsorted vs sorted arrays. Fix: Remove `.sort()` from test or ensure episodes are always in order.

**Test 2: Campaign Localization**
```
FAIL: should resolve campaign information
Expected: "Kapitel 1"
Received: "[campaigns.firstLight.chapters.chapter1.title]"
```
→ Issue: Localization key not found in de.ts. The key structure doesn't match.

**Test 3: Duplicate Import Type**
```
FAIL: Campaign import must be type-only
```
→ Issue: TypeScript import syntax error (see section 2).

---

## 9. Incomplete Implementation Summary

### What Was Implemented ✓
- Campaign type definitions (5 chapters, 30 episodes)
- Basic episode data structure with unique IDs
- Episode manager with control methods:
  - `unlockEpisode()`
  - `startEpisode()`
  - `completeEpisode()`
  - `pauseEpisode()`
- Chapter completion tracking
- Localization keys (partial)
- Unit tests (156/189 tests initially)

### What Is Missing ✗
- **Event population:** Only 1 event per episode, need 4+
- **Event metadata:** No gameplay interaction data
- **Persistence:** No storage/loading of campaign progress
- **Episode rewards:** Values not validated against GAME_DESIGN.md
- **Chapter prerequisites:** Episodes 7, 13, 19, 25 not linked to chapter bosses
- **Localization completeness:** Many keys still missing
- **Defensive coding:** No handling for old save formats or corrupted data
- **GPS integration:** No waypoint or distance data preparation
- **NPC dialogue:** No interaction framework
- **Combat definition:** No enemy stats, moves, rewards per episode

---

## 10. Comparison: Specification vs Implementation

| Requirement | Expected | Implemented | Status |
|---|---|---|---|
| 5 Chapters | ✓ 5 chapters with IDs | ✓ Yes | ✓ Done |
| 30 Episodes | ✓ 6 episodes per chapter | ✓ Yes | ✓ Done |
| 4+ Events per Episode | ✓ 120+ total events | ✗ Only 30 events (1 each) | ❌ CRITICAL |
| Persistent Progress | ✓ Save/load on reload | ✗ In-memory only | ❌ CRITICAL |
| Episode Rewards | ✓ From GAME_DESIGN.md | ✗ Generated values | ❌ NEEDS VALIDATION |
| Chapter Prerequisites | ✓ Boss → Next Chapter | ✗ Not linked | ❌ PARTIAL |
| Localization Complete | ✓ All UI in German | ✗ Partial (de.ts incomplete) | ⚠️ INCOMPLETE |
| TypeScript Type Safe | ✓ No compile errors | ✗ 13 errors | ❌ BROKEN |

---

## 11. Required Fixes (Priority Order)

### BEFORE COMMIT:
1. ✗ Fix TypeScript compilation errors (13 errors)
   - Add `type` keyword to type-only imports
   - Resolve duplicate `chapters` property in de.ts
   - Align episode status values with type definition
   - Fix invalid test values

2. ✗ Extract all 120+ events from GAME_DESIGN.md
   - Parse each episode's "Ereignisse" section
   - Create complete event definitions
   - Validate event rewards

3. ✗ Fix episode prerequisites for chapter transitions
   - Episode 7 requires Episode 6 (+ isBoss)
   - Episode 13 requires Episode 12 (+ isBoss)
   - Episode 19 requires Episode 18 (+ isBoss)
   - Episode 25 requires Episode 24 (+ isBoss)

4. ✗ Complete and validate localization keys
   - Fix duplicate properties in de.ts
   - Add all missing chapter/episode keys
   - Ensure getText() returns valid strings

5. ✗ Create persistence layer
   - Implement campaignStorage.ts
   - Sync with GameWorld Zustand store
   - Add migration logic for save format changes

### AFTER COMMIT (Phase 6.5+):
- GPS waypoint simulation
- NPC dialogue system
- Combat encounter definitions
- Interactive event mechanics
- Campaign UI screens

---

## 12. Build & Test Status

### TypeScript Compilation
```
Status: ❌ FAILED
Errors: 13
Warnings: 0
```

### ESLint
```
Status: ⏸️ NOT RUN (compilation failed first)
```

### Unit Tests
```
Status: ❌ FAILED
Total: 189 tests
Passed: 186
Failed: 3
```

### Production Build
```
Status: ❌ BLOCKED (TypeScript errors prevent build)
```

---

## 13. Recommendation

### DO NOT COMMIT
The implementation has **critical blockers**:
1. TypeScript doesn't compile (13 errors)
2. Tests are failing (3 failures)
3. Event data is 96% incomplete
4. Persistence layer missing
5. Localization incomplete

### NEXT STEPS (User's Approval Required)

**Option A (Recommended): Fix & Re-submit**
- Fix all 13 TypeScript errors
- Extract all 120 events from GAME_DESIGN.md
- Fix chapter prerequisites
- Implement persistence layer
- Re-run tests and build
- Resubmit audit report
- Then commit with confidence

**Option B: Minimal Viable Submission**
- Fix TypeScript errors only
- Fix failing tests
- Keep stub event data as-is
- Accept reduced functionality
- Commit as "WIP: campaign infrastructure"
- Complete event/persistence in Phase 6.5

**Option C: Rollback & Restart**
- Reset Phase 6.4 changes
- Start over with clearer approach
- Extract events first, then build manager

---

## Files Modified in Phase 6.4

### Created
- `src/types/campaign.ts` (Campaign/Chapter/Episode types)
- `src/game/campaign/campaignData.ts` (30 episodes with stub events)
- `src/game/campaign/episodeManager.ts` (Episode control logic)
- `src/game/campaign/__tests__/campaign.test.ts` (Tests)

### Modified
- `src/locales/de.ts` (Added campaign/chapter/episode keys - **DUPLICATE ERROR**)

### Not Created (Missing)
- `src/game/campaign/persistenceManager.ts` (Not implemented)
- `src/game/campaign/campaignStorage.ts` (Not implemented)

---

## Conclusion

Phase 6.4 created the **architectural foundation** for campaign management but is **incomplete and uncompilable** in its current form. The work is structurally sound but requires:

1. **Data extraction:** 120+ events from documentation
2. **Bug fixes:** 13 TypeScript errors + 3 test failures
3. **Missing feature:** Persistence layer
4. **Validation:** Ensure all values match GAME_DESIGN.md

**Estimated effort to production-ready:** 4-6 hours

**Current branch:** `feature/phase-6-desert-adventure`  
**Ready for commit:** **NO**

# 🍎 Adventure Game – iPhone GPS Test Guide

**Status**: Ready for Local HTTPS Testing  
**Platforms**: iOS Safari (iPhone)  
**Version**: v1.0 Pre-Release  

---

## Quick Start (5 Minutes)

### Step 1: Enable HTTPS on Your Mac

```bash
# Install certificate generator
npm install -D mkcert

# Create local certificates
mkdir -p ~/.local/share/mkcert
mkcert -install
mkcert 127.0.0.1 localhost
```

### Step 2: Update Vite Configuration

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(process.env.HOME, '.local/share/mkcert/127.0.0.1+1-key.pem')
      ),
      cert: fs.readFileSync(
        path.resolve(process.env.HOME, '.local/share/mkcert/127.0.0.1+1.pem')
      ),
    },
    host: '0.0.0.0',
    port: 5173,
  },
})
```

### Step 3: Start Development Server

```bash
npm run dev
```

Look for output like:
```
➜  Local:   https://localhost:5173/
➜  Network: https://192.168.1.100:5173/
```

**Save that Network URL** — you'll need it on iPhone.

### Step 4: On iPhone (Safari)

1. Open Safari
2. Paste the Network URL: `https://192.168.1.100:5173`
3. Tap "More Options" → "Visit on This Website"
4. Grant location permission: "Allow While Using App"
5. Tap "Spielen" → Game loads with GPS access

**That's it!** The app now has access to your iPhone's GPS.

---

## Detailed Testing Guide

### Test Scenario 1: New Game Flow

**Duration**: 2 minutes

**Steps**:
1. Open Safari on iPhone
2. Navigate to `https://192.168.1.100:5173`
3. Accept certificate warning
4. Tap **"Hero wählen & Abenteuer öffnen"** (Play)
5. Select a character (e.g., "Varg")
6. Confirm → Campaign screen loads

**Expected Result**:
- ✓ Simple start screen with single button
- ✓ Character selection works
- ✓ Campaign shows Episode 1
- ✓ No technical clutter or advanced options visible

**What to Check**:
- Font sizes readable on iPhone screen
- Buttons respond immediately to tap
- No lag or jank transitions

---

### Test Scenario 2: Continue Game (Auto-Load)

**Duration**: 1 minute

**Setup**: Close Safari, reopen app on same device

**Steps**:
1. Open Safari
2. Navigate to same URL again
3. Observe: Start screen should recognize existing save
4. **Tap "Spielen"**
5. Should **skip character selection** and go directly to campaign

**Expected Result**:
- ✓ Start screen detects existing save
- ✓ Auto-load happens in background
- ✓ Campaign resumes at last episode
- ✓ No manual save/load dialogs

**What to Check**:
- Saves persist after closing Safari
- Character state preserved
- Episode progress correct

---

### Test Scenario 3: Campaign Gameplay

**Duration**: 5–10 minutes (Episodes 1–3)

**Episode 1: "Das Schwert des Ersten Lichts"**

| Event | Action | Expected |
|-------|--------|----------|
| 1 | Read dialog | Elf appears, asks for help |
| 2 | Read message | Find clue about Mist Shadow |
| 3 | Solve footprint puzzle | Choose correct track |
| 4 | Fight Mist Shadow | Simple tutorial battle (5 HP each) |

**Episode 2: "Die stumme Glocke"**

| Event | Action | Expected |
|-------|--------|----------|
| 1 | Meet guardian | Dialog with NPC |
| 2 | Solve bell signals | Arrange bells in correct order |
| 3 | Encounter undead | Dialog-based resolution |
| 4 | Hear bells | Story closure |

**Episode 3: "Die gestohlene Laterne"**

| Event | Action | Expected |
|-------|--------|----------|
| 1 | Question merchant | Get info about lantern |
| 2 | Solve trail puzzle | Identify which supplies belong to bandits |
| 3 | Persuade bandits | Dialog choices lead to understanding |
| 4 | Light lantern | Victory, rewards granted |

**Expected Rewards After Episode 3**:
- XP: +100
- Gold: +20
- **Episode 4 should unlock** automatically

**What to Check**:
- Each event appears in correct order
- No missing steps or blank screens
- Buttons respond to taps
- Rewards display correctly
- Episode unlock works

---

### Test Scenario 4: GPS/Outdoor Adventure

**Duration**: 5–15 minutes (depending on demo vs. real movement)

#### Option A: Demo Mode (No Real Movement)

**In Browser Console** (Cmd+Option+I → Console):

```javascript
localStorage.setItem('__ADVENTURE_GAME_DEMO_MODE__', 'true')
location.reload()
```

**Steps**:
1. Campaign screen reloads
2. Tap **🗺️ GPS button** (top-right)
3. Outdoor Adventure screen appears
4. You'll see "Current Position" & "Generate Quest"
5. Tap "Generate Quest" or use arrow keys to simulate movement
6. A discovery event should trigger
7. Tap **⏸ Pause** to return to campaign

**Expected Result**:
- ✓ GPS button always visible in campaign
- ✓ Demo GPS generates positions automatically
- ✓ Quests appear at simulated locations
- ✓ Pause returns safely to campaign state

**Advantages**:
- No need to leave your desk
- No real GPS permission issues
- Faster testing cycles
- Perfect for verifying UI & state management

---

#### Option B: Real GPS Testing (Outdoor)

**Prerequisites**:
- iPhone connected to same WiFi as Mac
- Location permission already granted
- GPS enabled on iPhone

**Steps**:
1. Campaign screen on iPhone
2. Tap **🗺️ GPS button**
3. Device requests location permission
   - Tap "Allow While Using App"
4. Current GPS position displays on map
5. Walk around (50–100 meters minimum)
6. Watch for discovery events to trigger
7. Interact with events as they appear
8. Tap **⏸ Pause** to return to campaign

**Expected Result**:
- ✓ GPS position accuracy improves after 5–10 seconds
- ✓ Walking 100m should generate discovery events
- ✓ No lag between movement and position update
- ✓ Events feel tied to real location
- ✓ Pause works at any time

**What to Check**:
- GPS accuracy (should be ±10–30m)
- Event trigger timing (responsive to movement)
- No data loss if signal drops temporarily
- Battery impact (should be minimal)

**Outdoor Testing Tips**:
- Test in park or open area (better GPS signal)
- Avoid dense trees or tall buildings
- Don't rely on GPS in tunnels or indoors
- WiFi position (iCloud) works but less accurate
- Airplane mode disables GPS completely

---

### Test Scenario 5: Pause & Resume Cycle

**Duration**: 2 minutes

**Steps**:
1. During any campaign event, tap **⏸ Pause** button
2. Pause menu appears (or navigates away)
3. Close Safari (or let device go to sleep)
4. Reopen Safari / App
5. Tap "Spielen"
6. Should resume **exactly where you paused**

**Expected Result**:
- ✓ Pause stops time/turns
- ✓ State persists after close
- ✓ Resume from exact position

**What to Check**:
- Event progress not lost
- Puzzle state preserved
- Dialog choices remembered

---

### Test Scenario 6: Mobile Layout & Touch

**Duration**: 5 minutes

**Portrait Mode**:
- [ ] Buttons fit on screen without scrolling
- [ ] Text readable (minimum 16px)
- [ ] Touch targets ≥44×44px
- [ ] No elements cut off at edges

**Landscape Mode** (rotate iPhone):
- [ ] Layout adjusts responsively
- [ ] Header stays accessible
- [ ] Buttons still reachable
- [ ] Text remains readable

**Touch Responsiveness**:
- [ ] Single tap recognized immediately
- [ ] No double-tap needed
- [ ] Button visual feedback (highlight)
- [ ] No accidental multi-touches

---

## Troubleshooting

### Issue: "This connection is not private"

**Cause**: Self-signed certificate warning (normal for development)

**Solution**:
1. Tap "More Options" at bottom
2. Tap "Visit on This Website"
3. Certificate is now trusted for this domain

---

### Issue: GPS not working

**Checklist**:
1. ✓ Using HTTPS (not HTTP)
2. ✓ Location permission granted
3. ✓ GPS enabled on iPhone
4. ✓ Not in Airplane mode
5. ✓ iPhone has clear sky view (if outdoors)
6. ✓ Demo mode activated for testing

**If still not working**:
- Restart Safari
- Clear browser cache
- Reboot iPhone
- Try demo GPS mode first

---

### Issue: Connection timeout / Can't reach server

**Cause**: Mac WiFi or network issue

**Checklist**:
1. Mac and iPhone on same WiFi network
2. Mac's WiFi IP: `ifconfig | grep "inet "`
3. Correct network URL (e.g., `https://192.168.1.100:5173`)
4. Mac's dev server still running (`npm run dev`)
5. Firewall not blocking port 5173

**Solution**:
```bash
# On Mac, get correct IP:
ifconfig | grep -A1 "en0"

# Example output:
# inet 192.168.1.100

# Use that IP on iPhone:
# https://192.168.1.100:5173
```

---

### Issue: "Cannot grant location permission"

**Cause**: iOS permissions issue

**Solution**:
1. Go to iPhone Settings → Safari → Websites → Location
2. Find Adventure Game URL, set to "Allow"
3. Reload Safari page
4. Try again

**If still blocked**:
- Settings → Privacy → Location Services
- Ensure "Location Services" is ON
- Check Safari has permission

---

### Issue: Save game lost after closing app

**Expected Behavior**: Game should persist across app close

**Debugging**:
1. Open browser console (Cmd+Option+I)
2. Check localStorage:
   ```javascript
   localStorage.getItem('adventure_game_state')
   ```
3. Should show a long JSON string (your save)
4. If empty, check IndexedDB:
   ```javascript
   indexedDB.databases()
   ```

**If no data**:
- Safari may have cleared storage
- Settings → Safari → Advanced → Website Data → Clear History
- Re-import your save or start fresh

---

## Performance Checklist

| Metric | Expected | Actual |
|--------|----------|--------|
| App load time | <2 sec | _____ |
| GPS position update | <1 sec | _____ |
| Event trigger | <200ms | _____ |
| Button response | <100ms | _____ |
| Battery drain | <5% per hour | _____ |
| Memory usage | <50 MB | _____ |
| Data usage | <1 MB per hour | _____ |

---

## Known Limitations in Test Version

### What Works
- ✅ Episodes 1–3 fully playable
- ✅ GPS discovery system (demo + real)
- ✅ Save/load persistence
- ✅ Pause/resume
- ✅ Mobile responsive design

### What's Simulated (Not Yet Full)
- ⚠️ Episodes 4–30 (generic simulator)
- ⚠️ Full map integration (basic outlines only)
- ⚠️ NPC encounters outside campaign
- ⚠️ Advanced GPS features (radius, clustering)

### What's Not Included
- ❌ Multiplayer
- ❌ In-app purchases
- ❌ Cloud saves
- ❌ App Store installation
- ❌ Android version

---

## Report Template

Use this template to document your test results:

```
═══════════════════════════════════════════════════════════════
ADVENTURE GAME – GPS TEST REPORT
═══════════════════════════════════════════════════════════════

Date: ___________
Tester: ___________
Device: iPhone ___ (iOS __)
Network: WiFi / Cellular
Weather: ___________

TEST RESULTS:
─────────────

☐ PASSED: New Game Flow
☐ PASSED: Auto-Continue
☐ PASSED: Campaign Gameplay (Eps 1–3)
☐ PASSED: GPS Button Accessible
☐ PASSED: Demo GPS Mode
☐ PASSED: Real GPS Testing
☐ PASSED: Pause & Resume
☐ PASSED: Mobile Layout
☐ PASSED: Touch Responsiveness

Issues Found:
─────────────
[List any bugs, glitches, or missing features]

Performance:
─────────────
- App load: _____ seconds
- GPS update: _____ seconds
- Battery drain: _____ % per hour

Recommendations:
─────────────
[Any improvements or features needed]

═══════════════════════════════════════════════════════════════
```

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Document any edge cases discovered
2. Note performance metrics
3. Identify missing features for Phase 8
4. Prepare production HTTPS setup
5. Plan app store submission

### If Issues Found ⚠️
1. Screenshot error messages
2. Note exact steps to reproduce
3. Mention device model & iOS version
4. Report in issue tracker
5. Don't publish as production yet

### For Production Deployment
1. Replace self-signed certificate with real one
2. Hide debug routes behind environment check
3. Update PWA manifest
4. Configure analytics
5. Set up error logging
6. Create TestFlight beta

---

## Support & Questions

**For development questions**: Check `README.md` in repository

**For GPS issues**: See Troubleshooting section above

**For performance optimization**: Report metrics from "Performance Checklist"

**For feature requests**: Document in issue tracker with test results

---

## Disclaimer

⚠️ **This is a test version, not production software.**

- Do NOT distribute to App Store or users yet
- Do NOT use self-signed HTTPS in production
- Do NOT rely on current feature set for commercial deployment
- All features subject to change
- Data and saves may be wiped between updates

**For testing and development only.**

---

**Last Updated**: January 2025  
**Status**: Ready for Local Testing  
**Next Phase**: Production HTTPS Setup & App Store Preparation


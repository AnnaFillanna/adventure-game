# iPhone Testing Guide - Adventure Game Phase 7 GPS Outdoor Adventure

## Overview

Phase 7 introduces GPS-based outdoor discovery gameplay. This guide explains how to test the outdoor adventure mode on your iPhone.

## Requirements

- iPhone with iOS 13+ and Location Services enabled
- Modern Safari browser or native app container (if using Capacitor)
- Secure connection (HTTPS) or localhost tunnel (e.g., ngrok)
- Network connectivity (WiFi or cellular)

## What You'll Experience

**Discovery-First Gameplay**: Walk outdoors and discover 3 hidden locations:
1. **Der alte Baum** (The Old Tree) - Rewards 25 XP + 5 Gold
2. **Der verborgene Stein** (The Hidden Stone) - Rewards 25 XP + 5 Gold  
3. **Die verbundenen Pfade** (The Connected Paths) - Rewards 50 XP + 10 Gold

Each location has a ~50-meter discovery radius. Walk within range to trigger the discovery and earn rewards.

**No Time Pressure**: There are no time limits, step goals, or mandatory walking distances. Move at your own pace and return later to continue.

## Setup Methods

### Option A: Localhost with ngrok Tunnel (Recommended for Development)

#### 1. Start the development server locally

```bash
cd /Users/annafilippi/Adventure
npm run dev
```

The dev server runs on `http://localhost:5173`

#### 2. Install and configure ngrok

```bash
# Install ngrok (if not already installed)
brew install ngrok

# Start ngrok tunnel pointing to localhost:5173
ngrok http 5173
```

ngrok will output a forwarding URL like:
```
Forwarding  https://12ab-34cd-56ef-78gh.ngrok.io -> http://localhost:5173
```

#### 3. Open on iPhone

1. Copy the ngrok HTTPS URL
2. Open Safari on your iPhone
3. Paste the URL and navigate
4. When prompted for location permission, tap **Allow**
5. The app will show your current position
6. Tap **"Abenteuer starten"** to begin

**Important**: The ngrok tunnel expires after 2 hours. Restart it when needed.

### Option B: Deploy to Staging Server with HTTPS

#### 1. Build the application

```bash
npm run build
```

This generates optimized files in the `dist/` folder.

#### 2. Deploy to your hosting provider

Use any HTTPS-enabled hosting (Vercel, Netlify, Firebase Hosting, etc.):

```bash
# Example: Netlify
npm run build
netlify deploy --prod --dir=dist
```

#### 3. Open on iPhone

1. Navigate to your staging URL (e.g., `https://adventure-game-staging.netlify.app`)
2. When prompted for location permission, tap **Allow**
3. Tap **"Abenteuer starten"** to begin

### Option C: Native App (Future - Capacitor)

Once Capacitor integration is complete:

```bash
npm run build:mobile
# Deploy to App Store or TestFlight
```

Currently, the browser-based testing (Options A or B) works best.

## Step-by-Step Testing

### 1. Permission Dialog

When you tap **"Abenteuer starten"**:
- Browser requests location access
- A system dialog appears: **"Allow 'Safari' to access your location?"**
- Tap **Allow** to grant permission
- If denied, the app shows: **"Standortzugriff wurde verweigert"** (Location access denied)

**Troubleshoot**:
- Go to iPhone Settings → Privacy & Security → Location Services
- Scroll down to Safari (or your browser)
- Ensure it's set to "Allow While Using App" or "Always"

### 2. GPS Initialization

After permission is granted:
- The app shows: **"GPS Aktiv"** badge
- Your current coordinates display (latitude, longitude)
- GPS accuracy is shown (typically 5-50 meters)

**Note**: GPS accuracy varies by environment:
- Outdoors, clear sky: 5-10 meters
- Urban with tall buildings: 20-50 meters
- Indoors near window: 50-100+ meters
- No GPS signal: "GPS-Signal verloren" message

### 3. Discovery Targets

You'll see 3 cards:
- **Der alte Baum** @ 52.5200°N, 13.3654°E
- **Der verborgene Stein** @ 52.5210°N, 13.3664°E
- **Die verbundenen Pfade** @ 52.5190°N, 13.3644°E

Each card shows:
- Distance to target (in meters)
- 🔍 Icon if far away
- 🧭 Icon if nearby (within ~75m)
- ✨ Icon if discovered

### 4. Walking to Discoveries

To trigger a discovery:
1. Walk within the target's radius (~50 meters)
2. Keep the app visible or in background (iOS continues GPS tracking)
3. When you're close enough, the card updates with:
   - ✨ Discovered icon
   - Green highlight on the card
   - Discovery message: e.g., "Das Lichtzeichen aktiviert sich unter deiner Hand!"
   - Rewards added: "+25 XP, +5 Gold"

**Important**: GPS accuracy is limited. You may need to walk around a bit for the device to confirm proximity. The 50-meter radius accounts for typical mobile GPS error.

### 5. Completion

Once all 3 targets are discovered:
- The quest status updates to 100%
- "🎉 Alle Geheimnisse entdeckt!" message appears
- Total rewards shown: 100 XP + 20 Gold
- Tap **"Abenteuer beenden"** to return to campaign

## Demo Mode (Testing Without GPS)

For testing indoors or without real GPS:

1. Open browser console (Safari → Develop → Console)
2. Run:
   ```javascript
   localStorage.setItem('__ADVENTURE_GAME_DEMO_MODE__', 'true');
   ```
3. Refresh the page
4. Tap **"Abenteuer starten"**
5. Demo mode controls appear: ⬆️ ⬇️ ➡️ ⬅️ buttons
6. Use arrow buttons to simulate movement
7. When you're near a target, the discovery triggers

**Note**: Demo mode is for development only and simulates coordinates near Berlin, Germany.

## Troubleshooting

### "HTTPS erforderlich" (HTTPS Required)

**Problem**: App shows "Adventure Game benötigt HTTPS oder Localhost..."

**Solution**:
- Ensure you're using an HTTPS URL (not HTTP)
- ngrok always provides HTTPS automatically
- Staging servers should use HTTPS
- Localhost (http://localhost:5173) works on desktop but NOT on iPhone

### "Standortzugriff wurde verweigert" (Location Access Denied)

**Problem**: App shows "Standortzugriff wurde verweigert..."

**Solution**:
1. Open iPhone Settings
2. Go to Privacy & Security → Location Services
3. Scroll to Safari (or your browser)
4. Change to "Allow While Using App"
5. Restart the app

### "GPS-Signal verloren" (GPS Signal Lost)

**Problem**: "GPS-Signal verloren..." message appears

**Solution**:
- Move to an open area with clear sky
- Move away from tall buildings or dense forest
- Ensure Location Services is enabled in Settings
- Try again after a few seconds (GPS acquisition takes time)

### No Discoveries Triggering

**Problem**: You're near a location but no discovery appears

**Possible causes**:
- GPS accuracy is poor (wait a few seconds)
- The distance calculation is being too strict (try walking a few meters closer)
- The device hasn't updated position yet (GPS updates every ~1-5 seconds)

**Solution**:
- Check the distance displayed on each card
- Walk 10+ meters closer to target coordinates
- Wait 10-15 seconds for GPS to stabilize
- Use Demo Mode to test locally

### App Crashes on iPhone

**Problem**: Safari crashes when opening the app

**Possible causes**:
- Device running low on memory
- Very old iOS version (update to iOS 13+)
- Browser compatibility issue

**Solution**:
- Close other apps and try again
- Restart Safari
- Clear browser cache: Settings → Safari → Clear History and Website Data
- Try a different browser (Firefox, Chrome)

## Expected Behavior

### Typical Session (10-15 minutes outdoors)

1. **Launch** app → See location permission dialog
2. **Permit** location access → GPS activates, current position shown
3. **Walk** to first target (Der alte Baum) → Takes 2-5 minutes depending on distance
4. **Discover** location → Card highlights, message appears, rewards awarded
5. **Walk** to second target (Der verborgene Stein) → Another 2-5 minutes
6. **Discover** → Second reward earned
7. **Walk** to third target (Die verbundenen Pfade) → Final 2-5 minutes
8. **Discover all** → Completion screen, total rewards shown (100 XP, 20 Gold)
9. **Return** to campaign by tapping "Abenteuer beenden"

### GPS Update Frequency

- Continuous tracking: Position updates every 1-5 seconds
- Discovery check: Runs with each GPS update
- If stationary: No frequent updates (battery optimization)
- Resume: App resumes tracking when you move again

## Performance & Battery

**Battery Impact**: Continuous GPS tracking consumes significant battery (~10-20% per hour outdoor use)

**Optimization Tips**:
- Close other apps to free memory
- Enable Low Power Mode if battery is below 20%
- Use WiFi + cellular together for faster GPS fix
- Keep app in foreground during outdoor play

**App Design Philosophy**:
- No forced walking times or distance requirements
- GPS updates only when needed
- Quest progress saved to localStorage
- Can pause and resume anytime

## What Happens to GPS Data

**Data Retention**:
- GPS coordinates are stored only in localStorage on your device
- No data is sent to external servers (currently no backend)
- Quest state persists across app restarts
- Coordinates are never logged or tracked remotely

**Privacy**:
- Location permission is browser-level (can be revoked anytime)
- Position data never leaves your device
- Adventure Game does not collect or store location data

## Known Limitations

1. **GPS Accuracy**: Mobile GPS has 5-50m error; discovery radius is 50m to account for this
2. **Urban Canyons**: Tall buildings reduce GPS accuracy
3. **Indoors**: GPS does not work reliably indoors; move to near windows or outdoors
4. **No Real Endpoints**: Currently, game has no backend; only client-side simulation of discoveries
5. **Single Quest**: Only one outdoor quest available (Der Wald-Abenteuer); more coming in future phases
6. **Mock Locations**: Current test locations are hardcoded near Berlin, Germany

## Future Enhancements

- [ ] Procedurally generated quest locations based on real map data
- [ ] Backend API to persist progress and sync across devices
- [ ] Multiple outdoor quests and story progressions
- [ ] Native iOS/Android apps via Capacitor
- [ ] Real-time multiplayer discovery events
- [ ] Integration with campaign progression (outdoor → episode unlock)
- [ ] Location-based rewards and achievements
- [ ] Offline mode with syncing when online
- [ ] Customizable discovery radius based on GPS accuracy

## Contact & Support

For bugs or questions about Phase 7 testing:
1. Check the logs in browser console (Develop menu)
2. Try Demo Mode to isolate GPS issues
3. Test with ngrok first (stable HTTPS tunnel)
4. Verify Location Services are enabled

---

**Version**: Phase 7 MVP (GPS Discovery Prototype)  
**Last Updated**: 2025-11-02  
**Status**: Ready for outdoor testing on iOS 13+

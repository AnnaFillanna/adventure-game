import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGameStore } from '../game/state/gameStore';
import { preferencesManager } from '../game/utils/storage';
import { geolocationService } from '../game/geo/geolocation';
import type { GeoPoint } from '../game/geo/types';
import { getHeroDefinition } from '../game/characters/heroDefinitions';
import type { HeroId } from '../game/characters/types';
import { loadWalkMap, WalkMapError } from '../game/walk/mapProvider';
import { planWalk, validFix, type WalkPlan } from '../game/walk/planner';
import { acceptWalkFix, stationReady, type WalkSample } from '../game/walk/locationGate';
import { loadWalk, saveWalk, solveTask, WALK_TASKS } from '../game/walk/progress';
import styles from './OutdoorAdventure.module.scss';
const LocationMap = lazy(() => import('../components/Map/LocationMap').then(m => ({ default: m.LocationMap })));

type Phase = 'idle' | 'locating' | 'loading' | 'preview' | 'walking' | 'paused';
export default function NearbyWalk() {
  const selected = useGameStore(s => s.selectedHeroId);
  const hero = selected ?? preferencesManager.getPreference<unknown>('campaignHero', null);
  if (typeof hero !== 'string' || !['aeran','velar','varg','ravena','saira'].includes(hero)) return <Navigate to="/character-select" replace />;
  return <WalkSession key={hero} hero={hero as HeroId} />;
}
export function WalkSession({ hero }: { hero: HeroId }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(() => loadWalk(hero));
  const progressRef = useRef(progress);
  const [phase, setPhase] = useState<Phase>('idle');
  const [plan, setPlan] = useState<WalkPlan | null>(null);
  const [startCompleted, setStartCompleted] = useState(0);
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [sample, setSample] = useState<WalkSample | null>(null);
  const sampleRef = useRef<WalkSample | null>(null);
  const latestFixValid = useRef(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [retryAt, setRetryAt] = useState(0);
  const [searchStep, setSearchStep] = useState<'gps' | 'map' | 'route' | 'done' | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const resultRef = useRef<HTMLElement | null>(null);
  const [conditions, setConditions] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [now, setNow] = useState(Date.now());
  const generation = useRef(0);
  const request = useRef<AbortController | null>(null);
  const deadline = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const heartbeat = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const retrySeconds = Math.max(0, Math.ceil((retryAt - now) / 1000));
  useEffect(() => {
    if (!retryAt) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [retryAt]);
  useEffect(() => {
    if (error) resultRef.current?.focus();
  }, [error]);

  function cancel() {
    generation.current++;
    request.current?.abort(); request.current = null;
    clearTimeout(deadline.current); clearInterval(heartbeat.current);
    geolocationService.stopTracking();
  }
  function pause(reason = 'Spaziergang pausiert. Erledigte Aufgaben bleiben gespeichert. Suche zum Fortsetzen die verbleibenden Aufgaben von deinem aktuellen Standort neu.') {
    cancel(); setPhase('paused'); setStopped(false); sampleRef.current = null; latestFixValid.current = false; setSample(null); setMessage(reason);
  }
  useEffect(() => {
    const hidden = () => { if (document.visibilityState === 'hidden') pause('GPS pausiert, weil das Spiel im Hintergrund ist. Suche zum Fortsetzen von deinem aktuellen Standort neu.'); };
    document.addEventListener('visibilitychange', hidden);
    return () => { cancel(); document.removeEventListener('visibilitychange', hidden); };
    // Session-owned refs are intentionally read at cleanup, not captured on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function search() {
    if (!progressRef.current || progressRef.current.rewarded || Date.now() < retryAt) return;
    cancel(); const id = generation.current;
    setPhase('locating'); setError(''); setRetryAt(0); setSearchStep('gps'); setGpsAccuracy(null); setMessage('Dein aktueller Standort wird gesucht …');
    setPlan(null); setSample(null); sampleRef.current = null; latestFixValid.current = false; setStopped(false); setConditions(false); setShowMap(false); setMapReady(false); setMapFailed(false);
    deadline.current = setTimeout(() => {
      if (id !== generation.current) return;
      cancel(); setPhase('idle'); setMessage(''); setError('Der Browser hat noch keinen Standort geliefert. Prüfe die Standortfreigabe und versuche es erneut.');
    }, 15000);
    geolocationService.getCurrentPosition(async fix => {
      if (id !== generation.current) return;
      clearTimeout(deadline.current);
      setPosition(fix);
      if (!validFix(fix)) { setPhase('idle'); setMessage(''); setError('Dein Standort ist noch zu ungenau. Für die Wegsuche brauchen wir eine Genauigkeit von höchstens 25 m. Versuche es unter freiem Himmel erneut.'); return; }
      setGpsAccuracy(Math.round(fix.accuracy!)); setSearchStep('map');
      setPhase('loading'); setMessage('Dein Standort wurde gefunden. Die Wegkarte wird geladen …');
      const controller = new AbortController(); request.current = controller;
      const requestedAt = Date.now();
      deadline.current = setTimeout(() => {
        if (id !== generation.current) return;
        // Settle the UI even if a browser/network stream ignores AbortSignal.
        cancel(); setPhase('idle'); setMessage(''); setNow(Date.now()); setRetryAt(requestedAt + 60000);
        setError('Die Wegkarte hat nicht innerhalb von 30 Sekunden geantwortet. Dein Standort wurde gefunden, aber die Kartendaten fehlen.');
      }, 30000);
      try {
        const data = await loadWalkMap(fix, controller.signal);
        if (id !== generation.current) return;
        if (controller.signal.aborted) throw new Error('Zeitüberschreitung');
        setSearchStep('route');
        const count = progressRef.current!.completed.length;
        const next = planWalk(data, fix, WALK_TASKS.length - count, fix.timestamp!);
        setSearchStep('done'); setStartCompleted(count); setPlan(next); setPhase('preview'); setMessage('Ein Wegvorschlag wurde gefunden. Prüfe den Verlauf und die Bedingungen vor Ort.');
      } catch (e) {
        if (id !== generation.current) return;
        if (e instanceof WalkMapError) { setRetryAt(e.retryAt); setNow(Date.now()); }
        setPhase('idle'); setMessage(''); setError(controller.signal.aborted ? 'Die Wegsuche hat zu lange gedauert. Bitte versuche es später erneut.' : e instanceof Error ? e.message : 'Die Wegsuche ist gerade nicht verfügbar.');
      } finally { if (id === generation.current) clearTimeout(deadline.current); }
    }, failure => {
      if (id !== generation.current) return;
      clearTimeout(deadline.current); setPhase('idle'); setMessage('');
      setError(failure.code === 'PERMISSION_DENIED' ? 'Der Standort wurde nicht freigegeben. Erlaube den Zugriff in den Browsereinstellungen, wenn du die GPS-Aufgaben spielen möchtest.' : 'Dein Standort ist gerade nicht verfügbar. Bitte versuche es erneut.');
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  }
  function begin() {
    if (!plan || !conditions || !mapReady || mapFailed || plan.expiresAt < Date.now()) return;
    cancel(); const id = generation.current; const beganAt = Date.now();
    setPhase('walking'); setStopped(false); setError(''); setMessage('GPS wird verbunden. Bleib zum Lesen und Spielen an einem geeigneten Ort stehen.');
    sampleRef.current = null; latestFixValid.current = false; setSample(null);
    heartbeat.current = setInterval(() => {
      if (id !== generation.current) return;
      setNow(Date.now());
      const latest = sampleRef.current?.fix.timestamp ?? beganAt;
      if (Date.now() - latest > 20000) pause('Das GPS-Signal ist ausgefallen oder zu ungenau. Die Aufgaben sind pausiert; dein bestätigter Fortschritt bleibt erhalten.');
    }, 1000);
    geolocationService.startTracking(fix => {
      if (id !== generation.current) return;
      const accepted = acceptWalkFix(plan, sampleRef.current, fix);
      latestFixValid.current = !!accepted;
      if (!accepted) { setSample(null); setStopped(false); setMessage('Dieser Standort ist zu ungenau, zwischen mehreren Wegen nicht eindeutig, außerhalb des Wegs oder zu weit gesprungen. Es wird keine Aufgabe freigeschaltet.'); return; }
      if (!sampleRef.current || accepted.stationarySince !== sampleRef.current.stationarySince) setStopped(false);
      sampleRef.current = accepted; setSample(accepted); setPosition(fix); setNow(Date.now());
      setMessage('GPS verbunden. Folge nur dem angezeigten Fußweg. Wenn er gesperrt oder ungeeignet ist, pausiere.');
    }, failure => {
      if (id !== generation.current) return;
      pause(failure.code === 'PERMISSION_DENIED' ? 'Die Standortfreigabe wurde entzogen. Der Spaziergang ist pausiert.' : 'Das GPS-Signal ist verloren gegangen. Der Spaziergang ist pausiert.');
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 });
  }
  const station = plan?.stations[(progress?.completed.length ?? 0) - startCompleted];
  const task = WALK_TASKS[progress?.completed.length ?? 0];
  const ready = phase === 'walking' && !!station && stationReady(sample, station, now);
  function answer(index: number) {
    const current = progressRef.current;
    if (!latestFixValid.current || !current || !task || !station || !stopped || phase !== 'walking' || !stationReady(sampleRef.current, station)) return;
    const next = solveTask(current, task.id, index);
    if (next === current) { setMessage('Das Zeichen passt noch nicht. Versuche es in Ruhe erneut – es gibt keine Strafe.'); return; }
    if (!saveWalk(hero, next)) { setError('Deine Antwort konnte nicht gespeichert werden. Bitte versuche es erneut; dein bisheriger Fortschritt bleibt erhalten.'); return; }
    progressRef.current = next; setProgress(next); setStopped(false); setError(''); setMessage('Aufgabe gelöst und gespeichert.');
    if (next.rewarded) { cancel(); setPhase('idle'); }
  }
  return <main className={styles.container}>
    <header className={styles.header}><p>{getHeroDefinition(hero).name}</p><h1>Dein GPS-Abenteuer</h1><p>Drei Zeichen auf einem kurzen Spaziergang</p></header>
    <section className={styles.status}>
      <p><strong>Testversion:</strong> Wege werden aus Kartendaten vorgeschlagen und sind nicht vor Ort geprüft. Ein Vorschlag ist keine Sicherheitsfreigabe.</p>
      <p>Gib deinen Standort frei. Wir suchen einen kurzen Fußweg mit drei Aufgaben in deiner Nähe. Du kannst jederzeit pausieren.</p>
      <details><summary>Wie dein Standort verwendet wird</summary><p>Die Wegsuche übermittelt einen auf ungefähr 100 m gerundeten Startbereich an den OpenStreetMap-Dienst Overpass. Die Karte lädt Bilder von OpenStreetMap. GPS-Spuren werden nicht gespeichert.</p></details>
      {progress && <p>{progress.completed.length} von 3 Aufgaben gespeichert · {progress.gold} Gold aus diesem Spaziergang</p>}
      <p role="status">{message}</p>
    </section>
    {searchStep && <section ref={resultRef} tabIndex={-1} className={styles.status} aria-label="Ergebnis der Wegsuche">
      <h2>{error ? 'Wegsuche unterbrochen' : searchStep === 'done' ? 'Weg gefunden' : 'Deine Wegsuche'}</h2>
      <ol>
        <li>Standort: {gpsAccuracy !== null ? `gefunden (Genauigkeit etwa ${gpsAccuracy} m)` : error ? 'noch nicht verfügbar' : 'wird gesucht …'}</li>
        <li>Kartendaten: {searchStep === 'route' || searchStep === 'done' ? 'geladen' : searchStep === 'map' ? error ? 'nicht geladen' : 'werden geladen …' : 'noch nicht angefragt'}</li>
        <li>Fußweg: {searchStep === 'done' ? 'gefunden' : searchStep === 'route' && error ? 'kein geeigneter Vorschlag' : 'noch nicht gefunden'}</li>
      </ol>
      {error && <p role="alert">{error}</p>}
      {retrySeconds > 0 && <p>Neue Kartenanfrage in {retrySeconds} Sekunden möglich. Die Ursache oben bleibt sichtbar. Es wird nicht automatisch neu gestartet.</p>}
    </section>}
    {!searchStep && error && <p role="alert">{error}</p>}
    {!progress ? <p role="alert">Dein Spaziergang-Spielstand kann nicht sicher gelesen werden. Die gespeicherten Daten bleiben unverändert.</p> : progress.rewarded ? <section className={styles.completionMessage}><h2>Alle drei Zeichen gefunden!</h2><p>20 Gold wurden einmalig für diesen Spaziergang gespeichert. Diese Belohnung ist getrennt vom Kampagneninventar. Du kannst jetzt in Ruhe auf demselben Weg zurückgehen oder die Geschichte öffnen. Die Karte bleibt bis zum Verlassen dieser Seite sichtbar.</p>{plan && position && <Suspense fallback={<p>Karte wird geladen …</p>}><LocationMap position={position} walkPlan={plan} /></Suspense>}</section> : <>
      {['idle', 'paused'].includes(phase) && <section className={styles.actions}><button className={styles.primaryButton} disabled={retrySeconds > 0} onClick={search}>{retrySeconds > 0 ? `Erneut versuchen in ${retrySeconds} s` : progress.completed.length ? 'Verbleibende Aufgaben hier suchen' : 'Standort und Wege suchen'}</button></section>}
      {['locating','loading'].includes(phase) && <section className={styles.actions}><p>Bitte kurz warten …</p><button onClick={() => pause()}>Suche abbrechen</button></section>}
      {plan && position && ['preview','walking'].includes(phase) && <section className={styles.status}>
        <h2>{phase === 'preview' ? 'Dein Wegvorschlag' : 'Dein Spaziergang'}</h2>
        <p>Hin und zurück ungefähr {Math.round(plan.oneWayMeters * 2)} m. Rückweg auf demselben Weg. Die farbige Linie beginnt auf dem erfassten Fußweg, nicht an einer Haustür.</p>
        <p>Kartendaten vom {new Date(plan.sourceTime).toLocaleDateString('de-DE')}. © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a></p>
        {!showMap ? <button className={styles.primaryButton} onClick={() => setShowMap(true)}>Weg auf der Karte ansehen</button> : <Suspense fallback={<p>Karte wird geladen …</p>}><LocationMap position={position} walkPlan={plan} onMapReady={() => setMapReady(true)} onMapUnavailable={() => { setMapFailed(true); if (phase === 'walking') pause('Die Karte ist ausgefallen. Der Spaziergang wurde pausiert.'); }} /></Suspense>}
        {phase === 'preview' && <>
          <details><summary>Was an den Wegdaten geprüft wurde</summary><ul>{plan.checks.map(check => <li key={check}>{check}</li>)}</ul><p>Aktuelle Sperrungen, Wetter, Beleuchtung und geeignete Halteplätze sind damit nicht bestätigt.</p></details>
          <label className={styles.walkConfirmation}><input type="checkbox" checked={conditions} onChange={e => setConditions(e.target.checked)} /> Ich habe den Verlauf angesehen. Wir gehen bei Tageslicht mit einer erwachsenen Begleitperson auf offenen, geeigneten Wegen. Bei Verkehr, Sperren oder Hindernissen pausieren wir; wir nehmen keine Abkürzungen.</label>
          <div className={styles.actions}><button className={styles.primaryButton} disabled={!conditions || !mapReady || mapFailed} onClick={begin}>Test-Spaziergang starten</button></div>
          {mapFailed && <p role="alert">Ohne geladene Karte kann dieser Spaziergang nicht starten.</p>}
        </>}
        {phase === 'walking' && station && task && <section className={styles.walkTask}>
          <h2>{task.title}</h2>
          <p>Nächster Haltepunkt: {sample ? `noch ungefähr ${Math.max(0, Math.round(station.along - sample.along))} m entlang des Wegs` : 'warte auf ein genaues GPS-Signal am Weganfang'}.</p>
          <p>{ready ? 'Du bist am Haltepunkt. Prüfe, ob du hier sicher stehen und lesen kannst.' : 'Die Aufgabe öffnet sich nach deiner Ankunft und einem kurzen Halt. Folge dem Fußweg, nicht einer geraden Linie zur Markierung.'}</p>
          {ready && !stopped && <button className={styles.primaryButton} onClick={() => setStopped(true)}>Ich stehe an einem geeigneten Ort</button>}
          {ready && stopped && <><p>{task.story}</p><h3>{task.question}</h3><div className={styles.actions}>{task.answers.map((option, i) => <button key={option} onClick={() => answer(i)}>{option}</button>)}</div><p>Hinweis: {task.answers[task.correct]}. Hinweise sind kostenlos.</p></>}
        </section>}
        <div className={styles.actions}><button onClick={() => pause()}>Spaziergang pausieren</button><button onClick={() => pause('Der Weg ist ungeeignet oder gesperrt. Es wird keine automatische Umleitung gestartet. Du kannst später von einem geeigneten Standort neu suchen.')}>Weg gesperrt oder ungeeignet</button></div>
      </section>}
    </>}
    <section className={styles.actions}><button className={styles.secondaryButton} onClick={() => { cancel(); navigate('/hub'); }}>Zur Abenteuerübersicht</button></section>
  </main>;
}

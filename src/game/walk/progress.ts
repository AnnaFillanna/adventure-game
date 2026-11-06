export const WALK_TASKS = [
  { id: 'message', title: 'Die Botschaft im Licht', story: 'Eine virtuelle Botschaft des Magiers erscheint: „Drei Zeichen weisen den Weg. Beginne mit dem Licht, das jeden neuen Tag begrüßt.“', question: 'Welches Zeichen meint der Magier?', answers: ['Die Sonne', 'Ein Schloss', 'Eine Münze'], correct: 0 },
  { id: 'trail', title: 'Die verborgene Spur', story: 'Auf deiner magischen Karte begegnen sich drei Spuren. Eine führt zum Licht, eine endet im Schatten, die dritte verschwindet. Du untersuchst nur die virtuelle Karte; suche keine Zeichen an echten Gebäuden.', question: 'Welche Spur möchtest du auf der magischen Karte untersuchen?', answers: ['Die Spur im Schatten', 'Die Spur zum Licht', 'Die verschwundene Spur'], correct: 1 },
  { id: 'sign', title: 'Das Zeichen des Zusammenhalts', story: 'Du hast beide Hinweise bewahrt. Der letzte Stein öffnet sich, wenn die Zeichen gemeinsam leuchten.', question: 'Wie verbindest du die Zeichen?', answers: ['Jedes Zeichen verstecken', 'Ein Zeichen wegwerfen', 'Alle Zeichen zusammenlegen'], correct: 2 },
] as const;
export interface WalkProgress { version: 1; completed: string[]; rewarded: boolean; gold: number }
export const emptyWalk = (): WalkProgress => ({ version: 1, completed: [], rewarded: false, gold: 0 });
const keyFor = (hero: string) => `adventure_game_gps_walk_v1_${hero}`;
export function validProgress(p: unknown): p is WalkProgress {
  if (!p || typeof p !== 'object') return false;
  const value = p as WalkProgress;
  return value.version === 1 && Array.isArray(value.completed) && value.completed.length <= WALK_TASKS.length
    && value.completed.every((id, i) => id === WALK_TASKS[i].id)
    && value.rewarded === (value.completed.length === WALK_TASKS.length) && value.gold === (value.rewarded ? 20 : 0);
}
export function loadWalk(hero: string): WalkProgress | null {
  try { const raw = localStorage.getItem(keyFor(hero)); if (raw === null) return emptyWalk(); const p: unknown = JSON.parse(raw); return validProgress(p) ? p : null; }
  catch { return null; }
}
export function saveWalk(hero: string, p: WalkProgress): boolean {
  if (!validProgress(p)) return false;
  try {
    // Corrupt/future data must never be silently replaced.
    const saved = loadWalk(hero);
    if (saved === null || saved.completed.length > p.completed.length) return false;
    localStorage.setItem(keyFor(hero), JSON.stringify(p)); return true;
  } catch { return false; }
}
export function solveTask(progress: WalkProgress, id: string, answer: number): WalkProgress {
  const task = WALK_TASKS[progress.completed.length];
  if (!task || task.id !== id || task.correct !== answer) return progress;
  const completed = [...progress.completed, id], rewarded = completed.length === WALK_TASKS.length;
  return { version: 1, completed, rewarded, gold: rewarded ? 20 : 0 };
}

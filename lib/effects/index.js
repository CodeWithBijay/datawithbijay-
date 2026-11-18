import boot from './boot';
import nameParticles from './nameParticles';
import navPanel from './navPanel';
import spaceStations from './spaceStations';
import liquidButton from './liquidButton';
import pixel from './pixel';
import githubActivity from './githubActivity';
import clock from './clock';
import runLog from './runLog';
import skills from './skills';
import journeyTabs from './journeyTabs';
import revealNav from './revealNav';
import commandPalette from './commandPalette';
import polish from './polish';
import extras from './extras';

let started = false;
/** Start every browser-side behaviour once (React strict mode runs effects twice in development). */
export default function startSite() {
  if (started) return;
  started = true;
  for (const init of [boot, nameParticles, navPanel, spaceStations, liquidButton, pixel, githubActivity, clock, runLog, skills, journeyTabs, revealNav, commandPalette, polish, extras]) {
    try { init(); } catch (e) { console.error('[site]', init.name, e); }
  }
}

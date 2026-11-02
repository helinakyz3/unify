// matching logic for UniFy
// a good match = same free time + same activity + same place
// everything here runs on the computer, no internet needed

import { ACTIVITIES } from "./students";

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

// list of activity ids we allow
export const SUPPORTED_ACTIVITIES = ACTIVITIES.map((activity) => activity.id);

// turns "HH:MM" into minutes, or null if it's not a valid time
function toMinutes(time) {
  if (typeof time !== "string" || !TIME_RE.test(time)) return null;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toTimeString(minutes) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

// checks the time range makes sense (end is after start)
export function isValidAvailability(user) {
  const start = toMinutes(user?.freeFrom);
  const end = toMinutes(user?.freeUntil);
  return start !== null && end !== null && end > start;
}

// finds the free time both people have in common
export function calculateOverlap(userA, userB) {
  if (!isValidAvailability(userA) || !isValidAvailability(userB)) return null;

  const start = Math.max(toMinutes(userA.freeFrom), toMinutes(userB.freeFrom));
  const end = Math.min(toMinutes(userA.freeUntil), toMinutes(userB.freeUntil));
  const duration = end - start;

  if (duration <= 0) return null;

  return {
    start: toTimeString(start),
    end: toTimeString(end),
    duration,
  };
}

// finds activities both users picked
export function findSharedActivities(userA, userB) {
  const activitiesA = Array.isArray(userA?.activities) ? userA.activities : [];
  const activitiesB = Array.isArray(userB?.activities) ? userB.activities : [];

  const validA = activitiesA.filter((a) => SUPPORTED_ACTIVITIES.includes(a));
  const setB = new Set(activitiesB.filter((a) => SUPPORTED_ACTIVITIES.includes(a)));

  return validA.filter((activity) => setB.has(activity));
}

// just checks if the location text is the same (no GPS used)
export function sameLocation(userA, userB) {
  return Boolean(userA?.location) && userA.location === userB?.location;
}

// gives a score out of 100: time overlap (40), shared activity (40), same place (20)
export function calculateMatchScore({ overlap, sharedActivities, isSameLocation }) {
  const activities = Array.isArray(sharedActivities) ? sharedActivities : [];
  const timeScore =
    overlap && overlap.duration > 0 ? Math.min(40, Math.round((overlap.duration / 90) * 40)) : 0;
  const activityScore = activities.length > 0 ? 40 : 0;
  const locationScore = isSameLocation ? 20 : 0;

  return Math.min(100, timeScore + activityScore + locationScore);
}

// checks if the new candidate is a better match than the current best one
function isBetterMatch(candidateResult, currentBest) {
  if (!currentBest) return true;
  if (candidateResult.score !== currentBest.score) {
    return candidateResult.score > currentBest.score;
  }
  if (candidateResult.overlap.duration !== currentBest.overlap.duration) {
    return candidateResult.overlap.duration > currentBest.overlap.duration;
  }
  if (candidateResult.sharedActivities.length !== currentBest.sharedActivities.length) {
    return candidateResult.sharedActivities.length > currentBest.sharedActivities.length;
  }
  return false;
}

// looks through all students and picks the best match for currentUser
export function findBestMatch(currentUser, candidates) {
  if (!currentUser || !Array.isArray(candidates)) return null;

  let best = null;

  for (const candidate of candidates) {
    if (!candidate || candidate.id === undefined || candidate.id === currentUser.id) {
      continue;
    }

    const overlap = calculateOverlap(currentUser, candidate);
    if (!overlap) continue;

    const sharedActivities = findSharedActivities(currentUser, candidate);
    if (sharedActivities.length === 0) continue;

    const isSameLocation = sameLocation(currentUser, candidate);
    if (!isSameLocation) continue;

    const score = calculateMatchScore({ overlap, sharedActivities, isSameLocation });
    const result = { student: candidate, overlap, sharedActivities, location: currentUser.location, score };

    if (isBetterMatch(result, best)) {
      best = result;
    }
  }

  return best;
}

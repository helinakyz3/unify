// Pulse and Groups features
// Pulse = see what people around you are doing right now
// Groups = join 2-4 people doing the same activity

import { SUPPORTED_ACTIVITIES } from "./matching";

// a group includes you, so 2 means "you + 1 other person"
export const MIN_GROUP_SIZE = 2;
export const MAX_GROUP_SIZE = 4;

// checks the student object has the fields we need
function isValidPeer(student) {
  return (
    Boolean(student) &&
    student.id !== undefined &&
    typeof student.location === "string" &&
    Array.isArray(student.activities)
  );
}

// finds other students at the same place who want to do the same thing
export function findActivityPeers(currentUser, students, activityId) {
  if (!currentUser || !Array.isArray(students) || !SUPPORTED_ACTIVITIES.includes(activityId)) {
    return [];
  }

  return students.filter(
    (student) =>
      isValidPeer(student) &&
      student.id !== currentUser.id &&
      student.location === currentUser.location &&
      student.activities.includes(activityId)
  );
}

// counts how many students want each activity at a location (for the Pulse page)
export function getPulseStats(students, location) {
  if (!Array.isArray(students) || typeof location !== "string") return [];

  return SUPPORTED_ACTIVITIES.map((activityId) => ({
    activityId,
    count: students.filter(
      (student) =>
        isValidPeer(student) && student.location === location && student.activities.includes(activityId)
    ).length,
  })).filter((stat) => stat.count > 0);
}

// makes a small group (2-4 people) for an activity, or null if not enough people
export function formSmallGroup(currentUser, students, activityId) {
  const peers = findActivityPeers(currentUser, students, activityId);
  if (peers.length < MIN_GROUP_SIZE - 1) return null;

  const members = [currentUser, ...peers.slice(0, MAX_GROUP_SIZE - 1)];

  return { activityId, location: currentUser.location, members };
}

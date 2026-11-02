// "AI Social Planner" — this is NOT real AI
// it's just a function that picks a safe location and writes a message
// no API key, no internet connection, nothing sent anywhere

import { SUPPORTED_ACTIVITIES } from "./matching";

const ACTIVITY_LABELS = {
  coffee: { emoji: "☕", label: "Coffee" },
  food: { emoji: "🍜", label: "Food" },
  walk: { emoji: "🚶", label: "Walk" },
  study: { emoji: "📚", label: "Study" },
  chill: { emoji: "🎮", label: "Chill" },
  explore: { emoji: "🎨", label: "Explore" },
};

// list of safe, public meeting spots on campus (real Greenwich buildings)
export const SAFE_MEETUP_LOCATIONS = {
  coffee: "Dreadnought Building",
  food: "Dreadnought Building",
  walk: "Queen Mary Court",
  study: "Stockwell Street",
  chill: "Dreadnought Building",
  explore: "King William Court",
};

const CONVERSATION_STARTERS = {
  coffee: "What's something you want to try while you're at university?",
  food: "What's the best meal you've had on campus so far?",
  walk: "What's your favourite spot on campus nobody talks about?",
  study: "What's the hardest module you're taking this term?",
  chill: "What have you been watching or playing lately?",
  explore: "If you could explore one new place in the city, where would it be?",
};

export const fallbackSuggestion = {
  activity: "Coffee",
  emoji: "☕",
  location: "Dreadnought Building",
  time: "18:30",
  duration: 90,
  conversationStarter: "What's something you want to try while you're at university?",
  blurb: "☕ Grab a coffee at the Dreadnought Building at 18:30. You have 90 minutes together.",
};

// builds a meetup suggestion (activity, place, time, starter question)
export function generateMeetupSuggestion(match, activityId) {
  if (!match) return fallbackSuggestion;

  const sharedActivities = Array.isArray(match.sharedActivities) ? match.sharedActivities : [];

  // only use activityId if both people actually picked it
  const chosenActivity =
    activityId && SUPPORTED_ACTIVITIES.includes(activityId) && sharedActivities.includes(activityId)
      ? activityId
      : sharedActivities.find((a) => SUPPORTED_ACTIVITIES.includes(a)) || "coffee";

  const meta = ACTIVITY_LABELS[chosenActivity] || ACTIVITY_LABELS.coffee;
  const location = SAFE_MEETUP_LOCATIONS[chosenActivity] || SAFE_MEETUP_LOCATIONS.coffee;
  const campus = typeof match.location === "string" ? match.location : undefined;
  const time = match.overlap?.start || fallbackSuggestion.time;
  const duration =
    typeof match.overlap?.duration === "number" ? match.overlap.duration : fallbackSuggestion.duration;

  return {
    activity: meta.label,
    emoji: meta.emoji,
    location,
    campus,
    time,
    duration,
    conversationStarter: CONVERSATION_STARTERS[chosenActivity] || fallbackSuggestion.conversationStarter,
    blurb: `${meta.emoji} Grab ${meta.label.toLowerCase()} at the ${location} at ${time}. You have ${duration} minutes together.`,
  };
}

// async just so the UI can show a little "thinking..." delay
export async function getAIMeetupSuggestion(match, activityId) {
  return generateMeetupSuggestion(match, activityId);
}

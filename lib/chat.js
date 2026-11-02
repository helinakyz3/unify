// basic chat for after a match or group is made
// no real backend, messages are not saved anywhere

const OPENING_LINES = {
  coffee: "Hey! Want to meet for coffee at {location}?",
  food: "Hey! Grabbing food at {location} — you in?",
  walk: "Hey! Fancy a walk near {location}?",
  study: "Hey! Studying at {location} if you want to join.",
  chill: "Hey! Chilling at {location}, come hang out?",
  explore: "Hey! Thinking of exploring around {location} — want to come?",
};

const AUTO_REPLIES = ["Sounds good, see you there.", "Perfect, I'll head over now.", "Works for me!"];

// makes the first messages for a new chat, based on the activity
export function buildOpeningMessages(connection) {
  if (!connection || !Array.isArray(connection.members) || connection.members.length < 2) {
    return [];
  }

  const [self, ...others] = connection.members;
  const location = connection.location || "campus";
  const template = OPENING_LINES[connection.activityId] || OPENING_LINES.coffee;
  const opener = template.replace("{location}", location);
  const firstReply = connection.time ? `Sure, ${connection.time} works for me.` : AUTO_REPLIES[0];

  const messages = [{ from: self?.name || "You", text: opener }];

  others.forEach((member, index) => {
    messages.push({
      from: member?.name || "Someone",
      text: index === 0 ? firstReply : AUTO_REPLIES[index % AUTO_REPLIES.length],
    });
  });

  return messages;
}

// a fake auto-reply so the chat feels a bit alive
export function buildAutoReply() {
  return AUTO_REPLIES[0];
}

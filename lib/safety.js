// safety features for a meetup (check-in timer, report, block)
// this is just a demo, not connected to a real emergency service

export const SAFETY_TIMER_OPTIONS = [
  { minutes: 10, label: "10 min" },
  { minutes: 30, label: "30 min" },
  { minutes: null, label: "Off" },
];

// fake campus security number for the demo
export const CAMPUS_SECURITY_CONTACT = {
  label: "Campus Security (Demo)",
  contact: "Ext. 1234",
};

// puts together the info shown on the safety screen
export function buildSafetySnapshot({ partnerName, activity, location, time } = {}) {
  return {
    partnerName: partnerName || "your match",
    activity: activity || "your meetup",
    location: location || "a public campus location",
    time: time || "now",
  };
}

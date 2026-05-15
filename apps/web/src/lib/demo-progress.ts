const KEY_RECOGNIZE = "futuristic_demo_recognize";
const KEY_JOURNEY = "futuristic_demo_journey";

export function markRecognizeDemoComplete(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_RECOGNIZE, "1");
}

export function markJourneyDemoComplete(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_JOURNEY, "1");
}

export function getDemoProgress(): { recognize: boolean; journey: boolean } {
  if (typeof window === "undefined") return { recognize: false, journey: false };
  return {
    recognize: localStorage.getItem(KEY_RECOGNIZE) === "1",
    journey: localStorage.getItem(KEY_JOURNEY) === "1",
  };
}

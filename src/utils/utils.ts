export function getTagColors(tag: string): {
  backgroundColor: string;
  color: string;
} {
  const hash = tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const hue = hash % 360;
  const saturation = 70; // Pastel-ish
  const lightness = 85; // Light background

  const bgLightness = lightness;
  const color =
    bgLightness > 70
      ? `hsl(${hue}, ${saturation}%, 20%)` // Darker text for light backgrounds
      : `hsl(${hue}, ${saturation}%, 95%)`; // Light text for dark backgrounds

  return {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    color,
  };
}

export function timeFormatting(timeLeft: number): string {
  return (
    `${Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0")}` +
    ":" +
    `${(timeLeft % 60).toString().padStart(2, "0")}`
  );
}

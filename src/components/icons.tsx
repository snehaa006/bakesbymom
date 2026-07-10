interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function LoafIcon({ size = 34, color = "currentColor", strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13c0-3 2-5 5-5 1-2 5-2 6 0 3 0 5 2 5 5v5H4z" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function SunDomeIcon({ size = 26, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18a9 9 0 0 1-18 0z" />
      <path d="M8 6c0-1 .5-1.5 1-2M12 5c0-1 .5-1.5 1-2M16 6c0-1 .5-1.5 1-2" />
    </svg>
  );
}

export function WheatIcon({ size = 26, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V8" />
      <path d="M12 8c-3 0-5-2-5-5 3 0 5 2 5 5zM12 8c3 0 5-2 5-5-3 0-5 2-5 5zM12 14c-3 0-5-2-5-5 3 0 5 2 5 5zM12 14c3 0 5-2 5-5-3 0-5 2-5 5z" />
    </svg>
  );
}

export function FlameIcon({ size = 26, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 2-3 2-5 1 1 2 1 2 2z" />
      <path d="M12 22a6 6 0 0 0 6-6c0-1-.5-2-1-3-1 2-3 2-3 4" />
    </svg>
  );
}

export function BagIcon({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export function PinIcon({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function CupIcon({ size = 40, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
      <path d="M16 11h2a2 2 0 0 1 0 4h-2" />
    </svg>
  );
}

export function FlowerIcon({ size = 42, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      <path d="M12 8c0-3-1.5-4-3-4M12 8c0-3 1.5-4 3-4M9 11c-3 0-4 1.5-4 3M15 11c3 0 4 1.5 4 3M12 14v6" />
    </svg>
  );
}

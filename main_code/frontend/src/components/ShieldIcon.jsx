/**
 * ShieldIcon — animated shield SVG used in the header.
 */
export default function ShieldIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        d="M32 4L8 16v16c0 14.4 10.24 27.84 24 32 13.76-4.16 24-17.6 24-32V16L32 4z"
        fill="url(#shieldGrad)"
        opacity="0.9"
      />
      <path
        d="M28 34l-6-6 2.83-2.83L28 28.34l11.17-11.17L42 20 28 34z"
        fill="white"
      />
    </svg>
  );
}

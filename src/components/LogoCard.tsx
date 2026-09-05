/* The bakery's logo card, drawn in the site's own palette so it sits with
   the rest of the page. Pass `src` to swap in the real artwork instead. */

interface LogoCardProps {
  src?: string;
  className?: string;
}

export function LogoCard({ src, className = "" }: LogoCardProps) {
  if (src) {
    return (
      <div className={`logo-card ${className}`.trim()}>
        <img className="logo-card__img" src={src} alt="Bakesbymom — eggless custom cakes" />
      </div>
    );
  }

  return (
    <div className={`logo-card ${className}`.trim()}>
      <svg viewBox="0 0 420 300" role="img" aria-label="Bakesbymom — eggless custom cakes, established by Monica">
        <defs>
          <pattern id="logoStripes" width="84" height="300" patternUnits="userSpaceOnUse">
            <rect width="42" height="300" fill="#9e1134" />
            <rect x="42" width="42" height="300" fill="#bf152f" />
          </pattern>
          {/* upper half-circle, drawn left to right */}
          <path id="logoArcTop" d="M210,180 m-142,0 a142,142 0 0,1 284,0" />
          {/* lower half-circle, drawn left to right under the wordmark */}
          <path id="logoArcBottom" d="M210,150 m-120,0 a120,120 0 0,0 240,0" />
        </defs>

        <rect width="420" height="300" fill="url(#logoStripes)" />

        {/* tulip */}
        <g stroke="#f9eec1" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M210,40 c-10,5 -13,14 -9,22 c2,5 6,8 9,12 c3,-4 7,-7 9,-12 c4,-8 1,-17 -9,-22z" />
          <path d="M210,74 v26" />
          <path d="M210,96 c-9,-2 -14,-8 -15,-15 c8,0 13,5 15,15z" />
          <path d="M210,96 c9,-2 14,-8 15,-15 c-8,0 -13,5 -15,15z" />
        </g>

        <text className="logo-card__arc" fill="#f9eec1" textAnchor="middle">
          <textPath href="#logoArcTop" startOffset="30%">EST. BY</textPath>
        </text>
        <text className="logo-card__arc" fill="#f9eec1" textAnchor="middle">
          <textPath href="#logoArcTop" startOffset="70%">MONICA</textPath>
        </text>

        <text className="logo-card__word" x="210" y="182" textAnchor="middle" fill="#f9eec1">
          bakesbymom
        </text>

        <text className="logo-card__arc" fill="#f9eec1" textAnchor="middle">
          <textPath href="#logoArcBottom" startOffset="50%">EGGLESS CUSTOM CAKES</textPath>
        </text>

        <g fill="#f9eec1">
          <rect x="24" y="278" width="16" height="16" rx="4.6" fill="none" stroke="#f9eec1" strokeWidth="1.6" />
          <circle cx="32" cy="286" r="4" fill="none" stroke="#f9eec1" strokeWidth="1.6" />
          <text className="logo-card__meta" x="48" y="291">@BAKESBYMOM</text>
          <circle cx="292" cy="286" r="8" fill="none" stroke="#f9eec1" strokeWidth="1.6" />
          <path d="M288.5,282.5 c0,5.5 3.5,9 8.5,8.5 l-0.8,-2.6 -2.6,-0.9 -1,0.9 c-1.6,-0.9 -2.6,-1.9 -3.4,-3.4 l0.9,-1 -0.9,-2.6z" />
          <text className="logo-card__meta" x="308" y="291">7206552667</text>
        </g>
      </svg>
    </div>
  );
}

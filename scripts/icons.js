import React from "react";

/**
 * Generic Icon component wrapper for SVG icons.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The SVG path elements.
 * @param {number} [props.size=24] - The width and height of the icon.
 * @param {string} [props.className=""] - Additional CSS classes.
 */
const Icon = ({ children, size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

/**
 * The main logo component for the Spin Wheel application.
 *
 * @param {Object} props - Component props.
 * @param {number} [props.size=24] - The size of the logo.
 * @param {string} [props.className] - Additional CSS classes.
 */
const SpinWheelLogo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={props.size || 24}
    height={props.size || 24}
    className={props.className}
    fill="none"
    {...props}
  >
    <circle cx="256" cy="256" r="256" fill="#4f46e5" />
    <path d="M256 256 256 0 A256 256 0 0 1 477.7 128 Z" fill="#fbbf24" />
    <path d="M256 256 477.7 128 A256 256 0 0 1 477.7 384 Z" fill="#ec4899" />
    <path d="M256 256 477.7 384 A256 256 0 0 1 256 512 Z" fill="#10b981" />
    <path d="M256 256 256 512 A256 256 0 0 1 34.3 384 Z" fill="#3b82f6" />
    <path d="M256 256 34.3 384 A256 256 0 0 1 34.3 128 Z" fill="#8b5cf6" />
    <path d="M256 256 34.3 128 A256 256 0 0 1 256 0 Z" fill="#ef4444" />
    <circle cx="256" cy="256" r="40" fill="#fff" />
  </svg>
);

const SpinCoinLogo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    aria-labelledby="scFlex"
    width={props.size || 24}
    height={props.size || 24}
    className={props.className}
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <title id="scFlex">SpinCoin - Responsive</title>

    <circle cx="8" cy="8" r="7" fill="#FFB84D" stroke="#D1892C" strokeWidth="1" />
    <circle cx="8" cy="8" r="4" fill="none" stroke="#FFDFA6" strokeWidth="1" />

    <text
      x="8"
      y="10"
      fontFamily="Inter, Arial, sans-serif"
      fontSize="7"
      fontWeight="700"
      textAnchor="middle"
      fill="#B35E00"
      style={{ fill: "#B35E00" }} /* Forces color to persist against CSS overrides */
    >
      S
    </text>
  </svg>
);

const SettingsIcon = (props) => (
  <Icon {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

const SlidersIcon = (props) => (
  <Icon {...props}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </Icon>
);

const Volume2Icon = (props) => (
  <Icon {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </Icon>
);

const VolumeXIcon = (props) => (
  <Icon {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </Icon>
);

const ShuffleIcon = (props) => (
  <Icon {...props}>
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </Icon>
);

const Trash2Icon = (props) => (
  <Icon {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </Icon>
);

const TrophyIcon = (props) => (
  <Icon {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </Icon>
);

const SunIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </Icon>
);

const MoonIcon = (props) => (
  <Icon {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Icon>
);

const MonitorIcon = (props) => (
  <Icon {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </Icon>
);

const CheckIcon = (props) => (
  <Icon {...props}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

const ChevronDownIcon = (props) => (
  <Icon {...props}>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);

const GithubIcon = (props) => (
  <Icon {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </Icon>
);

const ShareIcon = (props) => (
  <Icon {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Icon>
);

const CopyIcon = (props) => (
  <Icon {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Icon>
);

const ClockIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

const EyeIcon = (props) => (
  <Icon {...props}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

const EyeOffIcon = (props) => (
  <Icon {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </Icon>
);

const ZapIcon = (props) => (
  <Icon {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Icon>
);

const HourglassIcon = (props) => (
  <Icon {...props}>
    <path d="M5 22h14" />
    <path d="M5 2h14" />
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </Icon>
);

const CodeIcon = (props) => (
  <Icon {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </Icon>
);

const ScrollIcon = (props) => (
  <Icon {...props}>
    <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 15 11" />
    <line x1="7" y1="10" x2="11" y2="10" />
    <line x1="7" y1="14" x2="13" y2="14" />
  </Icon>
);

const HelpCircleIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </Icon>
);

const SparklesIcon = (props) => (
  <Icon {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </Icon>
);

const BotIcon = (props) => (
  <Icon {...props}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </Icon>
);

const KeyIcon = (props) => (
  <Icon {...props}>
    <path d="m21 2-2 2m-7.6 7.6a6.5 6.5 0 1 1-2.8-2.8c.7.7 1.2 1.2 1.8 1.8 1.2 1.2 2.2 2.2 2.9 2.9.7.7 1.3 1.3 2 2l2.4-2.4c-.7-.7-1.3-1.3-2-2l-2.4 2.4-2-2" />
    <circle cx="7.5" cy="7.5" r="2.5" />
  </Icon>
);

const PaletteIcon = (props) => (
  <Icon {...props}>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </Icon>
);

const PlusIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Icon>
);

const DownloadIcon = (props) => (
  <Icon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Icon>
);

const TrendingUpIcon = (props) => (
  <Icon {...props}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </Icon>
);

const CloseIcon = (props) => (
  <Icon {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

const CirclePlusIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </Icon>
);

const TrailIcon = (props) => (
  <Icon {...props}>
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </Icon>
);

const MusicIcon = (props) => (
  <Icon {...props}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </Icon>
);

const ElectricIcon = (props) => (
  <Icon {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </Icon>
);

const WoodIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2l6 7H6z" />
    <path d="M12 7l7 8H5z" />
    <path d="M12 13l6 7H6z" />
    <path d="M11 20v4h2v-4" />
  </Icon>
);

const MechanicalIcon = (props) => (
  <Icon {...props}>
    <path d="M5 4h14v3H5z" />
    <path d="M12 7v10" />
    <path d="M5 17h14v3H5z" />
    <path d="M12 12l6 2" />
    <path d="M18 11l1.5-.5" />
    <path d="M18 13l1.5.5" />
    <path d="M17 12l1.2 1.2" />
  </Icon>
);

const CrystalGlassIcon = (props) => (
  <Icon {...props}>
    <path d="M7 3h10" />
    <path d="M8 3c0 4.5 2 9 4 9s4-4.5 4-9" />
    <path d="M12 12v6" />
    <path d="M8 21h8" />
    <path d="M11 15h2" />
  </Icon>
);

const AlertTriangleIcon = (props) => (
  <Icon {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

const SkullIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2c-4.4 0-8 3.6-8 8 0 2.8 1.5 5.3 3.8 6.7.3.2.5.5.5.9v1.9c0 .8.7 1.5 1.5 1.5h4.4c.8 0 1.5-.7 1.5-1.5v-1.9c0-.4.2-.7.5-.9 2.3-1.4 3.8-3.9 3.8-6.7 0-4.4-3.6-8-8-8z" />
    <path d="M9 12h.01" />
    <path d="M15 12h.01" />
    <path d="M10 21v-2" />
    <path d="M14 21v-2" />
  </Icon>
);

const MaleIcon = (props) => (
  <Icon {...props}>
    <circle cx="10" cy="10" r="7" />
    <line x1="21" y1="3" x2="15" y2="9" />
    <polyline points="16 3 21 3 21 8" />
  </Icon>
);

const FemaleIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="10" r="7" />
    <line x1="12" y1="17" x2="12" y2="23" />
    <line x1="9" y1="20" x2="15" y2="20" />
  </Icon>
);

const SwordsIcon = (props) => (
  <Icon {...props}>
    {/* First sword - bottom-left to top-right */}
    <path d="M20 4l-2 2" />
    <path d="M18 6l-8 8" />
    <path d="M10 14l-2 2" />
    <path d="M7 17l-3 3" />
    <path d="M6 16h2v2" />

    {/* Second sword - top-left to bottom-right */}
    <path d="M4 4l2 2" />
    <path d="M6 6l8 8" />
    <path d="M14 14l2 2" />
    <path d="M17 17l3 3" />
    <path d="M16 18v-2h2" />
  </Icon>
);

const ShoppingBagIcon = (props) => (
  <Icon {...props}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);

const StarIcon = (props) => (
  <Icon {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Icon>
);

// Store Package Icons
const SeedlingIcon = (props) => (
  <Icon {...props}>
    <path d="M12 22v-8" />
    <path d="M12 14C9.2 14 7 11.8 7 9s2.2-5 5-5c1.7 0 3.2.9 4.1 2.3" />
    <path d="M12 14c2.8 0 5-2.2 5-5s-2.2-5-5-5c-1.7 0-3.2.9-4.1 2.3" />
  </Icon>
);

const BoltIcon = (props) => (
  <Icon {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Icon>
);

const FlameIcon = (props) => (
  <Icon {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Icon>
);

const GemIcon = (props) => (
  <Icon {...props}>
    <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
    <path d="M11 3 9 9 12 22 15 9 13 3" />
    <path d="M2 9h20" />
  </Icon>
);

const CrownIcon = (props) => (
  <Icon {...props}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M2 16h20" />
  </Icon>
);

// Main Action Icons
const PlayIcon = ({ gradientStops, ...props }) => {
  const gradId = "play-icon-heat-gradient";
  const hasGradient = gradientStops && gradientStops.length > 0;

  return (
    <Icon {...props}>
      {hasGradient && (
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops.map((stop, i) => (
              <stop key={i} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <polygon
        points="5 3 19 12 5 21 5 3"
        stroke={hasGradient ? `url(#${gradId})` : "currentColor"}
        fill={hasGradient ? `url(#${gradId})` : "none"}
      />
    </Icon>
  );
};

const StopIcon = (props) => (
  <Icon {...props}>
    <rect x="6" y="6" width="12" height="12" />
  </Icon>
);

// Expose to window (needed for Babel Standalone)
window.Icon = Icon;
window.SpinWheelLogo = SpinWheelLogo;
window.SpinCoinLogo = SpinCoinLogo;
window.SettingsIcon = SettingsIcon;
window.SlidersIcon = SlidersIcon;
window.Volume2Icon = Volume2Icon;
window.VolumeXIcon = VolumeXIcon;
window.ShuffleIcon = ShuffleIcon;
window.Trash2Icon = Trash2Icon;
window.TrophyIcon = TrophyIcon;
window.SunIcon = SunIcon;
window.MoonIcon = MoonIcon;
window.MonitorIcon = MonitorIcon;
window.CheckIcon = CheckIcon;
window.ChevronDownIcon = ChevronDownIcon;
window.GithubIcon = GithubIcon;
window.ShareIcon = ShareIcon;
window.CopyIcon = CopyIcon;
window.ClockIcon = ClockIcon;
window.EyeIcon = EyeIcon;
window.EyeOffIcon = EyeOffIcon;
window.ZapIcon = ZapIcon;
window.HourglassIcon = HourglassIcon;
window.CodeIcon = CodeIcon;
window.ScrollIcon = ScrollIcon;
window.HelpCircleIcon = HelpCircleIcon;
window.SparklesIcon = SparklesIcon;
window.BotIcon = BotIcon;
window.KeyIcon = KeyIcon;
window.PaletteIcon = PaletteIcon;
window.PlusIcon = PlusIcon;
window.DownloadIcon = DownloadIcon;
window.TrendingUpIcon = TrendingUpIcon;
window.CloseIcon = CloseIcon;
window.CirclePlusIcon = CirclePlusIcon;
window.TrailIcon = TrailIcon;
window.MusicIcon = MusicIcon;
window.ElectricIcon = ElectricIcon;
window.WoodIcon = WoodIcon;
window.MechanicalIcon = MechanicalIcon;
window.CrystalGlassIcon = CrystalGlassIcon;
window.AlertTriangleIcon = AlertTriangleIcon;
window.SkullIcon = SkullIcon;
window.MaleIcon = MaleIcon;
window.FemaleIcon = FemaleIcon;
window.SwordsIcon = SwordsIcon;
window.ShoppingBagIcon = ShoppingBagIcon;
window.StarIcon = StarIcon;
window.SeedlingIcon = SeedlingIcon;
window.BoltIcon = BoltIcon;
window.FlameIcon = FlameIcon;
window.GemIcon = GemIcon;
window.CrownIcon = CrownIcon;
window.PlayIcon = PlayIcon;
window.StopIcon = StopIcon;

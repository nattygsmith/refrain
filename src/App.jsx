import { useState, useEffect, useCallback } from "react";

// ============================================================
//  DEV MODE
//  Set to true to show time/season override dropdowns in the UI.
//  Set to false before pushing to GitHub.
// ============================================================
const DEV_MODE = true;

// ============================================================
//  QUOTE LIBRARY
//  To add quotes: append objects to this array.
//  Required fields:
//    text     — the quote, use \n for line breaks
//    source   — credit string shown to user e.g. "Tam Lin (Child 39)"
//    time     — one or more of: "morning" | "afternoon" | "evening" | "night"
//    season   — one or more of: "spring" | "summer" | "autumn" | "winter"
//               use [] for quotes that work in any season
//  Optional:
//    notes    — modernization notes (not shown in UI, for your records)
// ============================================================
const QUOTES = [
  // --- Child 1: Riddles Wisely Expounded ---
  {
    text: "He knocked at the lady's gate,\nOne evening when it was late.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["evening"],
    season: [],
  },
  {
    text: "The youngest sister, fair and bright,\nShe lay beside him all through the night.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["night"],
    season: [],
  },
  {
    text: "And in the morning, come the day,\nShe said, 'Young man, will you marry me?'",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["morning"],
    season: [],
  },
  // --- Child 4: Lady Isabel and the Elf-Knight ---
  {
    text: "Fair lady Isabel sits in her bower sewing,\nThere she heard an elf-knight blowing his horn,\nThe first morning in May.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["morning"],
    season: ["spring"],
  },
  {
    text: "They rode till they came to the sweet water side,\nThree hours before it was day.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["night"],
    season: [],
  },
  // --- Child 26: The Three Ravens ---
  {
    text: "The one of them said to his mate,\n'Where shall we our breakfast take?'",
    source: "The Three Ravens (Child 26)",
    time: ["morning"],
    season: [],
  },
  {
    text: "She buried him before the prime,\nShe died herself ere evening time.",
    source: "The Three Ravens (Child 26)",
    time: ["evening"],
    season: [],
  },
  // --- Child 35: Allison Gross ---
  {
    text: "But as it fell out on last Halloween,\nWhen the fairy court was riding by,\nThe queen lighted down on a daisy bank,\nNot far from the tree where I used to lie.",
    source: "Allison Gross (Child 35)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  // --- Child 39: Tam Lin ---
  {
    text: "Gloomy, gloomy was the night,\nAnd eerie was the way,\nAs fair Jenny in her green mantle\nTo Miles Cross she did go.",
    source: "Tam Lin (Child 39)",
    time: ["night"],
    season: ["autumn"],
  },
  {
    text: "Just at the mirk and midnight hour,\nThe fairy folk will ride,\nAnd they that would their true-love win,\nAt Miles Cross they must bide.",
    source: "Tam Lin (Child 39)",
    time: ["night"],
    season: ["autumn"],
  },
  {
    text: "Tomorrow is Halloween,\nThe elfin court will ride,\nThrough England, and through all Scotland,\nAnd through the world wide.",
    source: "Tam Lin (Child 39)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  {
    text: "O they begin at sky-setting,\nRide all the evening tide;\nAnd she that will her true-love borrow,\nAt Miles Cross will him bide.",
    source: "Tam Lin (Child 39)",
    time: ["evening"],
    season: ["autumn"],
  },
  // --- Child 43: The Broomfield Hill ---
  {
    text: "The ane gaed early in the morning,\nThe other in the afternoon.",
    source: "The Broomfield Hill (Child 43)",
    time: ["afternoon"],
    season: [],
  },
  {
    text: "She pulled the blossom of the broom,\nThe blossom it smells sweet.",
    source: "The Broomfield Hill (Child 43)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  // --- Child 58: Sir Patrick Spens ---
  {
    text: "Late late last night I saw the new moon,\nWith the old moon in her arm;\nAnd I fear, I fear, my dear master,\nThat we will come to harm.",
    source: "Sir Patrick Spens (Child 58)",
    time: ["night"],
    season: ["winter"],
  },
  // --- Child 73: Lord Thomas and Annet ---
  {
    text: "Sweet Willie and Fair Annie,\nAs they sat on yonder hill,\nIf they had sat from morn 'til evening,\nThey had not talked their fill.",
    source: "Lord Thomas and Annet (Child 73)",
    time: ["evening"],
    season: [],
  },
  // --- Child 74: Fair Margaret and Sweet William ---
  {
    text: "As it fell out on a long summer's day,\nTwo lovers they sat on a hill;\nThey sat together that long summer's day,\nAnd could not talk their fill.",
    source: "Fair Margaret and Sweet William (Child 74)",
    time: ["afternoon"],
    season: ["summer"],
  },
  // --- Child 76: The Lass of Roch Royal ---
  {
    text: "Fair Isabell of Rochroyall,\nShe dreamed where she lay,\nShe dreamed a dream of her love Gregory,\nA little before the day.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: [],
  },
  {
    text: "The night was dark, and the wind blew cold,\nAnd her love was fast asleep,\nAnd the bairn that was in her two arms\nFull sore began to weep.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: ["winter"],
  },
  // --- Child 78: The Unquiet Grave ---
  {
    text: "The wind does blow today, my love,\nAnd a few small drops of rain;\nI never had but one true-love,\nIn a cold grave she was lain.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn", "winter"],
  },
  {
    text: "'Tis down in yonder garden green,\nLove, where we used to walk,\nThe finest flower that e'er was seen\nIs withered to a stalk.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  // --- Child 79: The Wife of Usher's Well ---
  {
    text: "It fell about the Martinmas,\nWhen nights are long and mirk.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["night"],
    season: ["winter"],
  },
  {
    text: "The hallow day of Yule are come,\nThe nights are long and dark.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["night"],
    season: ["winter"],
  },
  {
    text: "The young cock crew in the merry morning,\nAnd the wild fowl chirped for day;\nThe elder to the younger did say,\nDear brother, we must away.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["morning"],
    season: [],
  },
  // --- Child 81: Little Musgrave and Lady Barnard ---
  {
    text: "When supper was over, and mass was sung,\nAnd every man bound for bed,\nLittle Musgrave and that lady\nIn one chamber were laid.",
    source: "Little Musgrave and Lady Barnard (Child 81)",
    time: ["evening"],
    season: [],
  },
  // --- Child 84: Bonny Barbara Allan ---
  {
    text: "It was in and about the Martinmas time,\nWhen the green leaves were a-falling.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  {
    text: "All in the merry month of May,\nWhen green leaves they were springing,\nThis young man on his death-bed lay,\nFor the love of Barbara Allen.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  {
    text: "It fell about the Lammas time,\nWhen the woods grow green and yellow.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  // --- Child 100: Willie o Winsbury ---
  {
    text: "He's mounted her on a milk-white steed,\nHimself on a dapple-grey,\nAnd made her a lady of as much land\nShe could ride in a whole summer day.",
    source: "Willie o Winsbury (Child 100)",
    time: ["morning", "afternoon"],
    season: ["summer"],
  },
  // --- Child 113: The Great Silkie of Sule Skerry ---
  {
    text: "Then one arose at her bed-foot,\nA grumbly guest I'm sure was he.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["night"],
    season: [],
  },
  {
    text: "And it shall come to pass on a summer's day,\nWhen the sun shines hot on every stone.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning", "afternoon"],
    season: ["summer"],
  },
  {
    text: "And he'll go out on a May morning,\nAnd he'll kill both my wee son and me.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning"],
    season: ["spring"],
  },
  // --- Child 114: Johnie Cock ---
  {
    text: "Johnie rose up in a May morning,\nCalled for water to wash his hands,\nAnd he has called for his good gray hounds,\nThat lay bound in iron bands.",
    source: "Johnie Cock (Child 114)",
    time: ["morning"],
    season: ["spring"],
  },
  // --- Child 167: Sir Andrew Barton ---
  {
    text: "As it befell in midsummer-time,\nWhen birds sing sweetly on every tree.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning"],
    season: ["summer"],
  },
  {
    text: "When Flora, with her fragrant flowers,\nBedecked the earth so trim and gay,\nAnd Neptune, with his dainty showers,\nCame to present the month of May.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  {
    text: "Lord Howard then, of courage bold,\nWent to the sea with pleasant cheer,\nNot curbed with winter's piercing cold,\nThough it was the stormy time of the year.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["winter"],
  },
  {
    text: "With pikes, and guns, and bowmen bold,\nThis noble Howard is gone to the sea,\nOn the day before Midsummer's Eve,\nAnd out at Thames mouth sailed they.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["evening"],
    season: ["summer"],
  },
  // --- Child 173: Mary Hamilton ---
  {
    text: "Last night Queen Mary had four Maries,\nThis night she'll have but three;\nThere was Mary Seaton and Mary Beaton,\nAnd Mary Carmichael, and me.",
    source: "Mary Hamilton (Child 173)",
    time: ["night"],
    season: [],
  },
  {
    text: "Last night I washed Queen Mary's feet,\nAnd bore her to her bed;\nThis day she's given me my reward,\nThis gallows-tree to tread.",
    source: "Mary Hamilton (Child 173)",
    time: ["morning", "afternoon"],
    season: [],
  },
  // --- Child 193: The Death of Parcy Reed ---
  {
    text: "They hunted high, they hunted low,\nThey hunted up, they hunted down,\nUntil the day was past the prime,\nAnd it grew late in the afternoon.",
    source: "The Death of Parcy Reed (Child 193)",
    time: ["afternoon"],
    season: [],
  },
];

// ============================================================
//  HELPERS
// ============================================================
function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function getSeason(month) {
  // Meteorological seasons, Northern Hemisphere, 0-indexed month
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

function getPool(timeOfDay, season) {
  // Match on time first; season is a bonus filter if matches exist
  const timeMatch = QUOTES.filter((q) => q.time.includes(timeOfDay));
  const seasonMatch = timeMatch.filter(
    (q) => q.season.length === 0 || q.season.includes(season)
  );
  // Prefer season-aware matches; fall back to time-only if pool is too small
  return seasonMatch.length >= 2 ? seasonMatch : timeMatch;
}

function pickQuote(pool, lastId) {
  if (pool.length === 0) return null;
  const candidates = pool.length > 1 ? pool.filter((q) => q !== lastId) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ============================================================
//  THEME TOKENS  (time × season)
// ============================================================
const THEMES = {
  morning: {
    spring: { bg: "#f0ebe0", ink: "#2c2416", accent: "#7a9e5f", mist: "#d4e8c2" },
    summer: { bg: "#fdf3d0", ink: "#2c2416", accent: "#c07b2a", mist: "#fae89a" },
    autumn: { bg: "#f5e6cc", ink: "#2c2416", accent: "#b5541e", mist: "#e8c998" },
    winter: { bg: "#eaf0f5", ink: "#1a2530", accent: "#4a7a9b", mist: "#c8dde8" },
  },
  afternoon: {
    spring: { bg: "#e8f0dc", ink: "#1e2d14", accent: "#5a8a3a", mist: "#c5dba8" },
    summer: { bg: "#fef0b0", ink: "#2a2010", accent: "#c88a20", mist: "#fad870" },
    autumn: { bg: "#f0dcc0", ink: "#2a1e10", accent: "#a04a18", mist: "#ddb880" },
    winter: { bg: "#dde8f0", ink: "#182230", accent: "#3a6888", mist: "#b0cede" },
  },
  evening: {
    spring: { bg: "#2a3520", ink: "#e8f0d8", accent: "#90c060", mist: "#405030" },
    summer: { bg: "#302818", ink: "#f8e8c0", accent: "#e0a040", mist: "#504028" },
    autumn: { bg: "#2e2010", ink: "#f0d8b0", accent: "#d06820", mist: "#503020" },
    winter: { bg: "#181e28", ink: "#c8d8e8", accent: "#6090b8", mist: "#283040" },
  },
  night: {
    spring: { bg: "#121c10", ink: "#d0e8c0", accent: "#70a850", mist: "#1e2e18" },
    summer: { bg: "#181408", ink: "#f0e0a0", accent: "#c89030", mist: "#282010" },
    autumn: { bg: "#140e08", ink: "#e8c890", accent: "#b06020", mist: "#221408" },
    winter: { bg: "#080c14", ink: "#b0c8e0", accent: "#4878a8", mist: "#101828" },
  },
};

const TIME_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

const SEASON_LABELS = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

// Decorative glyphs per time of day
const TIME_GLYPHS = {
  morning: "☀",
  afternoon: "◑",
  evening: "☽",
  night: "✦",
};

// ============================================================
//  COMPONENT
// ============================================================
export default function FolkClock() {
  const [now, setNow] = useState(new Date());
  const [quote, setQuote] = useState(null);
  const [lastQuote, setLastQuote] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [devTime, setDevTime] = useState(getTimeOfDay(new Date().getHours()));
  const [devSeason, setDevSeason] = useState(getSeason(new Date().getMonth()));

  const hour = now.getHours();
  const month = now.getMonth();
  const timeOfDay = DEV_MODE ? devTime : getTimeOfDay(hour);
  const season = DEV_MODE ? devSeason : getSeason(month);
  const theme = THEMES[timeOfDay][season];
  const pool = getPool(timeOfDay, season);

  const refresh = useCallback(
    (currentLastQuote) => {
      const next = pickQuote(pool, currentLastQuote);
      if (next) {
        setQuote(next);
        setLastQuote(next);
        setFadeKey((k) => k + 1);
      }
    },
    [pool]
  );

  // Initial pick
  useEffect(() => {
    refresh(null);
  }, []);

  // Auto-refresh at top of each hour
  useEffect(() => {
    const next = new Date(now);
    next.setHours(next.getHours() + 1, 0, 0, 0);
    const ms = next - now;
    const t = setTimeout(() => {
      setNow(new Date());
    }, ms);
    return () => clearTimeout(t);
  }, [now]);

  // Re-pick when time slot changes
  useEffect(() => {
    if (quote) refresh(null);
  }, [timeOfDay, season]);

  if (!quote) return null;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: ${theme.bg};
      transition: background 1.2s ease;
    }

    .folk-root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 1.75rem 1.5rem;
      font-family: 'IM Fell English', Georgia, serif;
      color: ${theme.ink};
      position: relative;
      overflow: hidden;
      transition: color 1.2s ease;
    }

    .folk-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 20%, ${theme.mist}88 0%, transparent 60%),
        radial-gradient(ellipse at 80% 80%, ${theme.mist}55 0%, transparent 55%);
      pointer-events: none;
      transition: background 1.2s ease;
    }

    .folk-root::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      background-size: 200px 200px;
      pointer-events: none;
      opacity: 0.6;
    }

    /* Header: pinned top */
    .header {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      flex-shrink: 0;
      padding-bottom: 1rem;
    }

    .time-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      opacity: 0.7;
      text-transform: uppercase;
    }

    .glyph { font-size: 1rem; }

    .info-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: ${theme.ink};
      opacity: 0.5;
      padding: 0.25rem 0.5rem;
      text-transform: uppercase;
      transition: opacity 0.2s;
    }
    .info-btn:hover { opacity: 1; }

    /* Ornamental rule */
    .rule {
      position: relative;
      z-index: 1;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      opacity: 0.3;
      flex-shrink: 0;
    }
    .rule-line {
      flex: 1;
      height: 1px;
      background: ${theme.ink};
    }
    .rule-diamond {
      width: 5px;
      height: 5px;
      background: ${theme.accent};
      transform: rotate(45deg);
      flex-shrink: 0;
      transition: background 1.2s ease;
    }

    /* Quote: vertically centered in remaining space */
    .quote-section {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 560px;
      margin: 0 auto;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .quote-wrap {
      animation: fadeUp 0.7s ease forwards;
      text-align: center;
      width: 100%;
    }

    blockquote {
      font-size: clamp(1.05rem, 3.5vw, 1.35rem);
      line-height: 1.85;
      font-style: italic;
      color: ${theme.ink};
      transition: color 1.2s ease;
    }

    .attribution {
      margin-top: 1.1rem;
      font-size: 0.78rem;
      font-family: 'IM Fell English SC', serif;
      letter-spacing: 0.08em;
      opacity: 0.6;
      font-style: normal;
    }

    /* Footer: pinned bottom */
    .footer {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      flex-shrink: 0;
      padding-top: 1rem;
    }

    .btn-another {
      background: none;
      border: 1px solid ${theme.accent};
      color: ${theme.accent};
      font-family: 'IM Fell English SC', serif;
      font-size: 0.78rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 0.5rem 1.4rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .btn-another:hover {
      background: ${theme.accent};
      color: ${theme.bg};
    }

    .pool-note {
      font-size: 0.68rem;
      opacity: 0.4;
      font-family: 'IM Fell English SC', serif;
      letter-spacing: 0.08em;
    }

    /* Info overlay */
    .overlay {
      position: fixed;
      inset: 0;
      background: ${theme.bg}ee;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      animation: fadeUp 0.4s ease;
    }

    .info-box {
      max-width: 440px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .info-title {
      font-family: 'IM Fell English SC', serif;
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      color: ${theme.accent};
    }

    .info-body {
      font-size: 0.9rem;
      line-height: 1.8;
      opacity: 0.85;
      font-style: italic;
    }

    .info-body p + p { margin-top: 0.75rem; }

    .info-close {
      background: none;
      border: 1px solid ${theme.accent};
      color: ${theme.accent};
      font-family: 'IM Fell English SC', serif;
      font-size: 0.78rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 0.5rem 1.4rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      align-self: center;
    }
    .info-close:hover {
      background: ${theme.accent};
      color: ${theme.bg};
    }

    /* Dev toggle */
    .dev-bar {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 20;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      background: ${theme.bg};
      border: 1px solid ${theme.accent};
      padding: 0.4rem 0.75rem;
      opacity: 0.7;
    }
    .dev-bar:hover { opacity: 1; }
    .dev-bar label {
      font-family: 'IM Fell English SC', serif;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: ${theme.ink};
      text-transform: uppercase;
    }
    .dev-bar select {
      background: none;
      border: none;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: ${theme.accent};
      cursor: pointer;
      text-transform: uppercase;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="folk-root">

        {/* Header */}
        <div className="header">
          <div className="time-badge">
            <span className="glyph">{TIME_GLYPHS[timeOfDay]}</span>
            {TIME_LABELS[timeOfDay]} · {SEASON_LABELS[season]}
          </div>
          <button className="info-btn" onClick={() => setShowInfo(true)}>
            About
          </button>
        </div>

        {/* Top rule */}
        <div className="rule">
          <div className="rule-line" />
          <div className="rule-diamond" />
          <div className="rule-line" />
        </div>

        {/* Quote: centered in flex space */}
        <div className="quote-section">
          <div key={fadeKey} className="quote-wrap">
            <blockquote>
              {quote.text.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < quote.text.split("\n").length - 1 && <br />}
                </span>
              ))}
            </blockquote>
            <p className="attribution">— {quote.source}</p>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="rule">
          <div className="rule-line" />
          <div className="rule-diamond" />
          <div className="rule-line" />
        </div>

        {/* Footer */}
        <div className="footer">
          <button className="btn-another" onClick={() => refresh(lastQuote)}>
            Another
          </button>
          <p className="pool-note">
            {pool.length} verse{pool.length !== 1 ? "s" : ""} for this {timeOfDay}
          </p>
        </div>

        {/* Info overlay */}
        {showInfo && (
          <div className="overlay" onClick={() => setShowInfo(false)}>
            <div className="info-box" onClick={(e) => e.stopPropagation()}>
              <div className="info-title">About This Collection</div>
              <div className="info-body">
                <p>
                  These verses are drawn from the Child Ballads—305 traditional English
                  and Scottish folk songs collected by Francis James Child between
                  1882 and 1898. They are among the oldest surviving songs in the
                  English language.
                </p>
                <p>
                  Each verse is chosen to match the time of day and season where you are.
                  The words have been lightly modernised where needed.
                </p>
                <p>
                  A new verse appears every hour, or tap <em>Another</em> whenever you like.
                </p>
              </div>
              <button className="info-close" onClick={() => setShowInfo(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Dev toggle — remove DEV_MODE flag before deploying */}
        {DEV_MODE && (
          <div className="dev-bar">
            <label>Time</label>
            <select value={devTime} onChange={(e) => { setDevTime(e.target.value); setFadeKey((k) => k + 1); }}>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
            <label>Season</label>
            <select value={devSeason} onChange={(e) => { setDevSeason(e.target.value); setFadeKey((k) => k + 1); }}>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        )}

      </div>
    </>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./AppStyles.css";
import { TIME_GLYPHS, TIME_LABELS, SEASON_LABELS } from "./constants.js";
import { LYRICS } from "./lyrics.js";
import { QUOTES } from "./quotes.js";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useQuoteClock } from "./useQuoteClock.js";
import LyricsScreen from "./LyricsScreen.jsx";
import AboutPage from "./AboutPage.jsx";
import PrivacyPage from "./PrivacyPage.jsx";

// ============================================================
//  Refrain — main view
// ============================================================
function Refrain() {
  const navigate = useNavigate();
  const {
    timeOfDay,
    season,
    theme,
    quote,
    pool,
    refresh,
    lastQuote,
    devTime,
    setDevTime,
    devSeason,
    setDevSeason,
    adminOpen,
    setAdminOpen,
  } = useQuoteClock();

  const [showLyrics, setShowLyrics] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [pinnedQuote, setPinnedQuote] = useState(null);
  const [devSearch, setDevSearch] = useState("");
  const longPressTimer = useRef(null);

  const handleBadgePressStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setAdminOpen(prev => !prev);
    }, 600);
  }, [setAdminOpen]);

  const handleBadgePressEnd = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  // Apply theme tokens as CSS custom properties on the root element
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--rf-bg", theme.bg);
    root.style.setProperty("--rf-ink", theme.ink);
    root.style.setProperty("--rf-accent", theme.accent);
    root.style.setProperty("--rf-mist", theme.mist);
  }, [theme]);

  // Ensure viewport-fit=cover so iOS respects safe-area-inset env() vars
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && !meta.content.includes("viewport-fit")) {
      meta.content += ", viewport-fit=cover";
    }
  }, []);

  // Keyboard nav: Escape closes overlays
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setShowLyrics(false);
        setPinnedQuote(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Open lyrics and pin the current quote so a 15-min auto-refresh can't swap it
  const handleOpenLyrics = () => {
    setPinnedQuote(displayQuote);
    setShowLyrics(true);
  };

  // Close lyrics and release the pin (normal rotation resumes)
  const handleCloseLyrics = () => {
    setShowLyrics(false);
    setPinnedQuote(null);
  };

  // Trigger fade animation and clear pinned quote on manual refresh
  const handleRefresh = () => {
    refresh(lastQuote);
    setFadeKey((k) => k + 1);
    setShowLyrics(false);
    setPinnedQuote(null);
    setDevSearch("");
  };

  if (!quote) return null;

  const displayQuote = pinnedQuote || quote;

  const devSearchResults =
    adminOpen && devSearch.trim().length >= 2
      ? QUOTES.filter(
          (q) =>
            q.source.toLowerCase().includes(devSearch.toLowerCase()) ||
            q.text.toLowerCase().includes(devSearch.toLowerCase())
        ).slice(0, 8)
      : [];

  return (
    <div className="folk-root">

      {/* Header */}
      <div className="header">
        <div
          className={`time-badge${adminOpen ? " time-badge--admin" : ""}`}
          onMouseDown={handleBadgePressStart}
          onMouseUp={handleBadgePressEnd}
          onMouseLeave={handleBadgePressEnd}
          onTouchStart={handleBadgePressStart}
          onTouchEnd={handleBadgePressEnd}
          style={{ userSelect: "none", cursor: "default" }}
        >
          <span className="glyph">{TIME_GLYPHS[timeOfDay]}</span>
          {TIME_LABELS[timeOfDay]} · {SEASON_LABELS[season]}
        </div>
        <button className="info-btn" onClick={() => navigate("/about")}>
          About
        </button>
      </div>

      {/* Top rule */}
      <div className="rule">
        <div className="rule-line" />
        <div className="rule-diamond" />
        <div className="rule-line" />
      </div>

      {/* Quote */}
      <div className="quote-section">
        <div key={fadeKey} className="quote-wrap">
          <blockquote>
            {displayQuote.text.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < displayQuote.text.split("\n").length - 1 && <br />}
              </span>
            ))}
          </blockquote>
          <p className="attribution">
            {displayQuote.lyricsKey && LYRICS[displayQuote.lyricsKey] ? (
              <button
                className="attribution-link"
                onClick={handleOpenLyrics}
              >
                — {displayQuote.source}
              </button>
            ) : (
              <>— {displayQuote.source}</>
            )}
          </p>
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
        <button className="btn-another" onClick={handleRefresh}>
          Another
        </button>
        <p className="pool-note">
          {pool.length} verse{pool.length !== 1 ? "s" : ""} for this {timeOfDay}
        </p>
      </div>

      {/* Lyrics overlay */}
      {showLyrics && displayQuote.lyricsKey && LYRICS[displayQuote.lyricsKey] && (
        <LyricsScreen
          entry={LYRICS[displayQuote.lyricsKey]}
          stanzaIndex={displayQuote.stanzaIndex}
          onClose={handleCloseLyrics}
        />
      )}

      {/* Admin panel — activated by long-pressing the time/season badge */}
      {adminOpen && (
        <div className="dev-bar">
          <div className="dev-bar-row">
            <label>Time</label>
            <select
              value={devTime}
              onChange={(e) => {
                setDevTime(e.target.value);
                setFadeKey((k) => k + 1);
              }}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
            <label>Season</label>
            <select
              value={devSeason}
              onChange={(e) => {
                setDevSeason(e.target.value);
                setFadeKey((k) => k + 1);
              }}
            >
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </div>
          <div className="dev-search-row">
            <label>Find</label>
            <input
              className="dev-search-input"
              type="text"
              value={devSearch}
              onChange={(e) => {
                setDevSearch(e.target.value);
                setPinnedQuote(null);
                setShowLyrics(false);
              }}
              placeholder="source or text…"
              spellCheck={false}
            />
            {pinnedQuote && (
              <button
                className="dev-pin-clear"
                onClick={() => {
                  setPinnedQuote(null);
                  setDevSearch("");
                  setShowLyrics(false);
                }}
              >
                ✕
              </button>
            )}
          </div>
          {devSearchResults.length > 0 && (
            <div className="dev-results">
              {devSearchResults.map((q, i) => (
                <button
                  key={i}
                  className="dev-result-item"
                  onClick={() => {
                    setPinnedQuote(q);
                    setFadeKey((k) => k + 1);
                    setShowLyrics(false);
                    setDevSearch(q.source);
                  }}
                >
                  <span className="dev-result-source">{q.source}</span>
                  <span className="dev-result-preview">
                    {q.text.split("\n")[0]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// ============================================================
//  App — root component with routing
// ============================================================
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Refrain />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Routes>
  );
}

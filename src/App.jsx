import React, { useState, useEffect } from "react";
import "./AppStyles.css";
import { DEV_MODE } from "./config.js";
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
  } = useQuoteClock();

  const [showLyrics, setShowLyrics] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [devSearch, setDevSearch] = useState("");
  const [pinnedQuote, setPinnedQuote] = useState(null);

  // Apply theme tokens as CSS custom properties on the root element
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--rf-bg", theme.bg);
    root.style.setProperty("--rf-ink", theme.ink);
    root.style.setProperty("--rf-accent", theme.accent);
    root.style.setProperty("--rf-mist", theme.mist);
  }, [theme]);

  const activeQuote = pinnedQuote || quote;

  // Trigger fade animation on quote change
  useEffect(() => {
    setFadeKey(k => k + 1);
  }, [activeQuote]);

  const handleAnother = () => {
    setPinnedQuote(null);
    refresh();
  };

  const lyricsEntry = activeQuote?.lyricsKey ? LYRICS[activeQuote.lyricsKey] : null;

  // Dev search results
  const devResults = DEV_MODE && devSearch.length > 1
    ? QUOTES.filter(q =>
        q.source.toLowerCase().includes(devSearch.toLowerCase()) ||
        q.text.toLowerCase().includes(devSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <div className="folk-root">

      {/* Header */}
      <div className="header">
        <div className="time-badge">
          <span className="glyph">{TIME_GLYPHS[timeOfDay]}</span>
          <span>{TIME_LABELS[timeOfDay]} · {SEASON_LABELS[season]}</span>
        </div>
        <button className="info-btn" onClick={() => navigate("/about")}>
          About
        </button>
      </div>

      {/* Ornamental rule */}
      <div className="rule">
        <div className="rule-line" />
        <div className="rule-diamond" />
        <div className="rule-line" />
      </div>

      {/* Quote display */}
      <div className="quote-area">
        {activeQuote && (
          <div key={fadeKey} className="quote-fade">
            <blockquote className="folk-quote">
              {activeQuote.text.split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </blockquote>
            <div className="folk-source">— {activeQuote.source}</div>
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="footer">
        <div className="footer-row">
          <button className="folk-btn" onClick={handleAnother}>
            Another
          </button>
          {lyricsEntry && (
            <button className="folk-btn folk-btn--secondary" onClick={() => setShowLyrics(true)}>
              Full Song
            </button>
          )}
        </div>
        {DEV_MODE && (
          <div className="dev-bar">
            <div className="dev-bar-row">
              <label>Time</label>
              <select value={devTime || ""} onChange={e => setDevTime(e.target.value || null)}>
                <option value="">Auto</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
              <label>Season</label>
              <select value={devSeason || ""} onChange={e => setDevSeason(e.target.value || null)}>
                <option value="">Auto</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="autumn">Autumn</option>
                <option value="winter">Winter</option>
              </select>
            </div>
            <div className="dev-search-row">
              <label>Pin</label>
              <input
                className="dev-search-input"
                placeholder="search quotes…"
                value={devSearch}
                onChange={e => setDevSearch(e.target.value)}
              />
              {pinnedQuote && (
                <button className="dev-pin-clear" onClick={() => { setPinnedQuote(null); setDevSearch(""); }}>
                  ✕ unpin
                </button>
              )}
            </div>
            {devResults.length > 0 && (
              <div className="dev-results">
                {devResults.map(q => (
                  <button
                    key={q.source + q.text.slice(0, 20)}
                    className="dev-result-item"
                    onClick={() => {
                      setPinnedQuote(q);
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

      {/* Lyrics overlay */}
      {showLyrics && lyricsEntry && (
        <LyricsScreen
          entry={lyricsEntry}
          stanzaIndex={activeQuote?.stanzaIndex}
          onClose={() => setShowLyrics(false)}
        />
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

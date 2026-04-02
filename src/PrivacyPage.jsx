import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuoteClock } from "./useQuoteClock.js";

export default function PrivacyPage() {
  const navigate = useNavigate();
  const { theme } = useQuoteClock();
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Apply theme tokens so the background matches the main view
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--rf-bg", theme.bg);
    root.style.setProperty("--rf-ink", theme.ink);
    root.style.setProperty("--rf-accent", theme.accent);
    root.style.setProperty("--rf-mist", theme.mist);
  }, [theme]);

  // Show shadow on back bar once user scrolls
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 4);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="overlay">

      {/* Sticky back bar */}
      <div className={`about-back-bar${scrolled ? " about-back-bar--scrolled" : ""}`}>
        <button className="about-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Scrollable body */}
      <div className="overlay-body" ref={scrollRef}>
        <div className="overlay-body-inner">

          <div className="about-hero">
            <div className="about-hero-title">Privacy Policy</div>
          </div>

          <div className="lyrics-rule">
            <div className="rule-line" />
            <div className="rule-diamond" />
            <div className="rule-line" />
          </div>

          <div className="info-body">
            <p>
              Refrain does not collect, store, or share any personal data.
            </p>
            <p>
              The app has no user accounts, no analytics, no advertising, and
              makes no network requests except to load the app itself. Your
              device's time and location (used only to determine the current
              season) are never transmitted anywhere.
            </p>
            <p>
              The website refrainapp.com is hosted on{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="about-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel
              </a>
              , which may collect standard server logs (IP address, browser
              type, pages visited) as part of normal web hosting. Refrain itself
              does not access or store any of this data.
            </p>
            <p>
              This policy applies to both the Refrain website and the Refrain
              iOS app. It may be updated occasionally; any changes will be
              reflected on this page.
            </p>
          </div>

          <div className="about-links-section">
            <div className="lyrics-rule">
              <div className="rule-line" />
              <div className="rule-diamond" />
              <div className="rule-line" />
            </div>
            <p className="about-contact">
              Questions?{" "}
              <a href="mailto:support@refrainapp.com" className="about-link">
                support@refrainapp.com
              </a>
            </p>
          </div>

        </div>{/* overlay-body-inner */}
      </div>
    </div>
  );
}

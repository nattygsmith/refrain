import SwiftUI

// MARK: - Theme

/// A set of four colours for a given time-of-day × season combination.
/// Mirrors the THEMES object in constants.js exactly.
struct Theme {
    let bg: Color
    let ink: Color
    let accent: Color
    let mist: Color
    init(bg: String, ink: String, accent: String, mist: String) {
        self.bg = Color(bg)
        self.ink = Color(ink)
        self.accent = Color(accent)
        self.mist = Color(mist)
    }}

// MARK: - Theme lookup

extension Theme {
    /// Returns the theme for the given time and season.
    static func current(time: TimeOfDay, season: Season) -> Theme {
        themes[time]?[season] ?? themes[.morning]![.spring]!
    }

    // Full 16-theme table — values match constants.js exactly.
    private static let themes: [TimeOfDay: [Season: Theme]] = [
        .morning: [
            .spring: Theme(bg: "#f0ebe0", ink: "#2c2416", accent: "#577144", mist: "#d4e8c2"),
            .summer: Theme(bg: "#fdf3d0", ink: "#2c2416", accent: "#9b6322", mist: "#fae89a"),
            .autumn: Theme(bg: "#f5e6cc", ink: "#2c2416", accent: "#a84e1b", mist: "#e8c998"),
            .winter: Theme(bg: "#eaf0f5", ink: "#1a2530", accent: "#447190", mist: "#c8dde8"),
        ],
        .afternoon: [
            .spring: Theme(bg: "#e8f0dc", ink: "#1e2d14", accent: "#4d7631", mist: "#c5dba8"),
            .summer: Theme(bg: "#fef0b0", ink: "#2a2010", accent: "#926417", mist: "#fad870"),
            .autumn: Theme(bg: "#f0dcc0", ink: "#2a1e10", accent: "#a04a18", mist: "#ddb880"),
            .winter: Theme(bg: "#dde8f0", ink: "#182230", accent: "#3a6888", mist: "#b0cede"),
        ],
        .evening: [
            .spring: Theme(bg: "#2a3520", ink: "#e8f0d8", accent: "#90c060", mist: "#405030"),
            .summer: Theme(bg: "#302818", ink: "#f8e8c0", accent: "#e0a040", mist: "#504028"),
            .autumn: Theme(bg: "#2e2010", ink: "#f0d8b0", accent: "#d56d25", mist: "#503020"),
            .winter: Theme(bg: "#181e28", ink: "#c8d8e8", accent: "#6090b8", mist: "#283040"),
        ],
        .night: [
            .spring: Theme(bg: "#121c10", ink: "#d0e8c0", accent: "#70a850", mist: "#1e2e18"),
            .summer: Theme(bg: "#181408", ink: "#f0e0a0", accent: "#c89030", mist: "#282010"),
            .autumn: Theme(bg: "#140e08", ink: "#e8c890", accent: "#b76727", mist: "#221408"),
            .winter: Theme(bg: "#080c14", ink: "#b0c8e0", accent: "#4d7dad", mist: "#101828"),
        ],
    ]
}

// MARK: - Hex colour initialiser

/// Allows Color to be initialised directly from a hex string, e.g. Color("#f0ebe0").
/// Supports 6-character RGB hex strings with or without a leading #.
extension Color {
    init(_ hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        let value = UInt64(hex, radix: 16) ?? 0
        let r = Double((value >> 16) & 0xFF) / 255
        let g = Double((value >>  8) & 0xFF) / 255
        let b = Double((value >>  0) & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}

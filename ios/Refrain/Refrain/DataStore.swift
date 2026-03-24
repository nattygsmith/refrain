import Foundation

// MARK: - DataStore

/// Loads and holds all quotes and lyrics from the bundled JSON files.
/// Shared across the main app and (via App Group) the widget.
///
/// Usage:
///   let store = DataStore.shared
///   let pool  = store.quotes(for: .morning, season: .spring)
@MainActor
final class DataStore {
    static let shared = DataStore()

    private(set) var quotes: [Quote] = []
    private(set) var lyrics: [String: LyricsEntry] = [:]

    private init() {
        quotes = loadQuotes()
        lyrics = loadLyrics()
    }

    // MARK: - Query

    /// Returns all quotes that match the given time slot.
    /// Quotes with an empty `season` array match any season.
    /// Quotes with a non-empty `season` array only match if the current season is listed.
    func quotes(for time: TimeOfDay, season: Season) -> [Quote] {
        quotes.filter { quote in
            quote.time.contains(time) &&
            (quote.season.isEmpty || quote.season.contains(season))
        }
    }

    /// Returns the LyricsEntry for a given key, if one exists.
    func lyrics(for key: String) -> LyricsEntry? {
        lyrics[key]
    }

    // MARK: - Loading

    private func loadQuotes() -> [Quote] {
        guard let url = Bundle.main.url(forResource: "quotes", withExtension: "json") else {
            assertionFailure("quotes.json not found in app bundle")
            return []
        }
        do {
            let data = try Data(contentsOf: url)
            var loaded = try JSONDecoder().decode([Quote].self, from: data)
            // Assign stable IDs from array position
            for i in loaded.indices { loaded[i].id = i }
            return loaded
        } catch {
            assertionFailure("Failed to decode quotes.json: \(error)")
            return []
        }
    }

    private func loadLyrics() -> [String: LyricsEntry] {
        guard let url = Bundle.main.url(forResource: "lyrics", withExtension: "json") else {
            assertionFailure("lyrics.json not found in app bundle")
            return [:]
        }
        do {
            let data = try Data(contentsOf: url)
            return try JSONDecoder().decode([String: LyricsEntry].self, from: data)
        } catch {
            assertionFailure("Failed to decode lyrics.json: \(error)")
            return [:]
        }
    }
}

import Foundation

// MARK: - WidgetDataStore

/// A lightweight data store for the widget extension.
/// Functionally identical to DataStore but without @MainActor,
/// since the widget timeline provider runs on a background thread.
///
/// The widget bundle must have quotes.json and lyrics.json added
/// to its own target membership in Xcode — widgets run in a
/// separate process and cannot access the main app's bundle.
final class WidgetDataStore {
    static let shared = WidgetDataStore()

    private(set) var quotes: [Quote] = []
    private(set) var lyrics: [String: LyricsEntry] = [:]

    private init() {
        quotes = loadQuotes()
        lyrics = loadLyrics()
    }

    // MARK: - Query

    func quotes(for time: TimeOfDay, season: Season) -> [Quote] {
        quotes.filter { quote in
            quote.time.contains(time) &&
            (quote.season.isEmpty || quote.season.contains(season))
        }
    }

    // MARK: - Loading

    private func loadQuotes() -> [Quote] {
        guard let url = Bundle.main.url(forResource: "quotes", withExtension: "json") else {
            return []
        }
        guard let data = try? Data(contentsOf: url),
              var loaded = try? JSONDecoder().decode([Quote].self, from: data)
        else { return [] }
        for i in loaded.indices { loaded[i].id = i }
        return loaded
    }

    private func loadLyrics() -> [String: LyricsEntry] {
        guard let url = Bundle.main.url(forResource: "lyrics", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let loaded = try? JSONDecoder().decode([String: LyricsEntry].self, from: data)
        else { return [:] }
        return loaded
    }
}

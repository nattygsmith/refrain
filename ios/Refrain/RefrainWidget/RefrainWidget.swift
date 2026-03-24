import WidgetKit
import SwiftUI

// MARK: - Timeline Entry

struct RefrainEntry: TimelineEntry {
    let date: Date
    let quote: Quote
    let timeOfDay: TimeOfDay
    let season: Season
    let theme: Theme
}

// MARK: - Timeline Provider

/// Generates a timeline of entries, one per 15-minute slot.
/// Each entry picks a verse appropriate to its time and season.
struct RefrainProvider: TimelineProvider {

    // Placeholder shown in the widget gallery before real data loads
    func placeholder(in context: Context) -> RefrainEntry {
        makeEntry(for: Date())
    }

    // Snapshot shown when the user is adding the widget
    func getSnapshot(in context: Context, completion: @escaping (RefrainEntry) -> Void) {
        completion(makeEntry(for: Date()))
    }

    // Full timeline: one entry per 15-minute boundary for the next 6 hours
    func getTimeline(in context: Context, completion: @escaping (Timeline<RefrainEntry>) -> Void) {
        let now = Date()
        let interval: TimeInterval = 15 * 60
        let count = 24 // 6 hours of entries

        // Align to the current 15-minute boundary
        let referenceTime = Date.timeIntervalSinceReferenceDate
        let currentBoundary = (referenceTime / interval).rounded(.down) * interval
        let startDate = Date(timeIntervalSinceReferenceDate: currentBoundary)

        var entries: [RefrainEntry] = []
        var lastQuoteID: Int? = nil

        for i in 0..<count {
            let entryDate = startDate.addingTimeInterval(Double(i) * interval)
            var entry = makeEntry(for: entryDate, excluding: lastQuoteID)
            lastQuoteID = entry.quote.id
            entries.append(entry)
        }

        // Refresh after the last entry expires
        let refreshDate = startDate.addingTimeInterval(Double(count) * interval)
        let timeline = Timeline(entries: entries, policy: .after(refreshDate))
        completion(timeline)
    }

    // MARK: - Entry construction

    private func makeEntry(for date: Date, excluding lastID: Int? = nil) -> RefrainEntry {
        let timeOfDay = TimeOfDay.from(date: date)
        let season = Season.from(date: date)
        let theme = Theme.current(time: timeOfDay, season: season)

        let store = WidgetDataStore.shared
        let pool = store.quotes(for: timeOfDay, season: season)
        let candidates = lastID == nil ? pool : pool.filter { $0.id != lastID }
        let quote = (candidates.isEmpty ? pool : candidates).randomElement()
            ?? Quote.placeholder

        return RefrainEntry(
            date: date,
            quote: quote,
            timeOfDay: timeOfDay,
            season: season,
            theme: theme
        )
    }
}

// MARK: - Widget View

struct RefrainWidgetView: View {
    let entry: RefrainEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            // Background
            entry.theme.bg
                .ignoresSafeArea()

            RadialGradient(
                colors: [entry.theme.mist.opacity(0.55), entry.theme.bg.opacity(0)],
                center: .init(x: 0.5, y: 0.4),
                startRadius: 0,
                endRadius: family == .systemLarge ? 260 : 180
            )
            .ignoresSafeArea()

            VStack(alignment: .center, spacing: 0) {

                // Time · Season label
                Text("\(entry.timeOfDay.rawValue) · \(entry.season.rawValue)")
                    .font(.system(size: 10, weight: .regular))
                    .foregroundStyle(entry.theme.ink.opacity(0.5))
                    .padding(.top, family == .systemLarge ? 20 : 14)

                Spacer()

                // Verse text
                Text(entry.quote.text)
                    .font(.custom("IMFellEnglish-Regular", size: family == .systemLarge ? 18 : 14))
                    .foregroundStyle(entry.theme.ink)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
                    .padding(.horizontal, family == .systemLarge ? 24 : 16)

                Spacer()

                // Attribution
                Text("— \(entry.quote.source)")
                    .font(.custom("IMFellEnglish-Italic", size: family == .systemLarge ? 12 : 10))
                    .foregroundStyle(entry.theme.ink.opacity(0.45))
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .padding(.horizontal, family == .systemLarge ? 24 : 16)
                    .padding(.bottom, family == .systemLarge ? 20 : 14)
            }
        }
        // Tapping the widget opens the app; if the quote has lyrics,
        // deep-link directly to the lyrics screen for that verse
        .widgetURL(
            entry.quote.lyricsKey.map {
                URL(string: "refrain://lyrics/\($0)")!
            }
        )
    }
}

// MARK: - Widget configuration

struct RefrainWidget: Widget {
    let kind: String = "RefrainWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: RefrainProvider()) { entry in
            RefrainWidgetView(entry: entry)
        }
        .configurationDisplayName("Refrain")
        .description("A verse from the folk tradition, matched to the time of day.")
        .supportedFamilies([.systemMedium, .systemLarge])
    }
}

// MARK: - Widget bundle

@main
struct RefrainWidgetBundle: WidgetBundle {
    var body: some Widget {
        RefrainWidget()
    }
}

// MARK: - TimeOfDay / Season date-based constructors
// These are needed in the widget because the widget doesn't use QuoteClock —
// it constructs entries directly from Date values in the timeline.

extension TimeOfDay {
    static func from(date: Date) -> TimeOfDay {
        let hour = Calendar.current.component(.hour, from: date)
        switch hour {
        case 5..<12:  return .morning
        case 12..<17: return .afternoon
        case 17..<21: return .evening
        default:      return .night
        }
    }
}

extension Season {
    static func from(date: Date) -> Season {
        let month = Calendar.current.component(.month, from: date)
        switch month {
        case 3...5:  return .spring
        case 6...8:  return .summer
        case 9...11: return .autumn
        default:     return .winter
        }
    }
}

// MARK: - Quote placeholder

extension Quote {
    /// Shown in the widget gallery before real data is available.
    static let placeholder = Quote(
        id: -1,
        text: "The water is wide,\nI cannot get o'er.",
        source: "The Water is Wide (Child 204)",
        time: [],
        season: [],
        lyricsKey: nil,
        stanzaIndex: nil
    )
}

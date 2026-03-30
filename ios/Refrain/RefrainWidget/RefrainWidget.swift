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
        let interval: TimeInterval = 15 * 60
        let count = 24 // 6 hours of entries

        // Align to the current 15-minute boundary
        let currentBoundary = (Date.timeIntervalSinceReferenceDate / interval).rounded(.down) * interval
        let startDate = Date(timeIntervalSinceReferenceDate: currentBoundary)

        var entries: [RefrainEntry] = []
        var lastQuoteID: Int?

        for i in 0..<count {
            let entryDate = startDate.addingTimeInterval(Double(i) * interval)
            let entry = makeEntry(for: entryDate, excluding: lastQuoteID)
            lastQuoteID = entry.quote.id
            entries.append(entry)
        }

        // Refresh after the last entry expires
        let refreshDate = startDate.addingTimeInterval(Double(count) * interval)
        completion(Timeline(entries: entries, policy: .after(refreshDate)))
    }

    // MARK: - Entry construction

    private func makeEntry(for date: Date, excluding lastID: Int? = nil) -> RefrainEntry {
        let timeOfDay = TimeOfDay.from(date: date)
        let season = Season.from(date: date)
        let theme = Theme.current(time: timeOfDay, season: season)

        let pool = WidgetDataStore.shared.quotes(for: timeOfDay, season: season)
        let candidates = lastID == nil ? pool : pool.filter { $0.id != lastID }
        let quote = (candidates.isEmpty ? pool : candidates).randomElement()
            ?? Quote.placeholder

        return RefrainEntry(date: date, quote: quote, timeOfDay: timeOfDay, season: season, theme: theme)
    }
}

// MARK: - Widget View

struct RefrainWidgetView: View {
    let entry: RefrainEntry
    @Environment(\.widgetFamily) var family

    // Layout constants by size
    private var isLarge: Bool        { family == .systemLarge }
    private var verseSize:       CGFloat { isLarge ? 18 : 13 }
    private var attributionSize: CGFloat { isLarge ? 12 : 8 }
    private var edgePadding:     CGFloat { isLarge ? 24 : 16 }
    private var capPadding:      CGFloat { isLarge ? 20 : 14 }
    private var gradientRadius:  CGFloat { isLarge ? 260 : 180 }
    private var verseLineSpacing:   CGFloat { isLarge ? 6 : 2 }
    private var verseAttrSpacing:   CGFloat { isLarge ? 24 : 4 }

    var body: some View {
        VStack(alignment: .center, spacing: 0) {

            // Time · Season label — pinned to top
            Text("\(entry.timeOfDay.rawValue.uppercased()) · \(entry.season.rawValue.uppercased())")
                .font(.custom("IM_FELL_English_Roman", size: 10))
                .foregroundStyle(entry.theme.ink.opacity(0.65))
                .padding(.top, 6)
                .padding(.bottom, 2)

            // Verse + attribution centred in remaining space
            Spacer(minLength: 0)

            VStack(spacing: verseAttrSpacing) {
                Text(entry.quote.text)
                    .font(.custom("IM_FELL_English_Roman", size: verseSize))
                    .foregroundStyle(entry.theme.ink)
                    .multilineTextAlignment(.center)
                    .lineSpacing(verseLineSpacing)
                    .lineLimit(isLarge ? 4 : nil)
                    .minimumScaleFactor(isLarge ? 0.4 : 1.0)
                    .padding(.horizontal, edgePadding)

                Text("— \(entry.quote.source.uppercased())")
                    .font(.custom("IM_FELL_English_Roman", size: attributionSize))
                    .foregroundStyle(entry.theme.ink.opacity(0.75))
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .padding(.horizontal, edgePadding)
            }

            Spacer()
        }
        // containerBackground fills the entire widget surface (required iOS 17+)
        .containerBackground(for: .widget) {
            entry.theme.bg
            RadialGradient(
                colors: [entry.theme.mist.opacity(0.55), entry.theme.bg.opacity(0)],
                center: .init(x: 0.5, y: 0.4),
                startRadius: 0,
                endRadius: gradientRadius
            )
        }
        // Tapping the widget opens the app; if the quote has lyrics,
        // deep-link directly to the lyrics screen for that verse.
        // URL format: refrain://lyrics/{key}/{stanzaIndex}/{quoteID}
        .widgetURL({
            guard let key = entry.quote.lyricsKey else { return nil }
            let stanza = entry.quote.stanzaIndex.map { String($0) } ?? "nil"
            return URL(string: "refrain://lyrics/\(key)/\(stanza)/\(entry.quote.id)")
        }())
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

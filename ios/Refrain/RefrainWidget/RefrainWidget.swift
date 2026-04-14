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

    func placeholder(in context: Context) -> RefrainEntry {
        makeEntry(for: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (RefrainEntry) -> Void) {
        completion(makeEntry(for: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<RefrainEntry>) -> Void) {
        let interval: TimeInterval = 15 * 60
        let count = 24

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

        let refreshDate = startDate.addingTimeInterval(Double(count) * interval)
        completion(Timeline(entries: entries, policy: .after(refreshDate)))
    }

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

    // MARK: Layout constants by size

    private var isExtraLarge: Bool { family == .systemExtraLarge }
    private var isLarge:      Bool { family == .systemLarge }

    private var verseSize: CGFloat {
        switch family {
        case .systemExtraLarge: return 22
        case .systemLarge:      return 20
        default:                return 20
        }
    }

    private var tagSize: CGFloat {
        switch family {
        case .systemExtraLarge: return 11
        case .systemLarge:      return 10
        default:                return 8
        }
    }

    private var edgePadding: CGFloat {
        switch family {
        case .systemExtraLarge: return 40
        case .systemLarge:      return 24
        default:                return 16
        }
    }

    private var verseLineSpacing: CGFloat { isExtraLarge || isLarge ? 6 : 2 }

    private var gradientRadius: CGFloat {
        switch family {
        case .systemExtraLarge: return 420
        case .systemLarge:      return 260
        default:                return 180
        }
    }

    // MARK: - Body

    var body: some View {
        VStack(spacing: 0) {

            // Time · Season label — pinned to top
            Text("\(entry.timeOfDay.rawValue.uppercased()) · \(entry.season.rawValue.uppercased())")
                .font(.custom("IM_FELL_English_Roman", size: tagSize))
                .foregroundStyle(entry.theme.ink.opacity(0.65))

            // Quote — expands to fill all available space between label and attribution
            Text(entry.quote.text)
                .font(.custom("IM_FELL_English_Roman", size: verseSize))
                .foregroundStyle(entry.theme.ink)
                .multilineTextAlignment(.center)
                .lineSpacing(verseLineSpacing)
                .minimumScaleFactor(0.4)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(.horizontal, edgePadding)

            // Attribution — same size as label, truncates with ellipsis
            Text("— \(entry.quote.source.uppercased())")
                .font(.custom("IM_FELL_English_Roman", size: tagSize))
                .foregroundStyle(entry.theme.ink.opacity(0.65))
                .lineLimit(1)
                .truncationMode(.tail)
                .padding(.horizontal, edgePadding)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .containerBackground(for: .widget) {
            entry.theme.bg
            RadialGradient(
                colors: [entry.theme.mist.opacity(0.55), entry.theme.bg.opacity(0)],
                center: .init(x: 0.5, y: 0.4),
                startRadius: 0,
                endRadius: gradientRadius
            )
        }
        .widgetURL(URL(string: "refrain://quote/\(entry.quote.id)"))
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
        .supportedFamilies([.systemMedium, .systemLarge, .systemExtraLarge])
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

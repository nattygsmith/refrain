import Foundation
import Observation

// MARK: - QuoteClock

/// Tracks the current time of day and season, maintains the active quote pool,
/// and handles both manual refresh ("Another") and automatic 15-minute rotation.
///
/// Equivalent to useQuoteClock.js in the web app.
///
/// Usage in a SwiftUI view:
///   @State private var clock = QuoteClock()
///   Text(clock.quote?.text ?? "")
@MainActor
@Observable
final class QuoteClock {

    // MARK: - Published state

    private(set) var timeOfDay: TimeOfDay = .morning
    private(set) var season: Season = .spring
    private(set) var quote: Quote? = nil
    private(set) var pool: [Quote] = []

    // MARK: - Private state

    private var lastQuoteID: Int? = nil
    private var timer: Timer? = nil
    private let store: DataStore

    // MARK: - Init

    @MainActor
    init(store: DataStore = .shared) {
        self.store = store
        refresh(updateTimeSeason: true)
        scheduleTimer()
    }

    @MainActor
    func cleanup() {
        timer?.invalidate()
    }

    // MARK: - Public interface

    /// Navigate directly to a specific quote by ID.
    /// Used when the app is opened from a widget deep link.
    func navigate(to id: Int) {
        if let target = pool.first(where: { $0.id == id }) {
            quote = target
        }
    }

    /// Advance to a new random quote. Avoids repeating the last quote shown.
    /// Call this when the user taps "Another".
    func next() {
        lastQuoteID = quote?.id
        quote = pickQuote(from: pool, excluding: lastQuoteID)
    }

    // MARK: - Internal

    /// Full refresh: optionally re-evaluate time/season, rebuild pool, pick quote.
    /// Called on init, on timer tick, and (time/season only) when app foregrounds.
    private func refresh(updateTimeSeason: Bool) {
        if updateTimeSeason {
            let newTime   = TimeOfDay.current
            let newSeason = Season.current

            // If the time slot has changed, clear lastQuoteID so we don't
            // accidentally exclude a quote from the new pool.
            if newTime != timeOfDay || newSeason != season {
                lastQuoteID = nil
            }

            timeOfDay = newTime
            season    = newSeason
        }

        pool  = store.quotes(for: timeOfDay, season: season)
        quote = pickQuote(from: pool, excluding: lastQuoteID)
    }

    /// Pick a random quote from the pool, avoiding the last one shown if possible.
    private func pickQuote(from pool: [Quote], excluding lastID: Int?) -> Quote? {
        guard !pool.isEmpty else { return nil }
        let candidates = pool.filter { $0.id != lastID }
        // If the pool has only one quote, show it even if it was the last one.
        return (candidates.isEmpty ? pool : candidates).randomElement()
    }

    // MARK: - Timer

    /// Schedules a repeating timer that fires every 15 minutes, aligned to the
    /// clock (i.e. fires at :00, :15, :30, :45) rather than 15 minutes from now.
    private func scheduleTimer() {
        timer?.invalidate()

        let interval: TimeInterval = 15 * 60
        let now = Date()
        // Calculate seconds until the next 15-minute boundary
        let secondsIntoInterval = now.timeIntervalSinceReferenceDate
            .truncatingRemainder(dividingBy: interval)
        let fireDelay = interval - secondsIntoInterval

        // Fire once at the next boundary, then repeat every 15 minutes
        timer = Timer.scheduledTimer(
            withTimeInterval: fireDelay,
            repeats: false
        ) { [weak self] _ in
            Task { @MainActor [weak self] in
                self?.refresh(updateTimeSeason: true)
                self?.scheduleTimer() // reschedule for next boundary
            }
        }
    }
}

// MARK: - App lifecycle integration

extension QuoteClock {
    /// Call this when the app returns to the foreground.
    /// Re-evaluates time and season in case the slot changed while backgrounded.
    func appDidBecomeActive() {
        refresh(updateTimeSeason: true)
    }
}

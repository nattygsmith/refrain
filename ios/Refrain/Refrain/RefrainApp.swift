import SwiftUI

// MARK: - RefrainApp

@main
struct RefrainApp: App {
    // Set when the app is opened from a widget tap
    @State private var pendingLyricsKey: String?
    @State private var pendingStanzaIndex: Int?
    @State private var pendingQuoteID: Int?
    @State private var pendingTrigger: Int = 0

    var body: some Scene {
        WindowGroup {
            ContentView(
                pendingLyricsKey:   $pendingLyricsKey,
                pendingStanzaIndex: $pendingStanzaIndex,
                pendingQuoteID:     $pendingQuoteID,
                pendingTrigger:     $pendingTrigger
            )
            .onOpenURL { url in
                // Handle deep links from widget taps.
                // URL format: refrain://lyrics/{key}/{stanzaIndex}/{quoteID}
                guard url.scheme == "refrain",
                      url.host == "lyrics"
                else { return }
                let parts = url.pathComponents.dropFirst()
                pendingLyricsKey   = parts.first
                pendingStanzaIndex = parts.dropFirst().first.flatMap { $0 == "nil" ? nil : Int($0) }
                pendingQuoteID     = parts.dropFirst(2).first.flatMap { Int($0) }
                pendingTrigger    += 1
            }
        }
    }
}

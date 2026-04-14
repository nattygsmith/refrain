import SwiftUI

// MARK: - RefrainApp

@main
struct RefrainApp: App {
    // Set when the app is opened from a widget tap
    @State private var pendingQuoteID: Int?
    @State private var pendingTrigger: Int = 0

    var body: some Scene {
        WindowGroup {
            ContentView(
                pendingQuoteID: $pendingQuoteID,
                pendingTrigger: $pendingTrigger
            )
            .onOpenURL { url in
                // Handle deep links from widget taps.
                // URL format: refrain://quote/{quoteID}
                guard url.scheme == "refrain",
                      url.host == "quote",
                      let idString = url.pathComponents.dropFirst().first,
                      let quoteID = Int(idString)
                else { return }
                pendingQuoteID  = quoteID
                pendingTrigger += 1
            }
        }
    }
}

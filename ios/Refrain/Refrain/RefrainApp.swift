import SwiftUI

// MARK: - RefrainApp

@main
struct RefrainApp: App {
    // The lyrics key to open on launch, if the app was opened from a widget tap
    @State private var pendingLyricsKey: String? = nil

    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    // Handle deep links from widget taps.
                    // URL scheme: refrain://lyrics/{lyricsKey}
                    guard url.scheme == "refrain",
                          url.host == "lyrics"
                    else { return }
                    let key = url.pathComponents.dropFirst().first
                    pendingLyricsKey = key
                }
        }
    }
}

import SwiftUI

// MARK: - ContentView

struct ContentView: View {
    @Binding var pendingLyricsKey: String?
    @Binding var pendingStanzaIndex: Int?
    @Binding var pendingQuoteID: Int?
    @Binding var pendingTrigger: Int
    @State private var clock = QuoteClock()
    @State private var showAbout = false
    @State private var showLyrics = false
    @State private var isReopening = false

    var theme: Theme {
        Theme.current(time: clock.timeOfDay, season: clock.season)
    }

    var body: some View {
        ZStack {
            // ── Background ──────────────────────────────────────────────
            theme.bg
                .ignoresSafeArea()

            // Radial glow — mirrors the web app's mist radials
            RadialGradient(
                colors: [theme.mist.opacity(0.6), theme.bg.opacity(0)],
                center: .init(x: 0.5, y: 0.35),
                startRadius: 0,
                endRadius: 340
            )
            .ignoresSafeArea()

            // ── Main layout ─────────────────────────────────────────────
            VStack(spacing: 0) {

                // Header
                HStack {
                    Label(
                        "\(clock.timeOfDay.rawValue.capitalized) · \(clock.season.rawValue.capitalized)",
                        systemImage: clock.timeOfDay.systemImage
                    )
                    .font(.custom("IM_FELL_English_Roman", size: 11))
                    .textCase(.uppercase)
                    .foregroundStyle(theme.ink.opacity(0.6))

                    Spacer()

                    Button("About") {
                        showAbout = true
                    }
                    .font(.custom("IM_FELL_English_Roman", size: 11))
                    .textCase(.uppercase)
                    .foregroundStyle(theme.accent)
                }
                .padding(.horizontal, 28)
                .padding(.top, 16)

                Divider()
                    .overlay(theme.accent.opacity(0.3))
                    .padding(.horizontal, 28)
                    .padding(.vertical, 10)

                // Quote — fills available space, centred vertically
                Spacer()

                if let quote = clock.quote {
                    VStack(spacing: 12) {
                        Text(quote.text)
                            .font(.custom("IM_FELL_English_Roman", size: 22))
                            .foregroundStyle(theme.ink)
                            .multilineTextAlignment(.center)
                            .lineSpacing(6)
                            .padding(.horizontal, 32)

                        // Attribution — tappable if lyrics exist
                        let hasLyrics = quote.lyricsKey != nil
                        Button {
                            if hasLyrics { showLyrics = true }
                        } label: {
                            Text("— \(quote.source)")
                                .font(.custom("IM_FELL_English_Roman", size: 12))
                                .textCase(.uppercase)
                                .multilineTextAlignment(.center)
                                .foregroundStyle(
                                    hasLyrics
                                        ? theme.accent
                                        : theme.accent.opacity(0.5)
                                )
                                .underline(hasLyrics, color: theme.accent.opacity(0.5))
                                .padding(.horizontal, 48)
                                .padding(.top, 8)
                        }
                        .disabled(!hasLyrics)
                    }
                    // Swipe up anywhere on the quote area to open lyrics
                    .gesture(
                        DragGesture(minimumDistance: 40)
                            .onEnded { value in
                                if value.translation.height < -40,
                                   quote.lyricsKey != nil {
                                    showLyrics = true
                                }
                            }
                    )
                }

                Spacer()

                // Divider + footer
                Divider()
                    .overlay(theme.accent.opacity(0.3))
                    .padding(.horizontal, 28)
                    .padding(.vertical, 10)

                VStack(spacing: 6) {
                    Button("Another") {
                        clock.next()
                    }
                    .font(.custom("IM_FELL_English_Roman", size: 16))
                    .textCase(.uppercase)
                    .foregroundStyle(theme.accent)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(theme.accent.opacity(0.5), lineWidth: 1)
                    )

                    Text("\(clock.pool.count) verse\(clock.pool.count == 1 ? "" : "s") for this \(clock.timeOfDay.rawValue)")
                        .font(.custom("IM_FELL_English_Roman", size: 11))
                        .textCase(.uppercase)
                        .foregroundStyle(theme.ink.opacity(0.65))
                }
                .padding(.bottom, 24)
            }
        }
        // ── Lyrics: partial bottom sheet ────────────────────────────────
        .sheet(isPresented: $showLyrics, onDismiss: {
            if !isReopening {
                pendingLyricsKey   = nil
                pendingStanzaIndex = nil
                pendingQuoteID     = nil
            }
            isReopening = false
        }) {
            // Prefer the deep-linked key if present; fall back to current quote
            let lyricsKey   = pendingLyricsKey   ?? clock.quote?.lyricsKey
            let stanzaIndex = pendingStanzaIndex ?? clock.quote?.stanzaIndex
            if let key = lyricsKey,
               let entry = DataStore.shared.lyrics(for: key) {
                LyricsView(entry: entry, stanzaIndex: stanzaIndex, theme: theme)
                    .presentationDetents([.medium, .large])
                    .presentationDragIndicator(.visible)
                    .presentationBackground(theme.bg)
            }
        }
        // ── About: full-screen cover ────────────────────────────────────
        .fullScreenCover(isPresented: $showAbout) {
            AboutView(theme: theme)
        }
        // ── App lifecycle ───────────────────────────────────────────────
        .onReceive(
            NotificationCenter.default.publisher(
                for: UIApplication.didBecomeActiveNotification
            )
        ) { _ in
            // Short delay lets onOpenURL fire first so pendingQuoteID is set
            // before we check it — widget deep links set pendingQuoteID and
            // handle their own navigation, so we skip refresh in that case.
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                guard pendingQuoteID == nil else { return }
                clock.appDidBecomeActive()
            }
        }
        // Animate theme transitions
        .animation(.easeInOut(duration: 1.2), value: clock.timeOfDay)
        .animation(.easeInOut(duration: 1.2), value: clock.season)
        // Handle deep links from widget taps — navigate to the widget's quote and open lyrics
        .onChange(of: pendingTrigger) { _ in
            guard pendingLyricsKey != nil else { return }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                if let id = pendingQuoteID {
                    clock.navigate(to: id)
                }
                if showLyrics {
                    isReopening = true
                    showLyrics = false
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                        showLyrics = true
                    }
                } else {
                    showLyrics = true
                }
            }
        }
    }
}

// MARK: - TimeOfDay display helpers

extension TimeOfDay {
    // SF Symbols — monochrome, text-rendering variants where available
    var systemImage: String {
        switch self {
        case .morning:   return "sun.max"
        case .afternoon: return "circle.righthalf.filled"
        case .evening:   return "moon"
        case .night:     return "sparkle"
        }
    }
}

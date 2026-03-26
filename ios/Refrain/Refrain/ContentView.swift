import SwiftUI

// MARK: - ContentView

struct ContentView: View {
    @State private var clock = QuoteClock()
    @State private var showAbout = false
    @State private var showLyrics = false

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
                        "\(clock.timeOfDay.label) · \(clock.season.label)",
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
                                .foregroundStyle(
                                    hasLyrics
                                        ? theme.accent
                                        : theme.accent.opacity(0.5)
                                )
                                .underline(hasLyrics, color: theme.accent.opacity(0.5))
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
                        .foregroundStyle(theme.ink.opacity(0.4))
                }
                .padding(.bottom, 24)
            }
        }
        // ── Lyrics: partial bottom sheet ────────────────────────────────
        .sheet(isPresented: $showLyrics) {
            if let quote = clock.quote,
               let key = quote.lyricsKey,
               let entry = DataStore.shared.lyrics(for: key) {
                LyricsView(entry: entry, stanzaIndex: quote.stanzaIndex, theme: theme)
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
            clock.appDidBecomeActive()
        }
        // Animate theme transitions
        .animation(.easeInOut(duration: 1.2), value: clock.timeOfDay)
        .animation(.easeInOut(duration: 1.2), value: clock.season)
    }
}

// MARK: - TimeOfDay display helpers

extension TimeOfDay {
    var label: String {
        switch self {
        case .morning:   return "Morning"
        case .afternoon: return "Afternoon"
        case .evening:   return "Evening"
        case .night:     return "Night"
        }
    }

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

extension Season {
    var label: String {
        switch self {
        case .spring: return "Spring"
        case .summer: return "Summer"
        case .autumn: return "Autumn"
        case .winter: return "Winter"
        }
    }
}

import SwiftUI

// MARK: - LyricsView

/// Partial bottom sheet showing the full lyrics for the current quote's song.
/// The stanza that contains the displayed quote is highlighted.
/// Scrollable — opens scrolled to the highlighted stanza, then free to scroll.
struct LyricsView: View {
    let entry: LyricsEntry
    let stanzaIndex: Int?
    let theme: Theme

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(alignment: .center, spacing: 0) {

                    // ── Header ──────────────────────────────────────────
                    VStack(spacing: 4) {
                        Text(entry.title)
                            .font(.custom("IMFellEnglish-Regular", size: 20))
                            .foregroundStyle(theme.ink)
                            .multilineTextAlignment(.center)

                        if let label = entry.collectionLabel {
                            Text(label)
                                .font(.system(size: 12))
                                .foregroundStyle(theme.ink.opacity(0.45))
                        }

                        Text(entry.version)
                            .font(.system(size: 11))
                            .foregroundStyle(theme.ink.opacity(0.35))
                            .multilineTextAlignment(.center)
                            .padding(.top, 2)
                    }
                    .padding(.top, 28)
                    .padding(.horizontal, 28)
                    .padding(.bottom, 20)

                    Divider()
                        .overlay(theme.accent.opacity(0.25))
                        .padding(.horizontal, 28)

                    // ── Stanzas ─────────────────────────────────────────
                    VStack(spacing: 20) {
                        ForEach(Array(entry.stanzas.enumerated()), id: \.offset) { index, stanza in
                            Text(stanza)
                                .font(.custom("IMFellEnglish-Regular", size: 16))
                                .foregroundStyle(
                                    index == stanzaIndex
                                        ? theme.ink
                                        : theme.ink.opacity(0.55)
                                )
                                .multilineTextAlignment(.center)
                                .lineSpacing(5)
                                .padding(.horizontal, 28)
                                .padding(.vertical, index == stanzaIndex ? 10 : 0)
                                .background(
                                    index == stanzaIndex
                                        ? theme.accent.opacity(0.08)
                                        : Color.clear
                                )
                                .cornerRadius(6)
                                .id(index) // anchor for ScrollViewReader
                        }
                    }
                    .padding(.vertical, 24)

                    // Bottom breathing room for home indicator
                    Spacer(minLength: 40)
                }
            }
            .onAppear {
                // Scroll to the highlighted stanza on open,
                // with a short delay to let the sheet animate in first
                if let index = stanzaIndex {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                        withAnimation {
                            proxy.scrollTo(index, anchor: .center)
                        }
                    }
                }
            }
        }
    }
}

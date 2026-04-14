import SwiftUI

// MARK: - LyricsView

/// Displays the full lyrics for the current quote's song.
/// The stanza containing the displayed quote is highlighted.
///
/// Used in two contexts:
/// - Bottom sheet (iPhone + iPad portrait): standard scrolling column.
/// - Side panel (iPad landscape): same layout, hosted inside ContentView's
///   overlay panel rather than a sheet.
///
/// On iPad, content is capped in width so it doesn't sprawl on wide screens.
struct LyricsView: View {
    let entry: LyricsEntry
    let stanzaIndex: Int?
    let theme: Theme

    private var isPad: Bool { UIDevice.current.userInterfaceIdiom == .pad }

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(alignment: .center, spacing: 0) {

                    // ── Header ───────────────────────────────────────────
                    VStack(spacing: 4) {
                        Text(entry.title)
                            .font(.custom("IM_FELL_English_Roman", size: 20))
                            .foregroundStyle(theme.ink)
                            .multilineTextAlignment(.center)

                        if let label = entry.collectionLabel {
                            Text(label)
                                .font(.system(size: 12))
                                .foregroundStyle(theme.ink.opacity(0.75))
                        }

                        Text(entry.version)
                            .font(.system(size: 11))
                            .foregroundStyle(theme.ink.opacity(0.75))
                            .multilineTextAlignment(.center)
                            .padding(.top, 2)
                    }
                    .padding(.top, 28)
                    .padding(.horizontal, 28)
                    .padding(.bottom, 20)

                    Divider()
                        .overlay(theme.accent.opacity(0.25))
                        .padding(.horizontal, 28)

                    // ── Stanzas ──────────────────────────────────────────
                    VStack(spacing: 20) {
                        ForEach(Array(entry.stanzas.enumerated()), id: \.offset) { index, stanza in
                            Text(stanza)
                                .font(.custom("IM_FELL_English_Roman", size: 16))
                                .foregroundStyle(
                                    index == stanzaIndex
                                        ? theme.ink
                                        : theme.ink.opacity(0.75)
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
                                .id(index)
                        }
                    }
                    .padding(.vertical, 24)
                    // Cap width on iPad so the single column doesn't sprawl
                    .frame(maxWidth: isPad ? 520 : .infinity)
                    .frame(maxWidth: .infinity)

                    Spacer(minLength: 40)
                }
            }
            .onAppear {
                scrollTo(index: stanzaIndex, proxy: proxy, delay: 0.35)
            }
            .onChange(of: stanzaIndex) { _, newIndex in
                scrollTo(index: newIndex, proxy: proxy, delay: 0.1)
            }
            .textSelection(.enabled)
        }
    }

    // MARK: - Helpers

    private func scrollTo(index: Int?, proxy: ScrollViewProxy, delay: Double) {
        guard let index else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
            withAnimation {
                proxy.scrollTo(index, anchor: .center)
            }
        }
    }
}

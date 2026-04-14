import SwiftUI

// MARK: - ContentView

struct ContentView: View {

    // ── Widget deep-link bindings ────────────────────────────────────────
    // Set by RefrainApp.onOpenURL when a widget tap carries a specific quote.
    @Binding var pendingQuoteID: Int?
    @Binding var pendingTrigger: Int

    // ── Clock & UI state ─────────────────────────────────────────────────
    @State private var clock = QuoteClock()
    @State private var showAbout = false

    // ── Admin mode ────────────────────────────────────────────────────────────
    // Activated by long-pressing the time/season label. In-memory only;
    // resets on app relaunch. Time/season overrides are driven through clock
    // directly so the pool and quote update automatically.
    @State private var adminOpen = false

    // ── Lyrics state ─────────────────────────────────────────────────────
    // showLyrics is the single source of truth for whether lyrics are visible.
    // How they're displayed depends on the device and orientation:
    //   - iPhone:         system bottom sheet
    //   - iPad portrait:  custom bottom overlay (avoids iOS 18 card sizing issues)
    //   - iPad landscape: side panel overlaid on the trailing half of the screen
    @State private var showLyrics = false

    // sheetIsPresented drives the system sheet on iPhone only.
    // It's kept separate from showLyrics so orientation changes and iPad's
    // custom overlay can manipulate showLyrics independently.
    @State private var sheetIsPresented = false

    // isReopening suppresses onDismiss cleanup when we're programmatically
    // cycling the sheet (rotation, Another button, widget deep links).
    @State private var isReopening = false

    // ── Orientation ──────────────────────────────────────────────────────
    // Updated by UIDevice.orientationDidChangeNotification. @State so SwiftUI
    // re-renders when it changes. Initialised from current screen dimensions.
    @State private var isLandscape: Bool = UIScreen.main.bounds.width > UIScreen.main.bounds.height

    // ── Layout helpers ───────────────────────────────────────────────────
    private var isPad: Bool         { UIDevice.current.userInterfaceIdiom == .pad }
    private var useSidePanel: Bool  { isPad && isLandscape }
    private var useOverlay: Bool    { isPad && !isLandscape }  // iPad portrait

    // ── Theme ────────────────────────────────────────────────────────────
    var theme: Theme {
        Theme.current(time: clock.timeOfDay, season: clock.season)
    }

    // ── Typography & sizing ──────────────────────────────────────────────
    private var quoteFontSize:       CGFloat { isPad ? 26 : 22 }
    private var attributionFontSize: CGFloat { isPad ? 13 : 12 }
    private var headerFontSize:      CGFloat { isPad ? 12 : 11 }
    private var footerFontSize:      CGFloat { isPad ? 17 : 16 }
    private var poolFontSize:        CGFloat { isPad ? 12 : 11 }
    private var contentMaxWidth:     CGFloat { isPad ? 560 : .infinity }

    // MARK: - Body

    var body: some View {
        ZStack(alignment: .bottom) {
            // ── Main canvas ──────────────────────────────────────────────
            ZStack {
                background
                VStack(spacing: 0) {
                    header
                    ZStack(alignment: .trailing) {
                        quoteContent
                            .padding(.trailing, useSidePanel && showLyrics
                                ? UIScreen.main.bounds.width * 0.5 : 0)
                            .animation(.spring(response: 0.4, dampingFraction: 0.85),
                                       value: showLyrics)
                            // Tap main area to dismiss side panel or overlay
                            .contentShape(Rectangle())
                            .onTapGesture {
                                if showLyrics && (useSidePanel || useOverlay) {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                                        dismissLyrics()
                                    }
                                }
                            }

                        if useSidePanel { sidePanelLyrics }
                    }
                }
            }

            // ── iPad portrait overlay ────────────────────────────────────
            if useOverlay { bottomOverlayLyrics }
        }
        // iPhone system sheet (not used on iPad)
        .sheet(isPresented: $sheetIsPresented, onDismiss: handleSheetDismiss) {
            iPhoneLyricsSheet
        }
        .fullScreenCover(isPresented: $showAbout) {
            AboutView(theme: theme)
        }
        .onChange(of: showLyrics)     { _, newValue in handleShowLyricsChange(newValue) }
        .onChange(of: useSidePanel)   { _, _ in handleOrientationChange(useSidePanel) }
        .onChange(of: pendingTrigger) { _, _ in handleWidgetDeepLink() }
        .onReceive(orientationPublisher) { _ in updateOrientation() }
        .onReceive(appActivePublisher)   { _ in handleAppActive() }
        .animation(.easeInOut(duration: 1.2), value: clock.timeOfDay)
        .animation(.easeInOut(duration: 1.2), value: clock.season)
    }

    // MARK: - Background

    private var background: some View {
        ZStack {
            theme.bg.ignoresSafeArea()
            RadialGradient(
                colors: [theme.mist.opacity(0.6), theme.bg.opacity(0)],
                center: .init(x: 0.5, y: 0.5),
                startRadius: 0,
                endRadius: isPad ? 480 : 340
            )
            .ignoresSafeArea()
        }
    }

    // MARK: - Header

    /// Always full width. Shows time/season label and the About button.
    private var header: some View {
        VStack(spacing: 0) {
            HStack {
                Label(
                    "\(clock.timeOfDay.rawValue.capitalized) · \(clock.season.rawValue.capitalized)",
                    systemImage: clock.timeOfDay.systemImage
                )
                .font(.custom("IM_FELL_English_Roman", size: headerFontSize))
                .textCase(.uppercase)
                .foregroundStyle(adminOpen ? theme.accent : theme.ink.opacity(0.6))
                .onLongPressGesture(minimumDuration: 0.6) {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        adminOpen.toggle()
                        if !adminOpen { clock.clearAdminOverride() }
                    }
                }

                Spacer()

                Button("About") { showAbout = true }
                    .font(.custom("IM_FELL_English_Roman", size: headerFontSize))
                    .textCase(.uppercase)
                    .foregroundStyle(theme.accent)
            }
            .padding(.horizontal, 28)
            .padding(.top, 16)

            // Admin picker row — visible when adminOpen
            if adminOpen {
                HStack(spacing: 12) {
                    Picker("Time", selection: Binding(
                        get: { clock.timeOfDay },
                        set: { clock.setAdminOverride(time: $0, season: clock.season) }
                    )) {
                        ForEach(TimeOfDay.allCases, id: \.self) { t in
                            Text(t.rawValue.capitalized).tag(t)
                        }
                    }
                    .pickerStyle(.segmented)

                    Picker("Season", selection: Binding(
                        get: { clock.season },
                        set: { clock.setAdminOverride(time: clock.timeOfDay, season: $0) }
                    )) {
                        ForEach(Season.allCases, id: \.self) { s in
                            Text(s.rawValue.capitalized).tag(s)
                        }
                    }
                    .pickerStyle(.segmented)
                }
                .padding(.horizontal, 28)
                .padding(.top, 8)
                .preferredColorScheme(theme.isDark ? .dark : .light)
                .transition(.opacity.combined(with: .move(edge: .top)))
            }

            Divider()
                .overlay(theme.accent.opacity(0.3))
                .padding(.horizontal, 28)
                .padding(.vertical, 10)
        }
    }

    // MARK: - Quote + footer

    /// The centred quote and the Another button. In landscape, padded on the
    /// trailing side to make room for the side panel.
    private var quoteContent: some View {
        VStack(spacing: 0) {
            Spacer()

            if let quote = clock.quote {
                VStack(spacing: 12) {
                    Text(quote.text)
                        .font(.custom("IM_FELL_English_Roman", size: quoteFontSize))
                        .foregroundStyle(theme.ink)
                        .multilineTextAlignment(.center)
                        .lineSpacing(6)
                        .frame(maxWidth: contentMaxWidth)
                        .padding(.horizontal, 32)

                    let hasLyrics = quote.lyricsKey != nil
                    Button {
                        if hasLyrics {
                            withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                                showLyrics = true
                            }
                        }
                    } label: {
                        Text("— \(quote.source)")
                            .font(.custom("IM_FELL_English_Roman", size: attributionFontSize))
                            .textCase(.uppercase)
                            .multilineTextAlignment(.center)
                            .foregroundStyle(hasLyrics ? theme.accent : theme.accent.opacity(0.5))
                            .underline(hasLyrics, color: theme.accent.opacity(0.5))
                            .frame(maxWidth: contentMaxWidth)
                            .padding(.horizontal, 48)
                            .padding(.top, 8)
                    }
                    .disabled(!hasLyrics)
                }
                .textSelection(.enabled)
                .gesture(
                    DragGesture(minimumDistance: 40).onEnded { value in
                        if value.translation.height < -40, quote.lyricsKey != nil {
                            withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                                showLyrics = true
                            }
                        }
                    }
                )
            }

            Spacer()

            Divider()
                .overlay(theme.accent.opacity(0.3))
                .padding(.horizontal, 28)
                .padding(.vertical, 10)

            VStack(spacing: 6) {
                Button("Another") { clock.next() }
                    .font(.custom("IM_FELL_English_Roman", size: footerFontSize))
                    .textCase(.uppercase)
                    .foregroundStyle(theme.accent)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(theme.accent.opacity(0.5), lineWidth: 1)
                    )

                Text("\(clock.pool.count) verse\(clock.pool.count == 1 ? "" : "s") for this \(clock.timeOfDay.rawValue)")
                    .font(.custom("IM_FELL_English_Roman", size: poolFontSize))
                    .textCase(.uppercase)
                    .foregroundStyle(theme.ink.opacity(0.65))
            }
            .padding(.bottom, 24)
        }
    }

    // MARK: - iPad portrait: bottom overlay

    /// Custom bottom overlay used on iPad portrait instead of the system sheet.
    /// Avoids iOS 18's default card/form sheet sizing which can't be made
    /// full-width while also respecting a half-height starting detent.
    /// Snaps between half height and full height; dragging down past a
    /// threshold dismisses it.
    @ViewBuilder
    private var bottomOverlayLyrics: some View {
        let lyricsKey   = clock.quote?.lyricsKey
        let stanzaIndex = clock.quote?.stanzaIndex

        if showLyrics,
           let key = lyricsKey,
           let entry = DataStore.shared.lyrics(for: key) {
            BottomOverlay(
                entry: entry,
                stanzaIndex: stanzaIndex,
                theme: theme,
                onDismiss: {
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                        dismissLyrics()
                    }
                }
            )
            .padding(.horizontal, 12)
            .transition(.move(edge: .bottom))
        }
    }

    // MARK: - iPad landscape: side panel

    /// Slides in from the trailing edge when lyrics are open in landscape.
    /// Occupies the right half of the screen; the quote area compresses left.
    /// Dismissed by the chevron button, a rightward swipe, or tapping the main area.
    @ViewBuilder
    private var sidePanelLyrics: some View {
        let lyricsKey   = clock.quote?.lyricsKey
        let stanzaIndex = clock.quote?.stanzaIndex

        if showLyrics,
           let key = lyricsKey,
           let entry = DataStore.shared.lyrics(for: key) {

            ZStack(alignment: .topTrailing) {
                theme.isDark ? theme.mist : theme.bg

                LyricsView(entry: entry, stanzaIndex: stanzaIndex, theme: theme)
                    .padding(.top, 24)

                Button {
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                        dismissLyrics()
                    }
                } label: {
                    Image(systemName: "chevron.right")
                        .font(.system(size: 14, weight: .regular))
                        .foregroundStyle(theme.ink.opacity(0.5))
                        .padding(8)
                }
                .padding(.top, 4)
                .padding(.trailing, 4)
            }
            .frame(width: UIScreen.main.bounds.width * 0.5)
            .clipShape(UnevenRoundedRectangle(
                topLeadingRadius: 20, bottomLeadingRadius: 20,
                bottomTrailingRadius: 0, topTrailingRadius: 0,
                style: .continuous
            ))
            .shadow(color: .black.opacity(0.12), radius: 24, x: -4, y: 0)
            .transition(.move(edge: .trailing))
            .gesture(
                DragGesture(minimumDistance: 40).onEnded { value in
                    if value.translation.width > 40 {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                            dismissLyrics()
                        }
                    }
                }
            )
        }
    }

    // MARK: - iPhone: system sheet content

    /// The lyrics content presented inside a system sheet on iPhone.
    /// On iPad, bottomOverlayLyrics and sidePanelLyrics are used instead.
    @ViewBuilder
    private var iPhoneLyricsSheet: some View {
        let lyricsKey   = clock.quote?.lyricsKey
        let stanzaIndex = clock.quote?.stanzaIndex

        if let key = lyricsKey,
           let entry = DataStore.shared.lyrics(for: key) {
            LyricsView(entry: entry, stanzaIndex: stanzaIndex, theme: theme)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
                .presentationBackground(theme.isDark ? theme.mist : theme.bg)
                .presentationCornerRadius(20)
        }
    }

    // MARK: - Dismiss

    private func dismissLyrics() {
        showLyrics = false
    }

    // MARK: - Event handlers

    /// Keeps sheetIsPresented in sync with showLyrics.
    /// The system sheet is only used on iPhone; iPad uses custom overlays.
    private func handleShowLyricsChange(_ isShowing: Bool) {
        guard !isPad else { return }
        sheetIsPresented = isShowing
    }

    /// Handles orientation changes on iPad by transitioning between the
    /// bottom overlay (portrait) and side panel (landscape). Both read
    /// showLyrics directly, so no explicit transition is needed here —
    /// the views appear/disappear as useSidePanel and useOverlay change.
    /// The system sheet only runs on iPhone so we don't need to manage it.
    private func handleOrientationChange(_ nowSidePanel: Bool) {
        // Nothing to do — useOverlay and useSidePanel are computed from
        // isLandscape, so SwiftUI automatically switches overlays on rotation.
        // showLyrics persists through rotation unchanged.
    }

    /// Called by onDismiss when the iPhone system sheet closes.
    private func handleSheetDismiss() {
        if !isReopening {
            showLyrics = false
            pendingQuoteID     = nil
        }
        isReopening = false
    }

    /// Handles deep links from widget taps — navigates to the quote only.
    private func handleWidgetDeepLink() {
        guard let id = pendingQuoteID else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            clock.navigate(to: id)
            pendingQuoteID = nil
        }
    }

    /// Updates isLandscape after the device rotates.
    private func updateOrientation() {
        DispatchQueue.main.async {
            let newIsLandscape = UIScreen.main.bounds.width > UIScreen.main.bounds.height
            guard newIsLandscape != isLandscape else { return }
            isLandscape = newIsLandscape
        }
    }

    /// Refreshes the clock on app foreground, unless a widget deep link is pending.
    private func handleAppActive() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
            guard pendingQuoteID == nil else { return }
            clock.appDidBecomeActive()
        }
    }

    // MARK: - Publishers

    private var orientationPublisher: NotificationCenter.Publisher {
        NotificationCenter.default.publisher(for: UIDevice.orientationDidChangeNotification)
    }

    private var appActivePublisher: NotificationCenter.Publisher {
        NotificationCenter.default.publisher(for: UIApplication.didBecomeActiveNotification)
    }
}

// MARK: - iPad portrait bottom overlay view

/// Draggable bottom overlay for iPad portrait lyrics presentation.
/// Snaps between half-screen and full-screen heights; flick down to dismiss.
///
/// Layout strategy: the view fills the full screen height (via GeometryReader
/// + ignoresSafeArea) and is shifted upward by an offset. This guarantees
/// the bottom edge always reaches the physical screen edge regardless of
/// safe area insets, without needing to calculate safe area heights manually.
///
/// Half position:  offset = screenHeight * 0.45  (shows bottom 55%)
/// Full position:  offset = screenHeight * 0.07  (shows bottom 93%)
/// Dismissed:      slides off the bottom via transition
private struct BottomOverlay: View {
    let entry: LyricsEntry
    let stanzaIndex: Int?
    let theme: Theme
    let onDismiss: () -> Void

    private let dismissThreshold: CGFloat = 120

    @State private var isExpanded = false
    @GestureState private var dragOffset: CGFloat = 0

    var body: some View {
        GeometryReader { geo in
            let fullH = geo.size.height
            let halfOffset = fullH * 0.45   // panel top sits 45% down = shows 55%
            let fullOffset = fullH * 0.07   // panel top sits 7% down = shows 93%
            let snappedOffset = isExpanded ? fullOffset : halfOffset
            // During drag: moving finger down increases offset (panel shrinks up)
            let displayOffset = min(max(snappedOffset + dragOffset, fullOffset), fullH)

            VStack(spacing: 0) {
                // Drag handle — the only drag target for resizing/dismissing.
                // Keeping the gesture here (not on the whole panel) means the
                // LyricsView scroll is completely unaffected, mirroring the
                // behaviour of a system sheet where only the handle and
                // non-scrollable areas respond to resize drags.
                Capsule()
                    .fill(theme.ink.opacity(0.2))
                    .frame(width: 36, height: 5)
                    .padding(.top, 10)
                    .padding(.bottom, 6)
                    // Expand the hit area so the handle is easy to grab
                    .contentShape(Rectangle().inset(by: -16))
                    .gesture(
                        DragGesture()
                            .updating($dragOffset) { value, state, _ in
                                state = value.translation.height
                            }
                            .onEnded { value in
                                let velocity = value.predictedEndTranslation.height
                                    - value.translation.height
                                let totalDown = value.translation.height + velocity

                                if totalDown > dismissThreshold {
                                    // Flick down hard enough — dismiss
                                    onDismiss()
                                } else if value.translation.height < -60 {
                                    // Drag up — expand to full
                                    withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                                        isExpanded = true
                                    }
                                } else if value.translation.height > 60 && isExpanded {
                                    // Drag down from full — snap back to half
                                    withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                                        isExpanded = false
                                    }
                                } else if value.translation.height > dismissThreshold && !isExpanded {
                                    // Drag down from half — dismiss
                                    onDismiss()
                                } else {
                                    // Small drag — spring back to current position
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) { }
                                }
                            }
                    )

                LyricsView(entry: entry, stanzaIndex: stanzaIndex, theme: theme)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            .background(theme.isDark ? theme.mist : theme.bg)
            .clipShape(UnevenRoundedRectangle(
                topLeadingRadius: 20, bottomLeadingRadius: 0,
                bottomTrailingRadius: 0, topTrailingRadius: 20,
                style: .continuous
            ))
            .shadow(color: .black.opacity(0.12), radius: 24, x: 0, y: -4)
            .offset(y: displayOffset)
            .animation(.interactiveSpring(), value: dragOffset)
        }
        .ignoresSafeArea(edges: .bottom)
    }
}

// MARK: - TimeOfDay SF Symbol mapping

extension TimeOfDay {
    var systemImage: String {
        switch self {
        case .morning:   return "sun.max"
        case .afternoon: return "circle.righthalf.filled"
        case .evening:   return "moon"
        case .night:     return "sparkle"
        }
    }
}

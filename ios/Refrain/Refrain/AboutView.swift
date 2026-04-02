import SwiftUI

// MARK: - AboutView

/// Full-screen cover showing the app description and collection credits.
/// Dismisses with swipe-down (handled automatically by fullScreenCover +
/// the explicit close button for users who don't know the gesture).
struct AboutView: View {
    let theme: Theme
    @Environment(\.dismiss) private var dismiss
    @State private var scrollOffset: CGFloat = 0

    // Fade kicks in after scrolling 40pt, fully opaque by 80pt
    private var fadeOpacity: CGFloat {
        min(max((scrollOffset - 40) / 40, 0), 1)
    }

    var body: some View {
        ZStack {
            // ── Background — always full screen ─────────────────────
            theme.bg.ignoresSafeArea()
            RadialGradient(
                colors: [theme.mist.opacity(0.5), theme.bg.opacity(0)],
                center: .init(x: 0.5, y: 0.3),
                startRadius: 0,
                endRadius: 320
            )
            .ignoresSafeArea()

            // ── Content ──────────────────────────────────────────────
            ScrollView {
                // Scroll offset tracker
                GeometryReader { geo in
                    Color.clear
                        .preference(
                            key: ScrollOffsetKey.self,
                            value: -geo.frame(in: .named("scroll")).minY
                        )
                }
                .frame(height: 0)

                VStack(alignment: .center, spacing: 0) {

                    // ── Hero ────────────────────────────────────────────
                    HStack {
                        Spacer()
                        Button {
                            dismiss()
                        } label: {
                            Image(systemName: "xmark")
                                .font(.system(size: 14, weight: .regular))
                                .foregroundStyle(theme.ink.opacity(0.5))
                                .padding(12)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 8)

                    Image("RefrainLogo")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 110, height: 110)
                        .padding(.bottom, 8)

                    Text("About Refrain")
                        .font(.custom("IM_FELL_English_Roman", size: 26))
                        .textCase(.uppercase)
                        .foregroundStyle(theme.accent)
                        .padding(.bottom, 16)

                    Divider()
                        .overlay(theme.accent.opacity(0.3))
                        .padding(.horizontal, 40)

                    // ── Body ────────────────────────────────────────────
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Refrain draws verses from several collections of folk songs, predominantly from the British Isles, the United States, and Canada. Each verse is chosen to match the time of day and season of your location. The texts follow the standard published editions of each collection—specific manuscript variants are noted in the collection credits below. The words have been lightly modernized where needed.")
                        Text("The verses are beautiful enough on their own, but they are meant to be sung. Find recordings, listen to them, learn them, and sing them!")
                        Text("A new verse appears every 15 minutes, or tap Another whenever you like.")

                        Divider()
                            .overlay(theme.accent.opacity(0.3))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 8)

                        VStack(alignment: .center, spacing: 6) {
                            Text("Made by Nathaniel Smith, 2026.")
                                .font(.system(size: 15))
                                .foregroundStyle(theme.ink.opacity(0.75))
                            Link("www.refrainapp.com", destination: URL(string: "https://refrainapp.com")!)
                                .font(.system(size: 15))
                                .foregroundStyle(theme.accent)
                            Link("support@refrainapp.com", destination: URL(string: "mailto:support@refrainapp.com")!)
                                .font(.system(size: 14))
                                .foregroundStyle(theme.ink.opacity(0.55))
                            Link("Privacy Policy", destination: URL(string: "https://refrainapp.com/privacy")!)
                                .font(.system(size: 13))
                                .foregroundStyle(theme.ink.opacity(0.35))
                        }
                        .frame(maxWidth: .infinity)

                        Divider()
                            .overlay(theme.accent.opacity(0.3))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 8)

                        Text("The verses come from a number of fieldwork collections, most gathered in the late nineteenth and early twentieth centuries:")

                        Spacer().frame(height: 4)

                        ForEach(collections, id: \.title) { collection in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(collection.title)
                                    .fontWeight(.bold)
                                Text(collection.description)
                                    .lineSpacing(3)
                            }
                        }
                    }
                    .font(.system(size: 15))
                    .foregroundStyle(theme.ink.opacity(0.85))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 32)
                    .padding(.top, 24)
                    .padding(.bottom, 80)
                }
            }
            .coordinateSpace(name: "scroll")
            .onPreferenceChange(ScrollOffsetKey.self) { scrollOffset = $0 }
            .ignoresSafeArea(edges: .bottom)
            .mask {
                VStack(spacing: 0) {
                    LinearGradient(
                        colors: [.black.opacity(1 - fadeOpacity), .black],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .frame(height: 60)
                    Rectangle()
                }
                .ignoresSafeArea(edges: .bottom)
            }
        }
        .interactiveDismissDisabled(false)
    }

    // MARK: - Collection data

    private struct CollectionInfo {
        let title: String
        let description: String
    }

    private let collections: [CollectionInfo] = [
        CollectionInfo(
            title: "The Child Ballads",
            description: "305 traditional English and Scottish folk songs collected by Francis James Child between 1882 and 1898. They are among the oldest surviving songs in the English language."
        ),
        CollectionInfo(
            title: "One Hundred English Folksongs",
            description: "100 traditional English folk songs collected by Cecil Sharp from roughly 1903–1913 and published in 1916. Sharp gathered them from singers across rural England at a time when many of these songs were on the verge of being forgotten."
        ),
        CollectionInfo(
            title: "Folk Songs from Somerset",
            description: "130 traditional English folk songs collected by Cecil J. Sharp and Charles L. Marson from singers across Somerset, published in five series between 1904 and 1911."
        ),
        CollectionInfo(
            title: "English Folk Songs from the Southern Appalachians (1917)",
            description: "122 traditional English folk songs collected by Olive Dame Campbell and Cecil J. Sharp from singers in the mountain communities of Virginia, North Carolina, Kentucky, and Tennessee. Many are British ballads brought to America by settlers generations earlier, preserved in the mountains long after they had faded from memory elsewhere."
        ),
        CollectionInfo(
            title: "English Folk Songs from the Southern Appalachians (1932)",
            description: "An expanded edition of the 1917 Campbell and Sharp collection, revised and enlarged by Maud Karpeles and published by Oxford University Press. It nearly doubles the original, adding further ballads alongside songs from the hymns, play-party, and nursery song traditions."
        ),
        CollectionInfo(
            title: "Folk Songs from Newfoundland",
            description: "30 traditional folk songs collected by Maud Karpeles from the fishing communities of Newfoundland and published in 1934. The songs preserve British ballad traditions brought across the Atlantic by early settlers."
        ),
        CollectionInfo(
            title: "Folk-Songs from Hampshire",
            description: "16 traditional English folk songs collected by George B. Gardiner, with piano accompaniments by Gustav Holst, published by Novello & Co. in 1909."
        ),
        CollectionInfo(
            title: "Cowboy Songs and Other Frontier Ballads",
            description: "Around 150 songs of the American West collected by John A. Lomax and published in 1910. Songs are traditional and anonymous unless otherwise noted; individual authorship is credited where known."
        ),
        CollectionInfo(
            title: "American Ballads and Folk Songs",
            description: "Around 200 songs collected by John A. Lomax and Alan Lomax from across the United States and published in 1934. The collection ranges widely: lumberjack and canal songs, frontier ballads, Appalachian mountain songs, sea shanties, and work songs."
        ),
        CollectionInfo(
            title: "Songs of the West",
            description: "121 traditional folk songs of Devon and Cornwall, collected from singers in the field by Sabine Baring-Gould with Henry Fleetwood Sheppard and F.W. Bussell, and published in 1905 with Cecil Sharp as musical editor. Baring-Gould began collecting in 1888, visiting old men in their cottages, farmhouses, and moorland taverns across the West Country. The songs have a strongly pastoral character, featuring mornings on the moor, rural labour, and the Devon and Cornish landscape."
        ),
        CollectionInfo(
            title: "English Traditional Songs and Carols",
            description: "38 traditional English folk songs and carols collected almost entirely by Lucy Broadwood from field singers across Sussex, Surrey, and Bedfordshire, and published in 1908. A substantial number came from a single remarkable source: Henry Burstow, a bellringer and cobbler from Horsham, Sussex, who had carried the songs in his memory for decades. The collection also includes May Day carols and a gypsy Christmas carol collected from the Goby family of Sussex and Surrey."
        ),
    ]
}

// MARK: - Scroll offset preference key

private struct ScrollOffsetKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

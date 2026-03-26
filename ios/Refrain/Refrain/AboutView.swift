import SwiftUI

// MARK: - AboutView

/// Full-screen cover showing the app description and collection credits.
/// Dismisses with swipe-down (handled automatically by fullScreenCover +
/// the explicit close button for users who don't know the gesture).
struct AboutView: View {
    let theme: Theme
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            theme.bg.ignoresSafeArea()

            RadialGradient(
                colors: [theme.mist.opacity(0.5), theme.bg.opacity(0)],
                center: .init(x: 0.5, y: 0.3),
                startRadius: 0,
                endRadius: 320
            )
            .ignoresSafeArea()

            ScrollView {
                VStack(alignment: .center, spacing: 0) {

                    // ── Header ──────────────────────────────────────────
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
                        .frame(width: 80, height: 80)
                        .padding(.bottom, 8)

 
                    Text("Refrain")
                        .font(.custom("IM_FELL_English_Roman", size: 26))
                        .textCase(.uppercase)
                        .foregroundStyle(theme.accent)
                        .padding(.bottom, 16)

                    Divider()
                        .overlay(theme.accent.opacity(0.3))
                        .padding(.horizontal, 40)

                    // ── Body ────────────────────────────────────────────
                    VStack(alignment: .leading, spacing: 16) {
                        Group {
                            Text("These verses are drawn from several collections of folk songs, predominantly from the British Isles, the United States, and Canada. Each verse is chosen to match the time of day and season of your location. The words have been lightly modernized where needed.")
                            Text("The verses are beautiful enough on their own, but they are meant to be sung. Find recordings, listen to them, learn them, and sing them!")
                            Text("A new verse appears every 15 minutes, or tap Another whenever you like.")
                        }
                        .font(.system(size: 15))
                        .foregroundStyle(theme.ink.opacity(0.85))
                    }
                    .padding(.horizontal, 32)
                    .padding(.vertical, 24)

                    Divider()
                        .overlay(theme.accent.opacity(0.3))
                        .padding(.horizontal, 40)

                    // ── Collections ─────────────────────────────────────
                    VStack(alignment: .leading, spacing: 0) {

                        Text("The verses come from a number of fieldwork collections, most gathered in the late nineteenth and early twentieth centuries:")
                            .font(.system(size: 15))
                            .foregroundStyle(theme.ink.opacity(0.85))
                            .padding(.bottom, 20)

                        ForEach(collections, id: \.title) { collection in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(collection.title)
                                    .font(.custom("IM_FELL_English_Roman", size: 16))
                                    .textCase(.uppercase)
                                    .foregroundStyle(theme.accent)
                                Text(collection.description)
                                    .font(.system(size: 15))
                                    .foregroundStyle(theme.ink.opacity(0.85))
                                    .lineSpacing(3)
                            }
                            .padding(.bottom, 16)
                        }
                    }
                    .padding(.horizontal, 32)
                    .padding(.top, 24)
                    .padding(.bottom, 48)
                }
            }
        }
        // fullScreenCover doesn't support swipe-down by default —
        // this re-enables it via the interactiveDismissDisabled modifier
        // set to false (the default, included here for clarity).
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
    ]
}

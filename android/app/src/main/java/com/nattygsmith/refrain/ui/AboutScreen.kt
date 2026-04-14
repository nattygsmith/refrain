package com.nattygsmith.refrain.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nattygsmith.refrain.R
import com.nattygsmith.refrain.clock.Season
import com.nattygsmith.refrain.clock.TimeOfDay
import com.nattygsmith.refrain.theme.ImFellEnglish
import com.nattygsmith.refrain.theme.refrainTheme

@Composable
fun AboutScreen(
    timeOfDay: TimeOfDay,
    season: Season,
    onBack: () -> Unit,
) {
    val theme = refrainTheme(timeOfDay, season)
    val uriHandler = LocalUriHandler.current

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(theme.bg)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        colors = listOf(theme.mist.copy(alpha = 0.5f), Color.Transparent),
                        radius = 800f,
                    )
                )
        )

        SelectionContainer {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(
                    start  = 32.dp,
                    end    = 32.dp,
                    top    = WindowInsets.statusBars.asPaddingValues().calculateTopPadding() + 8.dp,
                    bottom = WindowInsets.navigationBars.asPaddingValues().calculateBottomPadding() + 48.dp,
                ),
            ) {
                // ── Back button — outside selection so tap works cleanly ───
                item {
                    // DisableSelection lets the button remain tappable inside
                    // a SelectionContainer without triggering text selection
                    androidx.compose.foundation.text.selection.DisableSelection {
                        TextButton(
                            onClick        = onBack,
                            contentPadding = PaddingValues(0.dp),
                        ) {
                            Text(
                                text     = "← Back",
                                fontSize = 15.sp,
                                color    = theme.ink.copy(alpha = 0.5f),
                            )
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                }

                // ── Logo + title ──────────────────────────────────────────
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        androidx.compose.foundation.Image(
                            painter            = painterResource(R.drawable.refrain_logo),
                            contentDescription = "Refrain logo",
                            modifier           = Modifier.size(110.dp),
                            contentScale       = ContentScale.Fit,
                        )

                        Spacer(Modifier.height(12.dp))

                        Text(
                            text          = "ABOUT REFRAIN",
                            fontFamily    = ImFellEnglish,
                            fontSize      = 24.sp,
                            color         = theme.accent,
                            textAlign     = TextAlign.Center,
                            letterSpacing = 1.sp,
                        )

                        Spacer(Modifier.height(16.dp))
                        HorizontalDivider(
                            modifier = Modifier.padding(horizontal = 40.dp),
                            color    = theme.accent.copy(alpha = 0.3f),
                        )
                        Spacer(Modifier.height(24.dp))
                    }
                }

                // ── Body paragraphs ───────────────────────────────────────
                item {
                    AboutBody(inkColor = theme.ink)
                    Spacer(Modifier.height(24.dp))
                }

                // ── Links ─────────────────────────────────────────────────
                item {
                    HorizontalDivider(color = theme.accent.copy(alpha = 0.3f))
                    Spacer(Modifier.height(20.dp))

                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        androidx.compose.foundation.text.selection.DisableSelection {
                            TextButton(onClick = { uriHandler.openUri("https://refrainapp.com") }) {
                                Text(
                                    text     = "www.refrainapp.com",
                                    fontSize = 15.sp,
                                    color    = theme.accent,
                                )
                            }
                        }

                        Spacer(Modifier.height(12.dp))

                        Text(
                            text      = "Questions, bug reports, or feedback:",
                            fontSize  = 14.sp,
                            color     = theme.ink.copy(alpha = 0.7f),
                            textAlign = TextAlign.Center,
                        )
                        Spacer(Modifier.height(2.dp))
                        androidx.compose.foundation.text.selection.DisableSelection {
                            Text(
                                text      = "support@refrainapp.com",
                                fontSize  = 13.sp,
                                color     = theme.ink.copy(alpha = 0.55f),
                                textAlign = TextAlign.Center,
                                modifier  = Modifier.clickable {
                                    uriHandler.openUri("mailto:support@refrainapp.com")
                                },
                            )
                        }

                        Spacer(Modifier.height(12.dp))

                        androidx.compose.foundation.text.selection.DisableSelection {
                            TextButton(onClick = { uriHandler.openUri("https://refrainapp.com/privacy") }) {
                                Text(
                                    text     = "Privacy Policy",
                                    fontSize = 13.sp,
                                    color    = theme.ink.copy(alpha = 0.35f),
                                )
                            }
                        }
                    }

                    Spacer(Modifier.height(20.dp))
                    HorizontalDivider(color = theme.accent.copy(alpha = 0.3f))
                    Spacer(Modifier.height(24.dp))
                }

                // ── Collection intro ──────────────────────────────────────
                item {
                    Text(
                        text       = "The verses come from a number of fieldwork collections, most gathered in the late nineteenth and early twentieth centuries:",
                        fontSize   = 15.sp,
                        lineHeight = 24.sp,
                        color      = theme.ink.copy(alpha = 0.85f),
                    )
                    Spacer(Modifier.height(20.dp))
                }

                // ── Collections ───────────────────────────────────────────
                collections.forEach { collection ->
                    item {
                        CollectionEntry(
                            title       = collection.title,
                            description = collection.description,
                            inkColor    = theme.ink,
                        )
                        Spacer(Modifier.height(16.dp))
                    }
                }
            }
        }
    }
}

@Composable
private fun AboutBody(inkColor: Color) {
    val paragraphs = listOf(
        "Refrain draws verses from several collections of folk songs, predominantly from the British Isles, the United States, and Canada. Each verse is chosen to match the time of day and season of your location. The texts follow the standard published editions of each collection—specific manuscript variants are noted in the collection credits below. The words have been lightly modernized where needed.",
        "The verses are beautiful enough on their own, but they are meant to be sung. Find recordings, listen to them, learn them, and sing them!",
        "A new verse appears every 15 minutes, or tap Another whenever you like.",
    )
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        paragraphs.forEach { para ->
            Text(
                text       = para,
                fontSize   = 15.sp,
                lineHeight = 24.sp,
                color      = inkColor.copy(alpha = 0.85f),
            )
        }
    }
}

@Composable
private fun CollectionEntry(title: String, description: String, inkColor: Color) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
            text       = title,
            fontSize   = 15.sp,
            fontWeight = FontWeight.Bold,
            color      = inkColor.copy(alpha = 0.9f),
        )
        Text(
            text       = description,
            fontSize   = 14.sp,
            lineHeight = 22.sp,
            color      = inkColor.copy(alpha = 0.75f),
        )
    }
}

private data class CollectionInfo(val title: String, val description: String)

private val collections = listOf(
    CollectionInfo(
        "The Child Ballads",
        "305 traditional English and Scottish folk songs collected by Francis James Child between 1882 and 1898. They are among the oldest surviving songs in the English language.",
    ),
    CollectionInfo(
        "One Hundred English Folksongs",
        "100 traditional English folk songs collected by Cecil Sharp from roughly 1903–1913 and published in 1916. Sharp gathered them from singers across rural England at a time when many of these songs were on the verge of being forgotten.",
    ),
    CollectionInfo(
        "Folk Songs from Somerset",
        "130 traditional English folk songs collected by Cecil J. Sharp and Charles L. Marson from singers across Somerset, published in five series between 1904 and 1911.",
    ),
    CollectionInfo(
        "English Folk Songs from the Southern Appalachians (1917)",
        "122 traditional English folk songs collected by Olive Dame Campbell and Cecil J. Sharp from singers in the mountain communities of Virginia, North Carolina, Kentucky, and Tennessee. Many are British ballads brought to America by settlers generations earlier, preserved in the mountains long after they had faded from memory elsewhere.",
    ),
    CollectionInfo(
        "English Folk Songs from the Southern Appalachians (1932)",
        "An expanded edition of the 1917 Campbell and Sharp collection, revised and enlarged by Maud Karpeles and published by Oxford University Press. It nearly doubles the original, adding further ballads alongside songs from the hymns, play-party, and nursery song traditions.",
    ),
    CollectionInfo(
        "Folk Songs from Newfoundland",
        "30 traditional folk songs collected by Maud Karpeles from the fishing communities of Newfoundland and published in 1934. The songs preserve British ballad traditions brought across the Atlantic by early settlers.",
    ),
    CollectionInfo(
        "Folk-Songs from Hampshire",
        "16 traditional English folk songs collected by George B. Gardiner, with piano accompaniments by Gustav Holst, published by Novello & Co. in 1909.",
    ),
    CollectionInfo(
        "Cowboy Songs and Other Frontier Ballads",
        "Around 150 songs of the American West collected by John A. Lomax and published in 1910. Songs are traditional and anonymous unless otherwise noted; individual authorship is credited where known.",
    ),
    CollectionInfo(
        "American Ballads and Folk Songs",
        "Around 200 songs collected by John A. Lomax and Alan Lomax from across the United States and published in 1934. The collection ranges widely: lumberjack and canal songs, frontier ballads, Appalachian mountain songs, sea shanties, and work songs.",
    ),
    CollectionInfo(
        "Songs of the West",
        "121 traditional folk songs of Devon and Cornwall, collected from singers in the field by Sabine Baring-Gould with Henry Fleetwood Sheppard and F.W. Bussell, and published in 1905 with Cecil Sharp as musical editor. Baring-Gould began collecting in 1888, visiting old men in their cottages, farmhouses, and moorland taverns across the West Country.",
    ),
    CollectionInfo(
        "English Traditional Songs and Carols",
        "38 traditional English folk songs and carols collected almost entirely by Lucy Broadwood from field singers across Sussex, Surrey, and Bedfordshire, and published in 1908. A substantial number came from a single remarkable source: Henry Burstow, a bellringer and cobbler from Horsham, Sussex, who had carried the songs in his memory for decades. The collection also includes May Day carols and a gypsy Christmas carol collected from the Goby family of Sussex and Surrey.",
    ),
    CollectionInfo(
        "Ballads and Sea Songs from Nova Scotia",
        "162 traditional ballads and songs collected by W. Roy Mackenzie from singers across Nova Scotia, primarily in Pictou and Colchester counties, between 1908 and 1912, and published by Harvard University Press in 1928. The collection preserves both British ballad traditions carried to the Maritimes by early settlers and locally composed songs of the sea, the lumber camps, and the Nova Scotia shore.",
    ),
)

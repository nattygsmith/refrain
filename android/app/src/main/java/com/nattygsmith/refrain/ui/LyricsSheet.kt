package com.nattygsmith.refrain.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nattygsmith.refrain.data.DataStore
import com.nattygsmith.refrain.theme.ImFellEnglish
import com.nattygsmith.refrain.theme.RefrainTheme

/**
 * Lyrics bottom sheet using Material3 ModalBottomSheet.
 *
 * Opens at full height (skipPartiallyExpanded = true) so the scroll position
 * is always reliable — the full viewport is available when we scroll to the
 * highlighted stanza. The user can drag it down to dismiss.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LyricsSheet(
    lyricsKey: String,
    stanzaIndex: Int?,
    theme: RefrainTheme,
    onDismiss: () -> Unit,
) {
    val entry      = remember(lyricsKey) { DataStore.lyricsFor(lyricsKey) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val listState  = rememberLazyListState()

    LaunchedEffect(Unit) {
        if (entry == null || stanzaIndex == null) return@LaunchedEffect
        kotlinx.coroutines.delay(300)
        val targetIndex = stanzaIndex + 1  // +1 for header item
        listState.animateScrollToItem((targetIndex - 1).coerceAtLeast(0))
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState       = sheetState,
        containerColor   = theme.sheetBg,
        modifier         = Modifier.fillMaxWidth(),
        dragHandle = {
            Box(
                modifier = Modifier
                    .padding(top = 12.dp, bottom = 8.dp)
                    .size(width = 36.dp, height = 3.dp)
                    .background(
                        color = theme.accent.copy(alpha = 0.35f),
                        shape = RoundedCornerShape(2.dp),
                    )
            )
        },
    ) {
        if (entry == null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text  = "Lyrics not found.",
                    color = theme.ink.copy(alpha = 0.5f),
                )
            }
            return@ModalBottomSheet
        }

        SelectionContainer {
            LazyColumn(
                state          = listState,
                modifier       = Modifier
                    .fillMaxWidth()
                    .navigationBarsPadding(),
                contentPadding = PaddingValues(horizontal = 28.dp, vertical = 8.dp),
            ) {
                // ── Header ────────────────────────────────────────────────
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Text(
                            text       = entry.title,
                            fontFamily = ImFellEnglish,
                            fontSize   = 20.sp,
                            color      = theme.ink,
                            textAlign  = TextAlign.Center,
                        )
                        if (entry.collectionLabel != null) {
                            Spacer(Modifier.height(4.dp))
                            Text(
                                text      = entry.collectionLabel ?: "",
                                fontSize  = 12.sp,
                                color     = theme.accent.copy(alpha = 0.7f),
                                textAlign = TextAlign.Center,
                            )
                        }
                        if (entry.version.isNotBlank()) {
                            Spacer(Modifier.height(4.dp))
                            Text(
                                text      = entry.version,
                                fontStyle = FontStyle.Italic,
                                fontSize  = 12.sp,
                                color     = theme.ink.copy(alpha = 0.45f),
                                textAlign = TextAlign.Center,
                                modifier  = Modifier.fillMaxWidth(),
                            )
                        }
                        Spacer(Modifier.height(16.dp))
                        HorizontalDivider(color = theme.accent.copy(alpha = 0.2f))
                    }
                }

                // ── Stanzas ───────────────────────────────────────────────
                itemsIndexed(entry.stanzas) { index, stanza ->
                    StanzaItem(
                        text          = stanza,
                        isHighlighted = index == stanzaIndex,
                        theme         = theme,
                    )
                    Spacer(Modifier.height(20.dp))
                }

                item { Spacer(Modifier.height(48.dp)) }
            }
        }
    }
}

@Composable
private fun StanzaItem(
    text: String,
    isHighlighted: Boolean,
    theme: RefrainTheme,
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .then(
                if (isHighlighted) Modifier.background(
                    color = theme.accent.copy(alpha = 0.08f),
                    shape = RoundedCornerShape(8.dp),
                ) else Modifier
            )
            .padding(
                horizontal = if (isHighlighted) 12.dp else 0.dp,
                vertical   = if (isHighlighted) 10.dp else 0.dp,
            )
    ) {
        Text(
            text       = text,
            fontFamily = ImFellEnglish,
            fontSize   = 16.sp,
            lineHeight = 26.sp,
            color      = if (isHighlighted) theme.ink else theme.ink.copy(alpha = 0.7f),
            textAlign  = TextAlign.Center,
            modifier   = Modifier.fillMaxWidth(),
        )
    }
}

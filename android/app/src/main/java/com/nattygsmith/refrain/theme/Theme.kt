package com.nattygsmith.refrain.theme

import androidx.compose.ui.graphics.Color
import com.nattygsmith.refrain.clock.Season
import com.nattygsmith.refrain.clock.TimeOfDay

/**
 * A set of four colours for a given time-of-day × season combination.
 *
 * Values are identical to iOS Theme.swift and constants.js — all three platforms
 * share the same 16-entry lookup table. If a colour is changed, update all three.
 */
data class RefrainTheme(
    val bg: Color,
    val ink: Color,
    val accent: Color,
    val mist: Color,
) {
    /** True for evening and night themes. Used to determine sheet background. */
    val isDark: Boolean get() {
        val r = bg.red
        val g = bg.green
        val b = bg.blue
        val luminance = 0.2126f * r + 0.7152f * g + 0.0722f * b
        return luminance < 0.15f
    }

    val sheetBg: Color get() = if (isDark) mist else bg
}

// ── Hex helper ────────────────────────────────────────────────────────────────

private fun hex(value: String): Color {
    val stripped = value.trimStart('#')
    val argb = stripped.toLong(16) or 0xFF000000L
    return Color(argb.toInt())
}

// ── Theme lookup ──────────────────────────────────────────────────────────────

private val themes: Map<TimeOfDay, Map<Season, RefrainTheme>> = mapOf(
    TimeOfDay.MORNING to mapOf(
        Season.SPRING to RefrainTheme(hex("#f0ebe0"), hex("#2c2416"), hex("#577144"), hex("#d4e8c2")),
        Season.SUMMER to RefrainTheme(hex("#fdf3d0"), hex("#2c2416"), hex("#9b6322"), hex("#fae89a")),
        Season.AUTUMN to RefrainTheme(hex("#f5e6cc"), hex("#2c2416"), hex("#a84e1b"), hex("#e8c998")),
        Season.WINTER to RefrainTheme(hex("#eaf0f5"), hex("#1a2530"), hex("#447190"), hex("#c8dde8")),
    ),
    TimeOfDay.AFTERNOON to mapOf(
        Season.SPRING to RefrainTheme(hex("#e8f0dc"), hex("#1e2d14"), hex("#4d7631"), hex("#c5dba8")),
        Season.SUMMER to RefrainTheme(hex("#fef0b0"), hex("#2a2010"), hex("#926417"), hex("#fad870")),
        Season.AUTUMN to RefrainTheme(hex("#f0dcc0"), hex("#2a1e10"), hex("#a04a18"), hex("#ddb880")),
        Season.WINTER to RefrainTheme(hex("#dde8f0"), hex("#182230"), hex("#3a6888"), hex("#b0cede")),
    ),
    TimeOfDay.EVENING to mapOf(
        Season.SPRING to RefrainTheme(hex("#2a3520"), hex("#e8f0d8"), hex("#90c060"), hex("#405030")),
        Season.SUMMER to RefrainTheme(hex("#302818"), hex("#f8e8c0"), hex("#e0a040"), hex("#504028")),
        Season.AUTUMN to RefrainTheme(hex("#2e2010"), hex("#f0d8b0"), hex("#d56d25"), hex("#503020")),
        Season.WINTER to RefrainTheme(hex("#181e28"), hex("#c8d8e8"), hex("#6090b8"), hex("#283040")),
    ),
    TimeOfDay.NIGHT to mapOf(
        Season.SPRING to RefrainTheme(hex("#121c10"), hex("#d0e8c0"), hex("#70a850"), hex("#1e2e18")),
        Season.SUMMER to RefrainTheme(hex("#181408"), hex("#f0e0a0"), hex("#c89030"), hex("#282010")),
        Season.AUTUMN to RefrainTheme(hex("#140e08"), hex("#e8c890"), hex("#b76727"), hex("#221408")),
        Season.WINTER to RefrainTheme(hex("#080c14"), hex("#b0c8e0"), hex("#4d7dad"), hex("#101828")),
    ),
)

fun refrainTheme(time: TimeOfDay, season: Season): RefrainTheme =
    themes[time]?.get(season) ?: themes[TimeOfDay.MORNING]!![Season.SPRING]!!

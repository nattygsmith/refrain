import React, { useState, useEffect, useCallback } from "react";

// ============================================================
//  DEV MODE
//  Set to true to show time/season override dropdowns in the UI.
//  Set to false before pushing to GitHub.
// ============================================================
const DEV_MODE = false;

// ============================================================
//  QUOTE LIBRARY
//  To add quotes: append objects to this array.
//  Required fields:
//    text     — the quote, use \n for line breaks
//    source   — credit string shown to user e.g. "Tam Lin (Child 39)"
//    time     — one or more of: "morning" | "afternoon" | "evening" | "night"
//    season   — one or more of: "spring" | "summer" | "autumn" | "winter"
//               use [] for quotes that work in any season
//  Optional:
//    notes    — modernization notes (not shown in UI, for your records)
// ============================================================
const QUOTES = [
  // ── child-ballads (─────────────────────────────────────)
  // --- Riddles Wisely Expounded (Child 1) ---
  {
    text: "He knocked at the lady's gate,\nOne evening when it was late.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["evening"],
    season: [],
    lyricsKey: "child1",
    stanzaIndex: 3,
  },
  {
    text: "The youngest sister, fair and bright,\nShe lay beside him all through the night.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["night"],
    season: [],
    lyricsKey: "child1",
    stanzaIndex: 6,
  },
  {
    text: "And in the morning, come the day,\nShe said, 'Young man, will you marry me?'",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["morning"],
    season: [],
    lyricsKey: "child1",
    stanzaIndex: 7,
  },
  // --- Lady Isabel and the Elf-Knight (Child 4) ---
  {
    text: "Fair lady Isabel sits in her bower sewing,\nThere she heard an elf-knight blowing his horn,\nThe first morning in May.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child4",
    stanzaIndex: 0,
  },
  {
    text: "They rode till they came to the sweet water side,\nThree hours before it was day.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["night"],
    season: [],
    lyricsKey: "child4",
    stanzaIndex: 13,
  },
  // --- The Three Ravens (Child 26) ---
  {
    text: "The one of them said to his mate,\n'Where shall we our breakfast take?'",
    source: "The Three Ravens (Child 26)",
    time: ["morning"],
    season: [],
    lyricsKey: "child26",
    stanzaIndex: 0,
  },
  {
    text: "She buried him before the prime,\nShe died herself ere evening time.",
    source: "The Three Ravens (Child 26)",
    time: ["evening"],
    season: [],
    lyricsKey: "child26",
    stanzaIndex: 8,
  },
  // --- Allison Gross (Child 35) ---
  {
    text: "But as it fell out on last Halloween,\nWhen the fairy court was riding by,\nThe queen lighted down on a daisy bank,\nNot far from the tree where I used to lie.",
    source: "Allison Gross (Child 35)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child35",
    stanzaIndex: 11,
  },
  // --- Tam Lin (Child 39) ---
  {
    text: "Gloomy, gloomy was the night,\nAnd eerie was the way,\nAs fair Jenny in her green mantle\nTo Miles Cross she did go.",
    source: "Tam Lin (Child 39)",
    time: ["night"],
    season: ["autumn"],
    lyricsKey: "child39",
    stanzaIndex: 36,
  },
  {
    text: "Just at the mirk and midnight hour,\nThe fairy folk will ride,\nAnd they that would their true-love win,\nAt Miles Cross they must bide.",
    source: "Tam Lin (Child 39)",
    time: ["night"],
    season: ["autumn"],
    lyricsKey: "child39",
    stanzaIndex: 25,
  },
  {
    text: "Tomorrow is Halloween,\nThe elfin court will ride,\nThrough England, and through all Scotland,\nAnd through the world wide.",
    source: "Tam Lin (Child 39)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child39",
    stanzaIndex: 24,
  },
  {
    text: "O they begin at sky-setting,\nRide all the evening tide;\nAnd she that will her true-love borrow,\nAt Miles Cross will him bide.",
    source: "Tam Lin (Child 39)",
    time: ["evening"],
    season: ["autumn"],
    lyricsKey: "child39",
    stanzaIndex: 26,
  },
  // --- The Broomfield Hill (Child 43) ---
  {
    text: "The one rode early in the morning,\nThe other in the afternoon.",
    source: "The Broomfield Hill (Child 43)",
    time: ["afternoon"],
    season: [],
    lyricsKey: "child43",
    stanzaIndex: 0,
  },
  {
    text: "She pulled the blossom of the broom,\nThe blossom it smells sweet.",
    source: "The Broomfield Hill (Child 43)",
    time: ["morning", "afternoon"],
    season: ["spring"],
    lyricsKey: "child43",
    stanzaIndex: 7,
  },
  // --- Sir Patrick Spens (Child 58) ---
  {
    text: "Late late last night I saw the new moon,\nWith the old moon in her arm;\nAnd I fear, I fear, my dear master,\nThat we will come to harm.",
    source: "Sir Patrick Spens (Child 58)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child58",
    stanzaIndex: 6,
  },
  // --- Lord Thomas and Annet (Child 73) ---
  {
    text: "Sweet Willie and Fair Annie,\nAs they sat on yonder hill,\nIf they had sat from morn 'til evening,\nThey had not talked their fill.",
    source: "Lord Thomas and Annet (Child 73)",
    time: ["evening"],
    season: [],
    lyricsKey: "child73",
    stanzaIndex: 30,
  },
  // --- Fair Margaret and Sweet William (Child 74) ---
  {
    text: "As it fell out on a long summer's day,\nTwo lovers they sat on a hill;\nThey sat together that long summer's day,\nAnd could not talk their fill.",
    source: "Fair Margaret and Sweet William (Child 74)",
    time: ["afternoon"],
    season: ["summer"],
    lyricsKey: "child74",
    stanzaIndex: 0,
  },
  // --- The Lass of Roch Royal (Child 76) ---
  {
    text: "Fair Isabell of Rochroyall,\nShe dreamed where she lay,\nShe dreamed a dream of her love Gregory,\nA little before the day.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: [],
    lyricsKey: "child76",
    stanzaIndex: 0,
  },
  {
    text: "The night was dark, and the wind blew cold,\nAnd her love was fast asleep,\nAnd the bairn that was in her two arms\nFull sore began to weep.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child76",
    stanzaIndex: 6,
  },
  // --- The Unquiet Grave (Child 78) ---
  {
    text: "The wind does blow today, my love,\nAnd a few small drops of rain;\nI never had but one true-love,\nIn a cold grave she was lain.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn", "winter"],
    lyricsKey: "child78",
    stanzaIndex: 0,
  },
  {
    text: "'Tis down in yonder garden green,\nLove, where we used to walk,\nThe finest flower that e'er was seen\nIs withered to a stalk.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child78",
    stanzaIndex: 5,
  },
  // --- The Wife of Usher's Well (Child 79) ---
  {
    text: "The hallow day of Yule are come,\nThe nights are long and dark.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child79",
    stanzaIndex: 3,
  },
  {
    text: "The young cock crew in the merry morning,\nAnd the wild fowl chirped for day;\nThe elder to the younger did say,\nDear brother, we must away.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["morning"],
    season: [],
    lyricsKey: "child79",
    stanzaIndex: 7,
  },
  // --- Little Musgrave and Lady Barnard (Child 81) ---
  {
    text: "When supper was over, and mass was sung,\nAnd every man bound for bed,\nLittle Musgrave and that lady\nIn one chamber were laid.",
    source: "Little Musgrave and Lady Barnard (Child 81)",
    time: ["evening"],
    season: [],
    lyricsKey: "child81",
    stanzaIndex: 13,
  },
  // --- Bonny Barbara Allan (Child 84) ---
  {
    text: "It was in and about the Martinmas time,\nWhen the green leaves were a-falling.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child84",
    stanzaIndex: 0,
  },
  {
    text: "All in the merry month of May,\nWhen green leaves they were springing,\nThis young man on his death-bed lay,\nFor the love of Barbara Allen.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["spring"],
    lyricsKey: "child84",
    stanzaIndex: 9,
  },
  {
    text: "It fell about the Lammas time,\nWhen the woods grow green and yellow.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child84",
    stanzaIndex: 10,
  },
  // --- Willie o Winsbury (Child 100) ---
  {
    text: "He's mounted her on a milk-white steed,\nHimself on a dapple-grey,\nAnd made her a lady of as much land\nShe could ride in a whole summer day.",
    source: "Willie o Winsbury (Child 100)",
    time: ["morning", "afternoon"],
    season: ["summer"],
    lyricsKey: "child100",
    stanzaIndex: 12,
  },
  // --- The Great Silkie of Sule Skerry (Child 113) ---
  {
    text: "Then one arose at her bed-foot,\nA grumbly guest I'm sure was he.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["night"],
    season: [],
    lyricsKey: "child113",
    stanzaIndex: 1,
  },
  {
    text: "And it shall come to pass on a summer's day,\nWhen the sun shines hot on every stone.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning", "afternoon"],
    season: ["summer"],
    lyricsKey: "child113",
    stanzaIndex: 5,
  },
  {
    text: "And he'll go out on a May morning,\nAnd he'll kill both my wee son and me.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child113",
    stanzaIndex: 6,
  },
  // --- Johnie Cock (Child 114) ---
  {
    text: "Johnie rose up in a May morning,\nCalled for water to wash his hands,\nAnd he has called for his good gray hounds,\nThat lay bound in iron bands.",
    source: "Johnie Cock (Child 114)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child114",
    stanzaIndex: 0,
  },
  // --- Sir Andrew Barton (Child 167) ---
  {
    text: "As it befell in midsummer-time,\nWhen birds sing sweetly on every tree.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning"],
    season: ["summer"],
    lyricsKey: "child167",
    stanzaIndex: 0,
  },
  {
    text: "When Flora, with her fragrant flowers,\nBedecked the earth so trim and gay,\nAnd Neptune, with his dainty showers,\nCame to present the month of May.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["spring"],
    lyricsKey: "child167",
    stanzaIndex: 1,
  },
  {
    text: "Lord Howard then, of courage bold,\nWent to the sea with pleasant cheer,\nNot curbed with winter's piercing cold,\nThough it was the stormy time of the year.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["winter"],
    lyricsKey: "child167",
    stanzaIndex: 3,
  },
  {
    text: "With pikes, and guns, and bowmen bold,\nThis noble Howard is gone to the sea,\nOn the day before Midsummer's Eve,\nAnd out at Thames mouth sailed they.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["evening"],
    season: ["summer"],
    lyricsKey: "child167",
    stanzaIndex: 4,
  },
  // --- Mary Hamilton (Child 173) ---
  {
    text: "Last night Queen Mary had four Maries,\nThis night she'll have but three;\nThere was Mary Seaton and Mary Beaton,\nAnd Mary Carmichael, and me.",
    source: "Mary Hamilton (Child 173)",
    time: ["night"],
    season: [],
    lyricsKey: "child173",
    stanzaIndex: 0,
  },
  {
    text: "Last night I washed Queen Mary's feet,\nAnd bore her to her bed;\nThis day she's given me my reward,\nThis gallows-tree to tread.",
    source: "Mary Hamilton (Child 173)",
    time: ["morning", "afternoon"],
    season: [],
    lyricsKey: "child173",
    stanzaIndex: 1,
  },
  // --- The Death of Parcy Reed (Child 193) ---
  {
    text: "They hunted high, they hunted low,\nThey hunted up, they hunted down,\nUntil the day was past the prime,\nAnd it grew late in the afternoon.",
    source: "The Death of Parcy Reed (Child 193)",
    time: ["afternoon"],
    season: [],
    lyricsKey: "child193",
    stanzaIndex: 3,
  },
  // --- Thomas Rymer (Child 37) ---
  {
    text: "And see not ye that bonny road,\nWhich winds about the fernie brae?\nThat is the road to fair Elfland,\nWhere you and I this night maun gae.",
    source: "Thomas Rymer (Child 37)",
    time: ["night"],
    season: [],
    lyricsKey: "child37",
    stanzaIndex: 13,
    // notes: "Version A stanza 14. No modernization needed."
  },
  // --- The Fair Flower of Northumberland (Child 9) ---
  {
    text: "Thus rode she all one winter's night,\nTill Edenborow they saw in sight.",
    source: "The Fair Flower of Northumberland (Child 9)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child9",
    stanzaIndex: 17,
    // notes: "Child 9 = The Fair Flower of Northumberland (not The Fause Knight, a common mix-up). No modernization needed."
  },
  // --- Clerk Colvill (Child 42) ---
  {
    text: "And he is on to Clyde's water,\nBy the lee light of the moon.",
    source: "Clerk Colvill (Child 42)",
    time: ["night"],
    season: [],
    lyricsKey: "child42",
    stanzaIndex: 12,
    // notes: "Version C stanza 5. 'An'→'And', 'licht'→'light', 'o'→'of'."
  },
  // --- Proud Lady Margaret (Child 47) ---
  {
    text: "Twas on a night, an evening bright,\nWhen the dew began to fall,\nLady Margaret was walking up and down,\nLooking o'er her castle wall.",
    source: "Proud Lady Margaret (Child 47)",
    time: ["evening"],
    season: [],
    lyricsKey: "child47",
    stanzaIndex: 0,
    // notes: "Version A stanza 1. 'fa'→'fall'."
  },
  {
    text: "There was a knight, in a summer's night,\nAppeared in a lady's hall,\nAs she was walking up and down,\nLooking o'er her castle wall.",
    source: "Proud Lady Margaret (Child 47)",
    time: ["night"],
    season: ["summer"],
    lyricsKey: "child47",
    stanzaIndex: 18,
    // notes: "Version B stanza 1. No modernization needed."
  },
  // --- The Bonny Hind (Child 50) ---
  {
    text: "It's May she comes and May she goes,\nDown by the garden green,\nIt's there she spied a good young squire,\nAs good as e'er she seen.",
    source: "The Bonny Hind (Child 50)",
    time: ["morning", "afternoon"],
    season: ["spring"],
    lyricsKey: "child50",
    stanzaIndex: 0,
  },
  // --- Child Waters (Child 63) ---
  {
    text: "Lord John's mother in her bower\nWas sitting all alone;\nWhen in the silence of the night\nShe heard fair Ellen's moan.",
    source: "Child Waters (Child 63)",
    time: ["night"],
    season: [],
    lyricsKey: "child63",
    stanzaIndex: 7,
  },
  // --- Clerk Saunders (Child 69) ---
  {
    text: "They baith lay still, and slept sound,\nUntil the sun began to sheen;\nShe drew the curtains a wee bit,\nAnd dull and drowsy was his een.",
    source: "Clerk Saunders (Child 69)",
    time: ["morning"],
    season: [],
    lyricsKey: "child69",
    stanzaIndex: 16,
    // notes: "een = Scots for 'eyes'. Light modernisation: sleeped→slept, Untill→Until, drowsie→drowsy."
  },
  // --- Willie and Lady Maisry (Child 70) ---
  {
    text: "You must come into my bower\nWhen the evening bells do ring,\nAnd you must come into my bower\nWhen the evening mass doth sing.",
    source: "Willie and Lady Maisry (Child 70)",
    time: ["evening"],
    season: [],
    lyricsKey: "child70",
    stanzaIndex: 3,
  },
  // --- Sweet William's Ghost (Child 77) ---
  {
    text: "O cocks are crowing at merry midnight,\nAnd the wild fowls herald the day;\nGive me my faith and troth again,\nAnd let me fare me on my way.",
    source: "Sweet William's Ghost (Child 77)",
    time: ["night"],
    season: [],
    lyricsKey: "child77",
    stanzaIndex: 9,
    // notes: "Modernised: 'a merry midnight'→'at merry midnight'; 'are boding day'→'herald the day'."
  },
  // --- The Wife of Usher's Well (Child 79) ---
  {
    text: "Up then crew the red, red cock,\nAnd up and crew the gray;\nThe eldest to the youngest said,\n'Tis time we were away.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["morning"],
    season: [],
    lyricsKey: "child79",
    stanzaIndex: 8,
    // notes: "Kept alongside #24 — different stanza, different texture. #24 is warm and narrative; this is abrupt and elegiac."
  },
  {
    text: "It fell about the Martinmas,\nWhen nights are lang and mirk,\nThe carlin wife's three sons came home,\nAnd their hats were of the birch.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child79",
    stanzaIndex: 0,
    // notes: "Replaces retired #22 (two-line fragment). hame→home; o the birk→of the birch. 'carlin'=old woman; 'mirk'=dark. Hats of birch signal the sons have come from Paradise."
  },
  // --- Little Musgrave and Lady Barnard (Child 81) ---
  {
    text: "Methinks I hear the thresel-cock,\nMethinks I hear the jay;\nMethinks I hear my lord Barnard,\nAnd I would I were away.",
    source: "Little Musgrave and Lady Barnard (Child 81)",
    time: ["morning"],
    season: [],
    lyricsKey: "child81",
    stanzaIndex: 14,
    // notes: "thresel=throstle (song thrush). jaye→jay. Kept 'thresel' for atmosphere."
  },
  // --- The Clerk's Twa Sons o Owsenford (Child 72) ---
  {
    text: "The bonny clerks they died that morn,\nTheir loves died lang ere noon.",
    source: "The Clerk's Twa Sons o Owsenford (Child 72)",
    time: ["morning"],
    season: [],
    lyricsKey: "child72",
    stanzaIndex: 13,
    // notes: "'clerks'=scholars/students. 'lang ere noon'=long before noon. No modernization: 'lang' kept for Scots sound."
  },
  // --- The Bonny Birdy (Child 82) ---
  {
    text: "There was a knight, in a summer's night,\nWas riding o'er the lee,\nAnd there he saw a bonny birdy,\nWas singing upon a tree.",
    source: "The Bonny Birdy (Child 82)",
    time: ["night"],
    season: ["summer"],
    lyricsKey: "child82",
    stanzaIndex: 0,
    // notes: "Version A stanza 1. 'oer'→'o'er'. Opening line shared with Child 47 Version B (#45) — different ballads, accepted."
  },
  // --- Young Benjie (Child 86) ---
  {
    text: "And he was stout, and proud-hearted,\nAnd thought it bitterly,\nAnd he's gone by the wan moonlight\nTo meet his Marjorie.",
    source: "Young Benjie (Child 86)",
    time: ["night"],
    season: [],
    lyricsKey: "child86",
    stanzaIndex: 3,
    // notes: "Version A stanza 4. 'ot'→'it'; 'hes gaen'→'he's gone'."
  },
  // --- Child Maurice (Child 83) ---
  {
    text: "The one was killed in the morning air,\nHis mother died at eve,\nAnd ere the morning bells were rung,\nThe threesome were all gone.",
    source: "Child Maurice (Child 83)",
    time: ["morning", "evening"],
    season: [],
    lyricsKey: "child83",
    stanzaIndex: 22,
    // notes: "Version D stanza 30. 'mornin'→'morning' (twice); 'een'→'eve'; 'or'→'ere'; 'was rung'→'were rung'; 'a gane'→'all gone'."
  },
  // --- Lady Alice (Child 85) ---
  {
    text: "Lady Alice was sitting in her bower-window,\nMending her midnight coif,\nAnd there she saw as fine a corpse\nAs ever she saw in her life.",
    source: "Lady Alice (Child 85)",
    time: ["night"],
    season: [],
    lyricsKey: "child85",
    stanzaIndex: 0,
    // notes: "Version A stanza 1. 'quoif'→'coif'."
  },
  {
    text: "O lay him down gently, ye six men tall,\nAll on the grass so green,\nAnd tomorrow, when the sun goes down,\nLady Alice a corpse shall be seen.",
    source: "Lady Alice (Child 85)",
    time: ["evening"],
    season: [],
    lyricsKey: "child85",
    stanzaIndex: 2,
    // notes: "Version A stanza 3. No modernisation needed."
  },
  // --- The Lass of Roch Royal (Child 76) ---
  {
    text: "When the cock had crawn, and day did dawn,\nAnd the sun began to peep,\nThen it rose him Love Gregor,\nAnd sorely did he weep.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["morning"],
    season: [],
    lyricsKey: "child76",
    stanzaIndex: 9,
    // notes: "Version F. 'raise'→'rose'; 'sair, sair'→'sorely'. New stanza — distinct from existing #18 and #19 from same ballad."
  },
  // --- Old Robin of Portingale (Child 80) ---
  {
    text: "And about the middle time of the night\nCame twenty-four good knights in;\nSir Gyles he was the foremost man,\nSo well he knew that gin.",
    source: "Old Robin of Portingale (Child 80)",
    time: ["night"],
    season: [],
    lyricsKey: "child80",
    stanzaIndex: 22,
    // notes: "Stanza 23. Light spelling modernisation only. 'gin' = scheme/trap."
  },
  // --- Jellon Grame (Child 90) ---
  {
    text: "Win up, my bonny boy, he says,\nAs quick as ever you may;\nFor ye maun gang for Lillie Flower,\nBefore the break of day.",
    source: "Jellon Grame (Child 90)",
    time: ["night"],
    season: [],
    lyricsKey: "child90",
    stanzaIndex: 1,
    // notes: "Stanza 2. 'eer'→'ever'."
  },
  // --- The Gay Goshawk (Child 96) ---
  {
    text: "And well he knew that lady fair\nAmong her maidens free,\nFor the flower that springs in May morning\nWas not so sweet as she.",
    source: "The Gay Goshawk (Child 96)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child96",
    stanzaIndex: 11,
    // notes: "Version E stanza 12. 'kent'→'knew'; 'ladye feir'→'lady fair'."
  },
  // --- The Battle of Otterburn (Child 161) ---
  {
    text: "It fell about the Lammas tide,\nWhen the muir-men win their hay,\nThe doughty Douglas bound him to ride\nInto England, to drive a prey.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child161",
    stanzaIndex: 0,
    // notes: "Version C stanza 1. Lammas = early August harvest festival. No modernisation needed."
  },
  {
    text: "But up then spake a little page,\nBefore the peep of dawn:\nO waken ye, waken ye, my good lord,\nFor Percy's hard at hand.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["night"],
    season: [],
    lyricsKey: "child161",
    stanzaIndex: 13,
    // notes: "Version C stanza 17. No modernisation needed."
  },
  {
    text: "This deed was done at Otterburn,\nAbout the breaking of the day;\nEarl Douglas was buried at the bracken-bush,\nAnd Percy led captive away.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["morning"],
    season: [],
    lyricsKey: "child161",
    stanzaIndex: 17,
    // notes: "Version B stanza 14. No modernisation needed."
  },
  // --- Jamie Douglas (Child 204) ---
  {
    text: "In the morning when I arose,\nMy bonnie palace for to see,\nI came unto my lord's room-door,\nBut he would not speak one word to me.",
    source: "Jamie Douglas (Child 204)",
    time: ["morning"],
    season: [],
    lyricsKey: "child204",
    stanzaIndex: 5,
    // notes: "Version G stanza 6. No modernisation needed."
  },
  {
    text: "O waly, waly up the bank!\nAnd waly, waly down the brae!\nAnd waly, waly by yon burn-side,\nWhere me and my love were wont to gae!",
    source: "Jamie Douglas (Child 204)",
    time: ["morning", "afternoon"],
    season: [],
    lyricsKey: "child204",
    stanzaIndex: 0,
    // notes: "Version H stanza 1 ('Waly Waly'). 'waly' = cry of lamentation. No modernisation needed."
  },
  // --- The Braes o Yarrow (Child 214) ---
  {
    text: "Late in the evening, drinking the wine,\nOr early in the morning,\nThey set a combat them between,\nTo fight it out in the dawning.",
    source: "The Braes o Yarrow (Child 214)",
    time: ["evening", "morning"],
    season: [],
    lyricsKey: "child214",
    stanzaIndex: 0,
    // notes: "Version F stanza 1. 'eenin'→'evening'."
  },
  // --- The Daemon Lover (Child 243) ---
  {
    text: "O sleep ye, wake ye, my husband?\nI wish ye wake in time!\nI would not for ten thousand pounds\nThis night ye knew my mind.",
    source: "The Daemon Lover (Child 243)",
    time: ["night"],
    season: [],
    lyricsKey: "child243",
    stanzaIndex: 11,
    // notes: "Version C stanza 12. No modernisation needed."
  },
  // --- The Grey Cock (Child 248) ---
  {
    text: "It's now ten at night, and the stars give no light,\nAnd the bells they ring ding, dang;\nHe's met with some delay that caused him to stay,\nBut he will be here ere lang.",
    source: "The Grey Cock (Child 248)",
    time: ["night"],
    season: [],
    lyricsKey: "child248",
    stanzaIndex: 1,
    // notes: "Version A stanza 2. 'gie'→'give'. 'ere lang'=before long."
  },
  {
    text: "Flee, flee up, my bonny grey cock,\nAnd crow when it is day;\nYour neck shall be like the bonny beaten gold,\nAnd your wings of the silver grey.",
    source: "The Grey Cock (Child 248)",
    time: ["morning"],
    season: [],
    lyricsKey: "child248",
    stanzaIndex: 5,
    // notes: "Version A stanza 6. No modernisation needed."
  },
  // --- The Gypsy Laddie (Child 200) ---
  {
    text: "Yestreen I lay in a well-made bed,\nAnd my good lord beside me;\nThis night I'll lie in a tenant's barn,\nWhatever shall betide me.",
    source: "The Gypsy Laddie (Child 200)",
    time: ["night"],
    season: [],
    lyricsKey: "child200",
    stanzaIndex: 3,
    // notes: "Version A stanza 4. 'yestreen'=last night. No modernisation needed."
  },
  {
    text: "Now when our lord came home at even,\nHe speired for his fair lady;\nThe ane she cried, the tither replied,\nShe's awa wi the gypsy laddie.",
    source: "The Gypsy Laddie (Child 200)",
    time: ["evening"],
    season: [],
    lyricsKey: "child200",
    stanzaIndex: 7,
    // notes: "Version F stanza 8. 'een'→'even'. 'speired'=asked."
  },
  // --- Brown Adam (Child 98) ---
  {
    text: "It was late, late in the evening,\nLate, late in the afternoon,\nThere came a knight to Brown Adam's house,\nAnd he was clad all in brown.",
    source: "Brown Adam (Child 98)",
    time: ["evening", "afternoon"],
    season: [],
    lyricsKey: "child98",
    stanzaIndex: 0,
    // notes: "Opening stanza. No modernisation needed."
  },
  // --- Johnie Scot (Child 99) ---
  {
    text: "O up then rose him Johnie Scot,\nAn hour before the day,\nAnd he is on to Fair Ellen's bower,\nTo hear what she did say.",
    source: "Johnie Scot (Child 99)",
    time: ["night"],
    season: [],
    lyricsKey: "child99",
    stanzaIndex: 2,
    // notes: "Version A. Pre-dawn rising stanza. No modernisation needed."
  },
  // --- Rose the Red and White Lily (Child 103) ---
  {
    text: "She hadna been in fair France\nA twelvemonth and a day,\nTill there she heard the morning drum\nBeat out at break of day.",
    source: "Rose the Red and White Lily (Child 103)",
    time: ["morning"],
    season: [],
    lyricsKey: "child103",
    stanzaIndex: 13,
    // notes: "No modernisation needed."
  },
  // --- Sir Hugh, or, The Jew's Daughter (Child 155) ---
  {
    text: "She's taen him to her cellar dark,\nAt the hour o midnight keen;\nShe's stabbed him with a little penknife,\nAnd put him in the well sae deep.",
    source: "Sir Hugh, or, The Jew's Daughter (Child 155)",
    time: ["night"],
    season: [],
    lyricsKey: "child155",
    stanzaIndex: 7,
    // notes: "Version B. 'o midnight keen' = of sharp/bitter midnight. No modernisation needed."
  },
  // --- The Famous Flower of Serving-Men (Child 106) ---
  {
    text: "She dressed herself in man's array,\nAnd to the king's court took her way,\nShe rode till she came to the palace gate,\nOne morning when it was late.",
    source: "The Famous Flower of Serving-Men (Child 106)",
    time: ["morning"],
    season: [],
    lyricsKey: "child106",
    stanzaIndex: 4,
    // notes: "No modernisation needed."
  },
  // --- The Baffled Knight (Child 112) ---
  {
    text: "As I went out one May morning,\nTo view the fields and meadows gay,\nI met a maid came out of the wood,\nAnd she had lost her way.",
    source: "The Baffled Knight (Child 112)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child112",
    stanzaIndex: 0,
    // notes: "No modernisation needed."
  },
  // --- Robin Hood and the Monk (Child 119) ---
  {
    text: "John early in a May morning,\nLooking his shoes upon,\nHe took him to Nottingham,\nTo matins all alone.",
    source: "Robin Hood and the Monk (Child 119)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child119",
    stanzaIndex: 8,
    // notes: "Version A. 'morow'→'morning'. 'Much' (the miller's son) rendered as 'John' in this version."
  },
  // --- Durham Field (Child 159) ---
  {
    text: "The sixth of August the muster was,\nEarly in a morning clear;\nOur English archers their bows did bend,\nAnd many a black blade did appear.",
    source: "Durham Field (Child 159)",
    time: ["morning"],
    season: [],
    lyricsKey: "child159",
    stanzaIndex: 0,
    // notes: "'black blade' substituted for 'black bill' (a pole weapon with blackened blade) for readability. No other modernisation."
  },
  // --- Henry Martyn (Child 250) ---
  {
    text: "He had not been sailing but a short winter's night,\nAnd part of a short winter's day,\nWhen he espied a lofty ship,\nCome sailing all along that way.",
    source: "Henry Martyn (Child 250)",
    time: ["night", "morning", "afternoon"],
    season: ["winter"],
    lyricsKey: "child250",
    stanzaIndex: 2,
    // notes: "No modernisation needed."
  },
  // --- The Kitchie Boy (Child 252) ---
  {
    text: "The day it is gone, and the night's come on,\nAnd the King's court it is begun;\nAll the ladies in the court are going to bed,\nAnd it's time that I were gone.",
    source: "The Kitchie Boy (Child 252)",
    time: ["evening"],
    season: [],
    lyricsKey: "child252",
    stanzaIndex: 9,
    // notes: "No modernisation needed."
  },
  // --- Willie's Lyke-Wake (Child 255) ---
  {
    text: "About the dead hour of the night\nShe heard the bridles ring;\nAnd Janet was as glad of that\nAs any earthly thing.",
    source: "Willie's Lyke-Wake (Child 255)",
    time: ["night"],
    season: [],
    lyricsKey: "child255",
    stanzaIndex: 9,
    // notes: "No modernisation needed."
  },
  // --- The Knight's Ghost (Child 265) ---
  {
    text: "She looked over her castle wall,\nTo see what she might see;\nShe spied her own dear lord\nCome riding over the lee,\nAt the dead hour of the night.",
    source: "The Knight's Ghost (Child 265)",
    time: ["night"],
    season: [],
    lyricsKey: "child265",
    stanzaIndex: 0,
    // notes: "'deid'→'dead'. No other modernisation."
  },
  // --- The Suffolk Miracle (Child 272) ---
  {
    text: "A young man riding in the night,\nHis journey for to take,\nHe rode until the morning light,\nFor his true love's sake.",
    source: "The Suffolk Miracle (Child 272)",
    time: ["night", "morning"],
    season: [],
    lyricsKey: "child272",
    stanzaIndex: 0,
    // notes: "No modernisation needed."
  },
  // --- The Keach i the Creel (Child 281) ---
  {
    text: "But the night was dark, and the way was sair,\nAnd the morn came up on them unaware.",
    source: "The Keach i the Creel (Child 281)",
    time: ["night", "morning"],
    season: [],
    lyricsKey: "child281",
    stanzaIndex: 6,
    // notes: "'sair' kept for Scots sound (=sore/hard). No other modernisation."
  },
  // --- Trooper and Maid (Child 299) ---
  {
    text: "When the trumpet sounds to horse and away,\nEarly in the morning,\nLeave thy bed and leave thy beau,\nEarly in the morning.",
    source: "Trooper and Maid (Child 299)",
    time: ["morning"],
    season: [],
    lyricsKey: "child299",
    stanzaIndex: 0,
    // notes: "No modernisation needed."
  },
  // --- The Broom of Cowdenknows (Child 305) ---
  {
    text: "There was a troop of merry gentlemen\nWere riding tween twa knowes;\nThey swore they smelled a bonny lass,\nAs they came by the broom of Cowdenknows.\nIt's up then spake the foremost man,\nSaid, I see her standing there;\nA bonny lass in a green mantle,\nCombing down her yellow hair,\nEarly on a May morning.",
    source: "The Broom of Cowdenknows (Child 305)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child305",
    stanzaIndex: 0,
    // notes: "'twa knowes'=two hills. No modernisation needed."
  },
  // ── sharp (─────────────────────────────────────────────)
  // --- Blow Away the Morning Dew (Sharp 19) ---
  {
    text: "There was a farmer's son, kept sheep all on the hill,\nAnd he walked out one May morning to see what he could kill.",
    source: "Blow Away the Morning Dew (Sharp 19)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp19",
    stanzaIndex: 0,
    // notes: "Opening stanza. Sharp's version of Child 112 / The Baffled Knight."
  },
  // --- The Lark in the Morn (Sharp 62) ---
  {
    text: "The lark in the morning she rises from her nest,\nShe mounts into the air with the dew round her breast;\nAnd at night she will return to her own nest again.",
    source: "The Lark in the Morn (Sharp 62)",
    time: ["morning", "night"],
    season: [],
    lyricsKey: "sharp62",
    stanzaIndex: 1,
    // notes: "Chorus stanza. Morning rise and night return both explicit."
  },
  // --- Searching for Lambs (Sharp 48) ---
  {
    text: "As I went out one May morning,\nOne May morning betime,\nI met a maid, from home had strayed\nJust as the sun did shine.",
    source: "Searching for Lambs (Sharp 48)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp48",
    stanzaIndex: 0,
    // notes: "Opening stanza. 'betime' = early."
  },
  // --- The Sweet Primeroses (Sharp 51) ---
  {
    text: "As I walked out one midsummer's morning\nFor to view the fields and to take the air,\nDown by the banks of the sweet primeroses,\nThere I beheld a most lovely fair.",
    source: "The Sweet Primeroses (Sharp 51)",
    time: ["morning"],
    season: ["summer"],
    lyricsKey: "sharp51",
    stanzaIndex: 0,
    // notes: "Opening stanza. Explicit morning and midsummer."
  },
  // --- The Seeds of Love (Sharp 33) ---
  {
    text: "I sowed the seeds of love,\nAnd I sowed them in the spring;\nI gathered them up in the morning so soon,\nWhile the small birds so sweetly sing.",
    source: "The Seeds of Love (Sharp 33)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp33",
    stanzaIndex: 0,
    // notes: "Opening stanza. First song Sharp ever collected (1903)."
  },
  // --- The Cuckoo (Sharp 35) ---
  {
    text: "The cuckoo is a pretty bird, she singeth as she flies,\nShe bringeth us good tidings, she telleth us no lies;\nShe sucketh white flowers to make her voice clear,\nAnd the more she cries 'cuckoo,' the summer draweth near.",
    source: "The Cuckoo (Sharp 35)",
    time: [],
    season: ["spring"],
    lyricsKey: "sharp35",
    stanzaIndex: 0,
    // notes: "Opening stanza. Cuckoo as herald of approaching summer; tagged spring."
  },
  // --- The Trees They Do Grow High (Sharp 25) ---
  {
    text: "And so early in the morning, at the dawning of the day,\nThey went out into the hayfield to have some sport and play.",
    source: "The Trees They Do Grow High (Sharp 25)",
    time: ["morning"],
    season: ["summer"],
    lyricsKey: "sharp25",
    stanzaIndex: 4,
    // notes: "Mid-narrative stanza. Hayfield = summer context. Works as standalone morning image."
  },
  // --- Green Bushes (Sharp 40) ---
  {
    text: "As I was walking one morning in May,\nTo hear the birds whistle and the nightingales sing,\nI saw a young damsel, so sweetly sang she,\nDown by the green bushes he thinks to meet me.",
    source: "Green Bushes (Sharp 40)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp40",
    stanzaIndex: 0,
    // notes: "Opening stanza. Explicit morning and May."
  },
  // --- Dabbling in the Dew (Sharp 44) ---
  {
    text: "Oh, where are you going to, my pretty little dear,\nWith your red rosy cheeks and your coal black hair?\nI'm going a-milking, kind sir, she answered me,\nAnd it's dabbling in the dew makes the milkmaids fair.",
    source: "Dabbling in the Dew (Sharp 44)",
    time: ["morning"],
    season: [],
    lyricsKey: "sharp44",
    stanzaIndex: 0,
    // notes: "Opening stanza. Morning tagged by strong dew/milkmaid-at-dawn cultural association."
  },
  // --- I'm Seventeen Come Sunday (Sharp 61) ---
  {
    text: "As I walked out on a May morning,\nOn a May morning so early,\nI overtook a pretty fair maid\nJust as the day was a-dawning.",
    source: "I'm Seventeen Come Sunday (Sharp 61)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp61",
    stanzaIndex: 0,
    // notes: "Opening stanza. Sharp's cleaned-up version. Explicit morning and May."
  },
  // --- Farewell Nancy (Sharp 30) ---
  {
    text: "Fare you well, my dearest Nancy,\nFor now I must leave you,\nAll across the salt seas\nI am bound for to go;\nDon't let my long absence\nTrouble and grieve you,\nFor I shall return in the spring,\nAs you know.",
    source: "Farewell Nancy (Sharp 30)",
    time: [],
    season: ["spring"],
    lyricsKey: "sharp30",
    stanzaIndex: 0,
    // notes: "Opening stanza. 'Return in the spring' is the emotional core and seasonal marker."
  },
  // --- The Low Low Lands of Holland (Sharp 23) ---
  {
    text: "There's not a swathe goes round my waist,\nNor a comb goes in my hair,\nNeither firelight nor candlelight\nCan ease my heart's despair.",
    source: "The Low Low Lands of Holland (Sharp 23)",
    time: ["night"],
    season: [],
    lyricsKey: "sharp23",
    stanzaIndex: 3,
    // notes: "Night tagged via firelight/candlelight imagery — domestic evening scene being renounced."
  },
];

// ============================================================
//  LYRICS LIBRARY
//  Each key matches the lyricsKey on a quote object.
//  stanzas: array of strings, one per stanza (use \n for line breaks within a stanza).
//  The stanzaIndex on each quote points into this array — that stanza is highlighted.
//
//  To add a ballad:
//    1. Add an entry here with title, version, and stanzas array.
//    2. Add lyricsKey and stanzaIndex to every quote from that ballad in QUOTES above.
// ============================================================
const LYRICS = {
  "child26": {
    title: "The Three Ravens",
    childNumber: "Child 26",
    version: "Traditional (Percy's Reliques, 1765)",
    stanzas: [
      "There were three ravens sat on a tree,\nDown a down, hay down, hay down,\nThere were three ravens sat on a tree,\nWith a down,\nThere were three ravens sat on a tree,\nThey were as black as they might be,\nWith a down, derry, derry, derry, down, down.",
      "The one of them said to his mate,\n'Where shall we our breakfast take?'\nWith a down, derry, derry, derry, down, down.",
      "'Down in yonder green field,\nThere lies a knight slain under his shield.'",
      "'His hounds they lie down at his feet,\nSo well they can their master keep.'",
      "'His hawks they fly so eagerly,\nNo other fowl dare him come nigh.'",
      "Down there comes a fallow doe,\nAs great with fawn as she might go.",
      "She lifted up his bleeding head,\nAnd kissed his wounds that were so red.",
      "She got him up upon her back,\nAnd carried him to earthen lake.",
      "She buried him before the prime,\nShe died herself ere evening time.",
      "God send every gentleman,\nSuch hawks, such hounds, and such a leman.",
    ],
  },

  "child1": {
    title: "Riddles Wisely Expounded",
    childNumber: "Child 1",
    version: "Version A (Broadside, Rawlinson Collection)",
    stanzas: [
      "There was a lady of the North Country,\nAnd she had lovely daughters three.",
      "There was a knight of noble worth\nWhich also lived in the North.",
      "The knight, of courage stout and brave,\nA wife he did desire to have.",
      "He knocked at the lady's gate,\nOne evening when it was late.",
      "The eldest sister let him in,\nAnd pinned the door with a silver pin.",
      "The second sister she made his bed,\nAnd laid soft pillows under his head.",
      "The youngest daughter that same night,\nShe went to bed to this young knight.",
      "And in the morning, when it was day,\nThese words unto him she did say:\n'Now you have had your will,' quoth she,\n'I pray, sir knight, will you marry me?'",
      "The young brave knight to her replied,\n'Thy suit, fair maid, shall not be denied.\nIf thou canst answer me questions three,\nThis very day will I marry thee.'",
      "'Kind sir, in love, O then,' quoth she,\n'Tell me what your three questions be.'",
      "'O what is longer than the way,\nOr what is deeper than the sea?\nOr what is louder than the horn,\nOr what is sharper than a thorn?\nOr what is greener than the grass,\nOr what is worse than a woman was?'",
      "'O love is longer than the way,\nAnd hell is deeper than the sea.\nAnd thunder is louder than the horn,\nAnd hunger is sharper than a thorn.\nAnd poison is greener than the grass,\nAnd the Devil is worse than woman was.'",
      "When she these questions answered had,\nThe knight became exceeding glad.\nAnd having truly tried her wit,\nHe much commended her for it.",
      "And after, as it is verified,\nHe made of her his lovely bride.\nSo now, fair maidens all, adieu,\nThis song I dedicate to you.",
      "I wish that you may constant prove\nUnto the man that you do love.",
    ],
  },

  "child4": {
    title: "Lady Isabel and the Elf-Knight",
    childNumber: "Child 4",
    version: "Version A / Version F composite",
    stanzas: [
      "Fair lady Isabel sits in her bower sewing,\nThere she heard an elf-knight blowing his horn,\nThe first morning in May.",
      "'If I had yon horn that I hear blowing,\nAnd yon elf-knight to sleep in my bosom.'",
      "This maiden had scarcely these words spoken,\nTill in at her window the elf-knight has leapt.",
      "'It's a very strange matter, fair maiden,' said he,\n'I cannot blow my horn but ye call on me.'",
      "'But will ye go to yon greenwood side?\nIf ye canna gang, I will cause you to ride.'",
      "He leapt on a horse, and she on another,\nAnd they rode on to the greenwood together.",
      "'Light down, light down, lady Isabel,' said he,\n'We are come to the place where ye are to die.'",
      "'Have mercy, have mercy, kind sir, on me,\nTill once my dear father and mother I see.'",
      "'Seven kings' daughters here have I slain,\nAnd ye shall be the eighth of them.'",
      "'O sit down a while, lay your head on my knee,\nThat we may have some rest before that I die.'",
      "She stroked him sae fast, and she stroked him sae slee,\nThat she stroked him fast on to sleep.",
      "Then she took up his bright shining sword,\nAnd laid it across her own white knee.",
      "She rode on his steed and she led the grey,\nAnd she rode till she came to her father's ha.",
      "She rode till she came to the sweet river side,\nThree hours before it was day.",
    ],
  },

  "child9": {
    title: "The Fair Flower of Northumberland",
    childNumber: "Child 9",
    version: "Version A (Deloney's Jack of Newbury, 1597)",
    stanzas: [
      "It was a knight in Scotland born,\nWas taken prisoner, and left forlorn,\nEven by the good Earl of Northumberland.",
      "Then was he cast in prison strong,\nWhere he could not walk nor lie along,\nEven by the good Earl of Northumberland.",
      "And as in sorrow thus he lay,\nThe Earl's sweet daughter walked that way,\nAnd she the fair flower of Northumberland.",
      "And passing by, like an angel bright,\nThe prisoner had of her a sight,\nAnd she the fair flower of Northumberland.",
      "And loud to her this knight did cry,\nThe salt tears standing in his eye,\nAnd she the fair flower of Northumberland.",
      "'Fair lady, take pity on me,\nAnd let me not in prison die,\nAnd you the fair flower of Northumberland.'",
      "'Fair Sir, how should I take pity on thee,\nThou being a foe to our country,\nAnd I the fair flower of Northumberland?'",
      "'Fair lady, I am no foe,' he said,\n'Through thy sweet love here was I stayed,\nFor thee, the fair flower of Northumberland.'",
      "'Why shouldst thou come here for love of me,\nHaving wife and children in thy country?\nAnd I the fair flower of Northumberland.'",
      "'I swear by the blessed Trinity,\nI have no wife nor children, I,\nNor dwelling at home in merry Scotland.'",
      "'If courteously you will set me free,\nI vow that I will marry thee,\nSo soon as I come in fair Scotland.'",
      "'Thou shalt be a lady of castles and towers,\nAnd sit like a queen in princely bowers,\nWhen I am at home in fair Scotland.'",
      "Then parted hence this lady gay,\nAnd got her father's ring away,\nTo help this knight into fair Scotland.",
      "She got the keys of the prison strong,\nAnd released him who had lain so long,\nThis knight from the Earl of Northumberland.",
      "A gallant steed he did bestride,\nAnd with the lady away did ride,\nAnd she the fair flower of Northumberland.",
      "They rode till they came to a water clear:\n'Good Sir, how should I follow you here,\nAnd I the fair flower of Northumberland?'",
      "The lady pricked her wanton steed,\nAnd over the river swam with speed,\nAnd she the fair flower of Northumberland.",
      "Thus rode she all one winter's night,\nTill Edenborough they saw in sight,\nAnd she the fair flower of Northumberland.",
      "Now he had a wife and children five,\nIn Edinburgh city who did thrive,\nIn spite of the fair flower of Northumberland.",
      "'Go get thee home, thou false knight's whore,\nOf me thou shalt obtain no more,\nGo get thee home to Northumberland.'",
      "She fell down humbly on her knee,\nCrying, 'Courteous knight, take pity on me,\nAnd I the fair flower of Northumberland.'",
      "At length two knights came riding by,\nTwo gallant knights of fair England,\nAnd they the fair flowers of England.",
      "She fell down humbly on her knee,\nSaying, 'Courteous knights, take pity on me,\nAnd I the fair flower of Northumberland.'",
      "They took her up behind them then,\nAnd brought her to her father again,\nAnd he the good Earl of Northumberland.",
      "'All you fair maidens be warned by me,\nScots were never true, nor never will be,\nTo lord, nor lady, nor fair England.'",
    ],
  },

  "child35": {
    title: "Allison Gross",
    childNumber: "Child 35",
    version: "Version A (Mrs Brown of Falkland, c.1783)",
    stanzas: [
      "O Allison Gross, that lives in yon tower,\nThe ugliest witch in the north country,\nHas tristed me one day up till her bower,\nAnd many fair speech she made to me.",
      "She stroked my head, and she combed my hair,\nAnd she set me down softly on her knee;\nSays, 'Gin ye will be my leman so true,\nSae many braw things as I would ye gi.'",
      "She showed me a mantle of red scarlet,\nWith golden flowers and fringes fine;\nSays, 'Gin ye will be my leman so true,\nThis goodly gift it shall be thine.'",
      "'Away, away, ye ugly witch,\nHold far away and let me be;\nI never will be your leman so true,\nAnd I wish I were out of your company.'",
      "She next brought a sark of the softest silk,\nWell wrought with pearls about the band;\nSays, 'Gin you will be my ain true love,\nThis goodly gift you shall command.'",
      "She showed me a cup of the good red gold,\nWell set with jewels so fair to see;\nSays, 'Gin you will be my leman so true,\nThis goodly gift I will you gi.'",
      "'Away, away, ye ugly witch,\nHold far away and let me be;\nFor I would not once kiss your ugly mouth\nFor all the gifts that ye could gi.'",
      "She's turned her right and round about,\nAnd thrice she blew on a grass-green horn;\nAnd she swore by the moon and the stars above\nThat she'd make me rue the day I was born.",
      "Then out she has taken a silver wand,\nAnd she's turned me three times round and round;\nShe's muttered such words till my strength it failed,\nAnd she's laid me down on the cold green ground.",
      "She turned me into an ugly worm,\nAnd made me toddle about the tree;\nAnd ay on every Saturday's night\nMy sister Maisry came to me,",
      "With silver basin and silver comb,\nTo comb my head upon her knee;\nBut before I had kissed her ugly mouth\nI'd sooner have toddled about the tree.",
      "But as it fell out on last Halloween,\nWhen the fairy court was riding by,\nThe queen lighted down on a daisy bank,\nNot far from the tree where I used to lie.",
      "She took me up in her milk-white hand,\nAnd she stroked me three times over her knee;\nShe changed me again to my ain proper shape,\nAnd I no more shall toddle about the tree.",
    ],
  },

  "child37": {
    title: "Thomas Rymer",
    childNumber: "Child 37",
    version: "Version A (Mrs Brown of Falkland, c.1800)",
    stanzas: [
      "True Thomas lay over yond grassy bank,\nAnd he beheld a lady gay,\nA lady that was brisk and bold,\nCome riding over the fernie brae.",
      "Her skirt was of the grass-green silk,\nHer mantle of the velvet fine;\nAt every lock of her horse's mane\nHung fifty silver bells and nine.",
      "True Thomas he took off his hat,\nAnd bowed him low down till his knee:\n'All hail, thou mighty Queen of Heaven!\nFor your peer on earth I never did see.'",
      "'O no, O no, True Thomas,' she says,\n'That name does not belong to me;\nI am but the queen of fair Elfland,\nAnd I'm come here for to visit thee.'",
      "'But ye maun go wi me now, Thomas,\nTrue Thomas, ye maun go wi me,\nFor ye maun serve me seven years,\nThrough weal or woe as may chance to be.'",
      "She turned about her milk-white steed,\nAnd took True Thomas up behind,\nAnd aye whenever her bridle rang,\nThe steed flew swifter than the wind.",
      "For forty days and forty nights\nHe waded through red blood to the knee,\nAnd he saw neither sun nor moon,\nBut heard the roaring of the sea.",
      "O they rode on, and further on,\nUntil they came to a garden green:\n'Light down, light down, ye lady free,\nSome of that fruit let me pull to thee.'",
      "'O no, O no, True Thomas,' she says,\n'That fruit may not be touched by thee,\nFor all the plagues that are in hell\nLight on the fruit of this country.'",
      "'But I have a loaf here in my lap,\nLikewise a bottle of claret wine,\nAnd now ere we go farther on,\nWe'll rest a while, and ye may dine.'",
      "When he had eaten and drunk his fill,\n'Lay down your head upon my knee,'\nThe lady said, 'ere we climb yon hill,\nAnd I will show you wonders three.'",
      "'O see not ye yon narrow road,\nSo thick beset with thorns and briars?\nThat is the path of righteousness,\nThough after it but few enquires.'",
      "'And see not ye that broad, broad road,\nThat lies across yon lily leven?\nThat is the path of wickedness,\nThough some call it the road to heaven.'",
      "'And see not ye that bonny road,\nWhich winds about the fernie brae?\nThat is the road to fair Elfland,\nWhere you and I this night maun gae.'",
      "'But Thomas, ye maun hold your tongue,\nWhatever you may hear or see,\nFor if one word you should chance to speak,\nYou will never get back to your own country.'",
      "He has gotten a coat of the even cloth,\nAnd a pair of shoes of velvet green,\nAnd till seven years were past and gone\nTrue Thomas on earth was never seen.",
    ],
  },

  "child42": {
    title: "Clerk Colvill",
    childNumber: "Child 42",
    version: "Version A / Version C composite",
    stanzas: [
      "Clerk Colvill and his lusty dame\nWere walking in the garden green;\nThe belt around her stately waist\nCost Clerk Colvill of pounds fifteen.",
      "'O promise me now, Clerk Colvill,\nOr it will cost ye muckle strife,\nRide never by the wells of Slane,\nIf ye would live and keep your life.'",
      "'Now speak no more, my lusty dame,\nNow speak no more of that to me;\nDid I never see a fair woman,\nBut I would sin with her body?'",
      "He's taken leave of his gay lady,\nNought minding what his lady said,\nAnd he's ridden by the wells of Slane,\nWhere washing was a bonny maid.",
      "'Wash on, wash on, my bonny maid,\nThat wash so clean your sark of silk;'\n'And well fare you, fair gentleman,\nYour body whiter than the milk.'",
      "Then loud cried the Clerk Colvill,\n'O my head it pains me sore;'\n'Then take, then take,' the maiden said,\n'And from my sark you'll cut a gore.'",
      "Then she's given him a little bone-knife,\nAnd from her sark he cut a share;\nShe's tied it round his pale white face,\nBut aye his head it ached more.",
      "Then louder cried the Clerk Colvill,\n'O sorer, sorer aches my head;'\n'And sorer, sorer ever will,'\nThe maiden cries, 'till you be dead.'",
      "Out then he drew his shining blade,\nThinking to strike her where she stood,\nBut she was vanished to a fish,\nAnd swam far off, a fair mermaid.",
      "'O mother, mother, braid my hair;\nMy lusty lady, make my bed;\nO brother, take my sword and spear,\nFor I have seen the false mermaid.'",
      "'Forbidden gin ye wad be, love Colin,\nForbidden gin ye wad be,\nAnd gang no more to Clyde's water,\nTo court yon gay ladie.'",
      "'Forbid me from your hall, mother,\nForbid me from your bower,\nBut forbid me not from yon ladie;\nShe's fair as any flower.'",
      "And he is on to Clyde's water,\nBy the lee light of the moon;\nAnd when he came to the Clyde's water\nHe lighted lowly down.",
      "And there he saw the mermaiden,\nWashing silk upon a stone.\n'Come down, come down now, Clerk Colin,\nCome down and fish with me.'",
      "'O mother, mother, make my bed,\nAnd, sister, lay me down;\nAnd brother, take my bow and shoot,\nFor my shooting is done.'",
      "'Will ye lie there and die, Clerk Colin,\nWill ye lie there and die?\nOr will ye gang to Clyde's water\nTo fish in flood with me?'\n'I will lie here and die,' he said,\n'I will lie here and die;\nIn spite of all the devils in hell\nI will lie here and die.'",
    ],
  },

  "child43": {
    title: "The Broomfield Hill",
    childNumber: "Child 43",
    version: "Version A (Herd's Manuscripts, 1769)",
    stanzas: [
      "There was a knight and a lady bright,\nHad a true tryst at the broom;\nThe one rode early in the morning,\nThe other in the afternoon.",
      "And aye she sat in her mother's bower door,\nAnd aye she made her moan:\n'O whether should I gang to the Broomfield Hill,\nOr should I stay at home?'",
      "'For if I gang to the Broomfield Hill,\nMy maidenhead is gone;\nAnd if I chance to stay at home,\nMy love will call me mansworn.'",
      "Up then spoke a witch-woman,\nAy from the room above:\n'O ye may gang to the Broomfield Hill,\nAnd yet come maiden home.'",
      "'For when ye gang to the Broomfield Hill,\nYou'll find your love asleep,\nWith a silver belt about his head,\nAnd a broom-bough at his feet.'",
      "'Take ye the blossom of the broom,\nThe blossom it smells sweet,\nAnd strew it at your true-love's head,\nAnd likewise at his feet.'",
      "'Take ye the rings off your fingers,\nPut them on his right hand,\nTo let him know, when he doth awake,\nHis love was at his command.'",
      "She pulled the blossom of the broom,\nThe blossom it smells sweet,\nAnd strewed it at her true-love's head,\nAnd likewise at his feet.",
      "And she's taken the rings off her fingers,\nAnd put them on his right hand,\nTo let him know, when he did awake,\nHis love was at his command.",
      "She pulled his sword from out the sheath,\nAnd thrust it in the ground,\nAnd took the steed from under him,\nAnd rode away full sound.",
      "Now when he woke from out his sleep,\nAn angry man was he;\nHe looked east, he looked west,\nHe wept full bitterly.",
      "'Where were ye, my good grey hawk,\nThat I did love so dear,\nThat ye didna wake me from my sleep\nWhen my true love was here?'",
      "'I clapped my wings, my master dear,\nYour slumber was so deep;\nI struck my talons in the bough\nBut still ye would not wake.'",
      "'I'm now so far from Broomfield Hill,\nAnd cannot turn again;\nHe'll know his rings when he awakes,\nAnd he'll never have me slain.'",
    ],
  },

  "child39": {
    title: "Tam Lin",
    childNumber: "Child 39",
    version: "Version A (Child's English and Scottish Popular Ballads)",
    stanzas: [
      "O I forbid you, maidens all,\nThat wear gowd on your hair,\nTo come or gae by Carterhaugh,\nFor young Tam Lin is there.",
      "There's none that gaes by Carterhaugh\nBut they leave him a wad,\nEither their rings, or green mantles,\nOr else their maidenhead.",
      "Janet has kilted her green kirtle\nA little aboon her knee,\nAnd she has braided her yellow hair\nA little aboon her bree,\nAnd she's awa to Carterhaugh,\nAs fast as she can hie.",
      "When she came to Carterhaugh\nTam Lin was at the well,\nAnd there she fand his steed standing,\nBut away was himsel.",
      "She had na pu'd a double rose,\nA rose but only tway,\nTill up then started young Tam Lin,\nSays, Lady, thou's pu nae mae.",
      "'Why pu's thou the rose, Janet,\nAnd why breaks thou the wand?\nOr why comes thou to Carterhaugh\nWithout my command?'",
      "'Carterhaugh, it is my ain,\nMy daddy gave it me;\nI'll come and gang by Carterhaugh,\nAnd ask nae leave at thee.'",
      "Janet has kilted her green kirtle\nA little aboon her knee,\nAnd she has braided her yellow hair\nA little aboon her bree,\nAnd she is to her father's ha,\nAs fast as she can hie.",
      "Four and twenty ladies fair\nWere playing at the ba,\nAnd out then cam the fair Janet,\nThe flower amang them a'.",
      "Four and twenty ladies fair\nWere playing at the chess,\nAnd out then cam the fair Janet,\nAs green as onie glass.",
      "Out then spak an auld grey knight,\nLay o'er the castle wa,\nAnd says, 'Alas, fair Janet, for thee\nBut we'll be blamed a'.'",
      "'Haud your tongue, ye auld fac'd knight,\nSome ill death may ye die!\nFather my bairn on whom I will,\nI'll father nane on thee.'",
      "Out then spak her father dear,\nAnd he spak meek and mild;\n'And ever alas, sweet Janet,' he says,\n'I think thou gaes wi child.'",
      "'And if I gae wi child, father,\nMysel maun bear the blame;\nThere's ne'er a laird about your ha\nShall get the bairn's name.",
      "'If my love were an earthly knight,\nAs he's an elfin grey,\nI wad na gie my ain true-love\nFor nae lord that ye hae.",
      "'The steed that my true-love rides on\nIs lighter than the wind;\nWi siller he is shod before,\nWi burning gowd behind.'",
      "Janet has kilted her green kirtle\nA little aboon her knee,\nAnd she has braided her yellow hair\nA little aboon her bree,\nAnd she's awa to Carterhaugh,\nAs fast as she can hie.",
      "When she cam to Carterhaugh,\nTam Lin was at the well,\nAnd there she fand his steed standing,\nBut away was himsel.",
      "She had na pu'd a double rose,\nA rose but only tway,\nTill up then started young Tam Lin,\nSays, 'Lady, thou's pu nae mae.'",
      "'Why pu's thou the rose, Janet,\nAmang the groves sae green,\nAnd a' to kill the bonie babe\nThat we gat us between?'",
      "'O tell me, tell me, Tam Lin,' she says,\n'For's sake that died on tree,\nIf e'er ye was in holy chapel,\nOr Christendom did see?'",
      "'Roxbrugh he was my grandfather,\nTook me with him to bide,\nAnd ance it fell upon a day\nThat wae did me betide.",
      "'And ance it fell upon a day,\nA cauld day and a snell,\nWhen we were frae the hunting come,\nThat frae my horse I fell;\nThe queen o Fairies she caught me\nIn yon green hill to dwell.",
      "'And pleasant is the fairy land,\nBut, an eerie tale to tell,\nAy at the end of seven years\nWe pay a tiend to hell;\nI am sae fair and fu o flesh,\nI'm feard it be mysel.",
      "'But the night is Halloween, lady,\nThe morn is Hallowday;\nThen win me, win me, an ye will,\nFor weel I wat ye may.",
      "'Just at the mirk and midnight hour\nThe fairy folk will ride,\nAnd they that wad their true-love win,\nAt Miles Cross they maun bide.'",
      "'O they begin at sky-setting,\nRide all the evening tide;\nAnd she that will her true-love borrow,\nAt Miles Cross will him bide.'",
      "'But how shall I thee ken, Tam Lin,\nOr how my true-love know,\nAmang sae mony unco knights\nThe like I never saw?'",
      "'O first let pass the black, lady,\nAnd syne let pass the brown,\nBut quickly run to the milk-white steed,\nPull ye his rider down.",
      "'For I'll ride on the milk-white steed,\nAnd ay nearest the town;\nBecause I was an earthly knight\nThey gie me that renown.",
      "'My right hand will be gloved, lady,\nMy left hand will be bare,\nCockt up shall my bonnet be,\nAnd kaimed down shall my hair,\nAnd thae's the takens I gie thee,\nNae doubt I will be there.",
      "'They'll turn me in your arms, lady,\nInto an esk and adder;\nBut hold me fast, and fear me not,\nI am your bairn's father.",
      "'They'll turn me to a bear sae grim,\nAnd then a lion bold;\nBut hold me fast, and fear me not,\nAs ye shall love your child.",
      "'Again they'll turn me in your arms\nTo a red het gaud of airn;\nBut hold me fast, and fear me not,\nI'll do to you nae harm.",
      "'And last they'll turn me in your arms\nInto the burning gleed;\nThen throw me into well water,\nO throw me in wi speed.",
      "'And then I'll be your ain true-love,\nI'll turn a naked knight;\nThen cover me wi your green mantle,\nAnd cover me out o sight.'",
      "Gloomy, gloomy was the night,\nAnd eerie was the way,\nAs fair Jenny in her green mantle\nTo Miles Cross she did go.",
      "About the middle o the night\nShe heard the bridles ring;\nThis lady was as glad at that\nAs any earthly thing.",
      "First she let the black pass by,\nAnd syne she let the brown;\nBut quickly she ran to the milk-white steed,\nAnd pulled the rider down.",
      "Sae weel she minded what he did say,\nAnd young Tam Lin did win;\nSyne covered him wi her green mantle,\nAs blythe's a bird in spring.",
      "Out then spak the queen o fairies,\nOut of a bush o broom:\n'Them that has gotten young Tam Lin\nHas gotten a stately groom.'",
      "Out then spak the queen o fairies,\nAnd an angry woman was she:\n'Shame betide her ill-far'd face,\nAnd an ill death may she die,\nFor she's taen awa the bonniest knight\nIn a' my companie.",
      "'But had I kend, Tam Lin,' she says,\n'What now this night I see,\nI wad hae taen out thy twa grey een,\nAnd put in twa een o tree.'",
    ],
  },

  "child96": {
    title: "The Gay Goshawk",
    childNumber: "Child 96",
    version: "Version E (Herd's Manuscripts, 1776)",
    stanzas: [
      "'O well's me o my gay goshawk,\nThat he can speak and flee;\nHe'll carry a letter to my love,\nBring back another to me.'",
      "'O how can I your true-love ken,\nOr how can I her know?\nWhen frae her mouth I never heard couth,\nNor wi my eyes her saw.'",
      "'O weel sall ye my true-love ken,\nSae sune as ye her see,\nFor of a' the flowers of fair England,\nThe fairest flower is she.'",
      "'The red that's on my true-love's cheik\nIs like blood-drops on the snaw;\nThe white that is on her breast bare\nLike the down o the white sea-maw.'",
      "'And even at my love's bouer-door\nThere grows a flowering birk,\nAnd ye maun sit and sing thereon,\nAs she gangs to the kirk.'",
      "'And four-and-twenty fair ladyes\nWill to the mass repair,\nBut weel may ye my ladye ken,\nThe fairest ladye there.'",
      "Lord William has written a love-letter,\nPut it under his pinion gray,\nAnd he is awa to southern land,\nAs fast as wings can gae.",
      "And even at that ladye's bour\nThere grew a flowering birk,\nAnd he sat down and sang thereon,\nAs she gaed to the kirk.",
      "And first he sang a low, low note,\nAnd syne he sang a clear,\nAnd aye the overword of the sang\nWas, Your love can no win here.",
      "'Feast on, feast on, my maidens a',\nThe wine flows you amang,\nWhile I gang to my shot-window,\nAnd hear yon bonny bird's sang.'",
      "'Sing on, sing on, my bonny bird,\nThe sang ye sung yestreen;\nFor weel I ken by your sweet singing\nYe are frae my true-love sen.'",
      "And weel he kent that ladye feir\nAmang her maidens free,\nFor the flower that springs in May morning\nWas not sae sweet as she.",
      "O first he sang a merry sang,\nAnd syne he sang a grave,\nAnd syne he pecked his feathers gray,\nTo her the letter gave.",
      "'Have there a letter from Lord William;\nHe says he's sent ye three;\nHe canna wait your love langer,\nBut for your sake he'll die.'",
      "'Gae bid him bake his bridal bread,\nAnd brew his bridal ale,\nAnd I sall meet him at Mary's kirk,\nLang, lang ere it be stale.'",
      "The lady's gane to her chamber,\nAnd a mournfu' woman was she,\nAs gin she had ta'en a sudden brash,\nAnd were about to die.",
      "'A boon, a boon, my father dear,\nA boon I beg of thee!'\n'Ask not that haughty Scottish lord,\nFor him you ne'er shall see.'",
      "Down she fell as dead that night,\nBeside her mother's knee;\nThen out it spake an auld witch-wife,\nBy the fireside sat she.",
      "'Drap the hot lead on her cheek,\nAnd drap it on her chin,\nAnd drap it on her rose-red lips,\nAnd she will speak again.'",
      "They drapt the het lead on her cheek,\nSo did they on her chin;\nThey drapt it on her red-rose lips,\nBut they breathed none again.",
      "Her brothers went to a room,\nTo make to her a bier;\nThe boards of it were cedar wood,\nAnd the plates of gold so clear.",
      "The first Scots kirk that they came to,\nThey gart the bells be rung;\nThe next Scots kirk that they came to,\nThey gart the mass be sung.",
      "But when they came to St Mary's kirk,\nThere stood spearmen all on raw,\nAnd up and started Lord William,\nThe chieftain among them a'.",
      "'Set down, set down the bier,' he said,\n'Let me look her upon;'\nBut as soon as Lord William touched her hand,\nHer colour began to come.",
      "'Give me a shave of your white bread,\nA bottle of your wine;\nFor I have fasted for your sake\nFully these lang days nine.'",
    ],
  },

  "child98": {
    title: "Brown Adam",
    childNumber: "Child 98",
    version: "Version A (Jamieson-Brown Manuscript, c.1783)",
    stanzas: [
      "It was late, late in the evening,\nLate, late in the afternoon,\nThere came a knight to Brown Adam's house,\nAnd he was clad all in brown.",
      "O wha woud wish the win to blaw,\nOr the green leaves fa therewith?\nOr wha wad wish a leeler love\nThan Brown Adam the Smith?",
      "His hammer's o the beaten gold,\nHis study's o the steel,\nHis fingers white are my delight,\nHe blows his bellows well.",
      "But they ha banished him Brown Adam\nFrae father and frae mither,\nAn they ha banished him Brown Adam\nFrae sister and frae brither.",
      "And they ha banished Brown Adam\nFrae the flower o a' his kin;\nAn he's biggit a bower in the good green wood\nBetween his lady and him.",
      "O it fell once upon a day\nBrown Adam he thought lang,\nAn he woud to the green wood gang,\nTo hunt some venison.",
      "He's ta'en his bow his arm o'er,\nHis brand intill his han,\nAnd he is to the good green wood,\nAs fast as he could gang.",
      "O he's shot up, an he's shot down,\nThe bird upon the thorn,\nAnd sent it hame to his lady,\nAnd he'd be hame the morn.",
      "Whan he came till his lady's bower-door\nHe stood a little foreby,\nAnd there he heard a fu' fa'se knight\nTempting his gay lady.",
      "O he's ta'en out a gay gold ring,\nHad cost him mony a pound:\n'O grant me love for love, lady,\nAnd this shall be your own.'",
      "'I loo Brown Adam well,' she says,\n'I wot sae does he me;\nAn I woud na gi Brown Adam's love\nFor nae fa'se knight I see.'",
      "Out has he ta'en a purse of gold,\nWas a' fu to the string:\n'Grant me but love for love, lady,\nAn a' this sal be thine.'",
      "'I loo Brown Adam well,' she says,\n'An I ken sae does he me;\nAn I woudna be your light leman\nFor mair nor ye coud gie.'",
      "Then out has he drawn his lang, lang brand,\nAnd he's flashed it in her een:\n'Now grant me love for love, lady,\nOr thro you this sal gang!'",
      "'O,' sighing said that gay lady,\n'Brown Adam tarries lang!'\nThen up and starts him Brown Adam,\nSays, I am here, my dear.",
      "He's ta'en the fa'se knight by the collar,\nAnd thrown him to the ground;\n'Now, villain, take the wages\nThat you so well have found.'",
    ],
  },

  "child99": {
    title: "Johnie Scot",
    childNumber: "Child 99",
    version: "Version A (Jamieson-Brown Manuscript, c.1800)",
    stanzas: [
      "Johnie Scot's a-hunting gane,\nTo England's woods sae wild;\nThe fairest flower of all England\nTo Johnie proved big with child.",
      "Word is to the kitchen gane,\nAnd word is to the hall,\nAnd word is to the king himself\nAmong his nobles all.",
      "O up then rose him Johnie Scot,\nAn hour before the day,\nAnd he is on to Fair Ellen's bower,\nTo hear what she did say.",
      "'If she be wi child,' her father says,\n'As I trow weel she be,\nBefore the morn at ten o'clock\nHigh hanged thou shalt be.'",
      "He's ta'en her by the milk-white hand,\nAnd set her on a steed;\n'Come awa, come awa, my ain true love,\nNow is the time of need.'",
      "When Johnie came before the king,\nHe glanced like the fire;\nHis hair was like the threads o' gold,\nHis eyes like crystal clear.",
      "'No wonder, no wonder,' the king he said,\n'My daughter loved thee;\nFor wert thou a woman, as thou art a man,\nMy bedfellow thou shouldst be.'",
      "'There is an Italian in my court\nWill fight your men by three;\nBring out your trooper, Johnie,' said the king,\n'For fain I would him see.'",
      "They fought it once, they fought it twice,\nThey fought it o'er again,\nTill drops of blood, like drops of rain,\nWere running to the plain.",
      "Then Johnie drew his nut-brown brand,\nAnd struck it o'er the plain:\n'Are there any more of your English men\nThat want for to be slain?'",
      "'A clerk, a clerk,' the king then cried,\n'To write her tocher free;'\n'A priest, a priest,' then Johnie cried,\n'To marry my love and me.'",
      "'I'll have none of your gold,' he said,\n'As little of your gear;\nBut I will have my own true love,\nFor sure I've bought her dear.'",
    ],
  },

  "child100": {
    title: "Willie o Winsbury",
    childNumber: "Child 100",
    version: "Version A (Campbell Manuscripts, c.1783)",
    stanzas: [
      "The king he hath been a prisoner,\nA prisoner lang in Spain,\nAnd Willie o the Winsbury\nHas lain lang wi his daughter at hame.",
      "'What aileth thee, my daughter Janet,\nYe look so pale and wan?\nHave ye had any sore sickness,\nOr have ye been lying wi a man?'",
      "'Cast ye off your berry-brown gown,\nStand straight upon the stone,\nThat I may ken ye by your shape,\nWhether ye be a maiden or none.'",
      "She's cast off her berry-brown gown,\nAnd stood straight upon the stone;\nHer apron was short, and her haunches were round,\nHer face it was pale and wan.",
      "'Is it to a man o might, Janet?\nOr is it to a man of fame?\nOr is it to any of the rank robbers\nThat's lately come out o Spain?'",
      "'It is not to a man of might,' she said,\n'Nor is it to a man of fame;\nBut it is to William of Winsburry;\nI could lye nae langer my lane.'",
      "The king's called on his merry men all,\nBy thirty and by three:\n'Go fetch me William of Winsbury,\nFor hanged he shall be.'",
      "But when he came the king before,\nHe was clad o the red silk;\nHis hair was like the threads o gold,\nHis eyes were like the milk.",
      "'No wonder, no wonder,' the king he said,\n'My daughter loved thee;\nFor wert thou a woman, as thou art a man,\nMy bedfellow thou shouldst be.'",
      "'O will you marry my daughter dear,\nBy the faith of thy right hand?\nAnd thou shalt reign, when I am dead,\nThe king over my whole land.'",
      "'I will marry your daughter dear,\nWith my heart, yea and my hand;\nBut it never shall be that Lord Winsbury\nShall rule o'er fair Scotland.'",
      "'She shall have for her dower the bonny bowers\nAnd the bonny halls of Spain;\nAnd thou shalt reign, when I am dead,\nThe king and all his train.'",
      "He's mounted her on a milk-white steed,\nHimself on a dapple-grey,\nAnd made her a lady of as much land\nShe could ride in a whole summer day.",
    ],
  },

  "child103": {
    title: "Rose the Red and White Lily",
    childNumber: "Child 103",
    version: "Version A (Jamieson-Brown Manuscript, 1783)",
    stanzas: [
      "O Rose the Red and White Lily,\nTheir mother dear was dead,\nAnd their father's married an ill woman\nWished them little good.",
      "Yet she had twa as full fair sons\nAs ever broke man's bread,\nAnd the tane of them loved White Lily,\nAnd the tither loved Rose the Red.",
      "O they have built a bigly bower,\nAnd strawn it over wi sand,\nAnd there was mair mirth in the ladies' bower\nThan in all their father's land.",
      "But out is spake their step-mother,\nWho stood a little foreby:\n'I hope to live and play the prank\nShall gar your loud sang lie.'",
      "She's called upon her eldest son:\n'Come here, my son, to me;\nIt fears me sair, my eldest son,\nThat ye maun sail the sea.'",
      "'If it fear you sair, my mither dear,\nYour bidding I maun dee;\nBut never war to Rose the Red\nThan ye ha been to me.'",
      "She's called upon her youngest son:\n'Come here, my son, to me;\nIt fears me sair, my youngest son,\nThat ye maun sail the sea.'",
      "'If it fear you sair, my mither dear,\nYour bidding I maun dee;\nBut be never war to White Lily\nThan ye ha been to me.'",
      "When Rose the Red and White Lily\nSaw their twa loves were gane,\nThen stopped have they their loud, loud sang,\nAnd ta'en up the still mourning.",
      "Then out it spake her White Lily:\n'My sister, we'll be gane;\nWhy should we stay in Barnsdale\nTo waste our youth in pain?'",
      "Then cutted have they their green clothing\nA little below their knee,\nAnd sae have they their yellow hair\nA little aboon their bree.",
      "There have they changed their ain twa names,\nSae far frae ony town;\nAnd the tane of them hight Sweet Willy,\nAnd the tither of them Roge the Roun.",
      "They have gone to the good green wood\nAs fast as gang could they,\nAnd when they came to Brown Robin's bower\nThey chapped at the door that day.",
      "She hadna been in fair France\nA twelvemonth and a day,\nTill there she heard the morning drum\nBeat out at break of day.",
      "Word is gone to Brown Robin's hall,\nAnd to Brown Robin's bower,\nThat one of his merry young men\nHad born a bonny young son.",
      "Word has gone to the king's court,\nAnd to the king himself:\n'Now, by my fay,' the king could say,\n'The like was never heard tell!'",
    ],
  },

  "child106": {
    title: "The Famous Flower of Serving-Men",
    childNumber: "Child 106",
    version: "Version A (Traditional, c.1656)",
    stanzas: [
      "You beauteous ladies, great and small,\nI write unto you, one and all,\nWhereby that you may understand\nWhat I have suffered in this land.",
      "I was by birth a lady fair,\nMy father's chief and only heir,\nBut when my good old father died,\nThen I was made a young knight's bride.",
      "And then my love built me a bower\nBedeck'd with many a fragrant flower,\nA braver bower you ne'er did see\nThan my true-love did build for me.",
      "But there came thieves late in the night,\nThey robb'd my bower and slew my knight,\nAnd after that my knight was slain\nI could not live at home for pain.",
      "She dressed herself in man's array,\nAnd to the king's court took her way;\nShe rode till she came to the palace gate,\nOne morning when it was late.",
      "Then she went to the king and said:\n'A boon, a boon, my liege, I pray;\nMay I now serve you in your court\nFor I have neither home nor stay?'",
      "'What is your name, my pretty youth?\nAnd where were you bred, in sooth?'\n'My name is Sweet William,' she replied,\n'And in the north country I did reside.'",
      "The king look'd on her as she spake,\nAnd thought her face full fair to make;\n'I'll take thee in my court,' said he,\n'To be a page and wait on me.'",
      "But when the night was growing on\nAnd the minstrels' music ceased to tone,\nThe king would go to his nightly rest,\nAnd Sweet William lay down fully dressed.",
      "This lasted for a year and more,\nUntil a lord of high degree\nBegan to woo the pretty page\nWith gifts of money, land, and fee.",
      "The king at last began to wonder\nWhy Sweet William was so fair and tender;\nOne night in silence at the door\nHe heard such sighing as before.",
      "'Come tell to me your grief,' he said,\n'Sweet William, wert thou ever maid?'\nShe fell down on her bended knee:\n'O pardon me, my liege,' cried she.",
      "She told him all: her bower so fair,\nHer father's lands and all her care,\nHow thieves came late and slew her knight\nAnd drove her from her home in night.",
      "The king looked on her as she told,\nAnd thought her face worth more than gold;\n'Thou shalt be wed,' the king then said,\n'To the best lord throughout my land.'",
    ],
  },

  "child112": {
    title: "The Baffled Knight",
    childNumber: "Child 112",
    version: "Version A (Pills to Purge Melancholy, 1707)",
    stanzas: [
      "As I went out one May morning,\nTo view the fields and meadows gay,\nI met a maid came out of the wood,\nAnd she had lost her way.",
      "'Where are you going, pretty fair maid?\nAnd whither do you roam?'\n'I've lost my way in the greenwood,\nAnd cannot find my home.'",
      "'Come, take my horse,' the young man said,\n'And ride him at your ease;\nI'll guide you through the forest paths\nWherever you may please.'",
      "She thanked him with a curtsey low,\nAnd mounted up the steed;\nThe young man followed by her side\nAnd helped her at her need.",
      "'Come go with me,' the young man said,\n'To yonder shady bower;\nThe day is hot, the sun is bright,\n'Tis meet we rest an hour.'",
      "'Now God forbid,' the maid replied,\n'That such a thing should be;\nFor I have pledged my faith,' she said,\n'To one who waits for me.'",
      "He took her hand, he took her arm,\nHe led her through the mead;\nShe slipt away and ran before\nAnd left him with the steed.",
      "He called to her, he cried to her,\nBut she would not come back;\nShe ran as swift as any deer\nAnd kept the woodland track.",
      "'Alas, alas,' the young man cried,\n'She's cozened me today;\nA maid so fair and so discreet\nHath borne my horse away.'",
      "She rode till she came to her father's gate,\nAnd knocked and called within;\n'Here's a horse for you, dear father,\nWon by wit and not by sin.'",
    ],
  },

  "child113": {
    title: "The Great Silkie of Sule Skerry",
    childNumber: "Child 113",
    version: "Version A (Duncan Collection, Orkney, 1852)",
    stanzas: [
      "An earthly nourris sits and sings,\nAnd aye she sings, 'Ba, lily wean!\nLittle ken I my bairn's father,\nFar less the land that he steps in.'",
      "Then ane arose at her bed-foot,\nA grumbly guest I'm sure was he:\n'Here am I, thy bairn's father,\nAlthough that I be not comely.'",
      "'I am a man upon the land,\nAnd I am a silkie in the sea;\nAnd when I'm far and far frae land,\nMy dwelling is in Sule Skerry.'",
      "'It was not well,' quoth the maiden fair,\n'It was not well, indeed,' quoth she,\n'That the Great Silkie of Sule Skerry\nShould have come and fathered a bairn to me.'",
      "Now he has ta'en a purse of gold,\nAnd he has put it upon her knee,\nSaying, 'Give to me my little young son,\nAnd take thee up thy nurse's fee.'",
      "'And it shall come to pass on a summer's day,\nWhen the sun shines hot on every stone,\nThat I will take my little young son,\nAnd teach him for to swim the foam.'",
      "'And thou shalt marry a proud gunner,\nAnd a proud gunner I'm sure he'll be,\nAnd the very first shot that ever he shoots\nHe'll shoot both my young son and me.'",
    ],
  },

  "child114": {
    title: "Johnie Cock",
    childNumber: "Child 114",
    version: "Version F (Scott's Minstrelsy, 1802)",
    stanzas: [
      "Johnie rose up in a May morning,\nCalled for water to wash his hands,\nAnd he has called for his good gray hounds,\nThat lay bound in iron bands.",
      "'Gar loose to me the good gray dogs,\nThat are bound wi iron bands;\nFor I am going to the good green wood\nTo ding the dun deer down.'",
      "When Johnie's mother got word of that,\nHer hands for dule she wrang:\n'O Johnie, for my benison,\nTo the green wood do not gang!'",
      "'Enough ye have of the good wheat bread,\nAnd enough of the blood-red wine;\nAnd therefore for no venison\nI pray ye, stir from hame.'",
      "But Johnie's busked up his good bent bow,\nHis arrows, one by one,\nAnd he has gone to Durrisdeer\nTo hunt the dun deer down.",
      "As he came down by Merriemass,\nAnd in by the benty line,\nThere has he espied a deer lying\nBeneath a bush of ling.",
      "Johnie he shot, and the dun deer leapt,\nAnd he wounded her on the side;\nBut between the water and the brae\nHis hounds they laid her pride.",
      "They've eaten so meikle of the good venison,\nAnd they've drunken so muckle of the blood,\nThat they've fallen into as sound a sleep\nAs if that they were dead.",
      "'It's down, and it's down, and it's down, down,\nAnd it's down among the scrogs,\nAnd there ye'll espy twa bonnie boys lie\nAsleep among their dogs.'",
      "They wakened Johnie out of his sleep,\nAnd he's drawn to him his coat:\n'My fingers five, save me alive,\nAnd a stout heart fail me not!'",
      "'Stand stout, stand stout, my noble dogs,\nStand stout, and do not flee;\nStand fast, stand fast, my good gray hounds,\nAnd we will make them dee.'",
      "He has killed six of the proud foresters,\nAnd wounded the seventh sair;\nHe laid his leg out o'er his steed,\nSays, I will kill no more.",
      "'O wae betide thee, silly old man,\nAn ill death may thee dee!\nUpon thy head be all this blood,\nFor mine, I ween, is free.'",
    ],
  },

  "child119": {
    title: "Robin Hood and the Monk",
    childNumber: "Child 119",
    version: "Version A (Cambridge MS, c.1450)",
    stanzas: [
      "In summer, when the shaws be sheen,\nAnd leaves be large and long,\nIt is full merry in fair forest\nTo hear the fowls' song.",
      "To see the deer draw to the dale,\nAnd leave the hills high,\nAnd shadow them in the leaves green\nUnder the greenwood tree.",
      "It befell on Whitsuntide,\nEarly in a May morning,\nThe sun up fair did shine,\nAnd the birds merry did sing.",
      "'This is a merry morning,' said Little John,\n'By Him that died on tree;\nA more merry man than I am one\nLives not in Christentee.'",
      "'Pluck up thy heart, my dear master,'\nLittle John can say,\n'And think it is a full fair time\nIn a morning of May.'",
      "'One thing grieves me,' said Robin,\n'And does my heart much woe;\nThat I may not on a solemn day\nTo mass nor matins go.'",
      "'It is a fortnight and more,' said he,\n'Since I my Saviour see;\nTo day will I to Nottingham,'\nSaid Robin, 'with the might of mild Mary.'",
      "Then spake Much, the miller's son,\n'Ever more well thee betide;\nTake twelve of thy wight yeomen,\nWell weaponed, by thy side.'",
      "John early in a May morning,\nLooking his shoes upon,\nHe took him to Nottingham,\nTo matins all alone.",
      "And Robin is to Nottingham gone,\nHimself mourning alone,\nAnd Little John he is left behind,\nTo the yeomen every one.",
      "But when he came to Nottingham,\nI tell you as I mean,\nRobin Hood and a great monk\nThere together were seen.",
      "Of all the Mary's in merry England,\nRight well loved Robin the shrine;\nBut the monk hath spied out Robin Hood,\nAnd told the sheriff anon.",
    ],
  },

  "child155": {
    title: "Sir Hugh, or, The Jew's Daughter",
    childNumber: "Child 155",
    version: "Version B (Motherwell's Manuscript, 1825)",
    stanzas: [
      "Four and twenty bonny boys\nWere playing at the ba,\nAnd by it came him sweet Sir Hugh,\nAnd he played o'er them a'.",
      "He kicked the ba with his right foot,\nAnd catched it wi his knee,\nAnd throuch-and-thro the Jew's window\nHe gard the bonny ba flee.",
      "He's doen him to the Jew's castell,\nAnd walked it round about;\nAnd there he saw the Jew's daughter,\nAt the window looking out.",
      "'Throw down the ba, ye Jew's daughter,\nThrow down the ba to me!'\n'Never a bit,' says the Jew's daughter,\n'Till up to me come ye.'",
      "'How will I come up? How can I come up?\nHow can I come to thee?\nFor as ye did to my auld father,\nThe same ye'll do to me.'",
      "She's gane till her father's garden,\nAnd pu'd an apple red and green;\n'Twas a' to wile him sweet Sir Hugh,\nAnd to entice him in.",
      "She's led him in through ae dark door,\nAnd sae has she through nine;\nShe's laid him on a dressing-table,\nAnd stickit him like a swine.",
      "She's ta'en him to her cellar dark,\nAt the hour o midnight keen;\nShe's stabbed him with a little penknife,\nAnd put him in the well sae deep.",
      "'Will ye gang to the well-water,\nOr to the well-spring?'\n'For I am weary, weary o my mother,\nAnd I winna walk but a wee.'",
      "The lead is wondrous heavy, mother,\nThe well is wondrous deep;\nA keen penknife sticks in my heart,\nA word I daurna speak.",
    ],
  },

  "child159": {
    title: "Durham Field",
    childNumber: "Child 159",
    version: "Version A (Percy Folio MS, c.1650)",
    stanzas: [
      "The sixth of August the muster was,\nEarly in a morning clear;\nOur English archers their bows did bend,\nAnd many a black blade did appear.",
      "The king of Scots in armour bright\nDid march his men in ray;\nOur English king kept him in sight,\nResolved to win the day.",
      "The Scots they stood like walls of stone,\nAs thick as they might be;\nBut our brave English archers all\nLet fly right lustily.",
      "Lord Percy led the English vanguard,\nA noble knight and keen;\nThe Scots were driven back apace\nOn every side between.",
      "There was many a man of England\nThat morning fell full low;\nBut there was many a man of Scotland\nWas laid full cold also.",
      "But at the last, when all was done,\nThe English won the field;\nAnd many a Scots lord on that day\nWas forced with them to yield.",
    ],
  },

  "child161": {
    title: "The Battle of Otterburn",
    childNumber: "Child 161",
    version: "Version A/B/C composite (Cotton MS / Herd / Child)",
    stanzas: [
      "It fell about the Lammas tide,\nWhen the muir-men win their hay,\nThe doughty Douglas bound him to ride\nInto England, to drive a prey.",
      "He chose the Gordons and the Graemes,\nWith them the Lindsays light and gay;\nBut the Jardines wald not with him ride,\nAnd they rue it to this day.",
      "And he has burned the dales of Tyne,\nAnd part of Bambroughshire,\nAnd three good towers on Reidswire fells,\nHe left them all on fire.",
      "And he marched up to Newcastle,\nAnd rode it round about;\n'O wha's the lord of this castle?\nOr wha's the lady o't?'",
      "But up spake proud Lord Percy then,\nAnd O but he spake hie!\n'I am the lord of this castle,\nMy wife's the lady gay.'",
      "'If thou'rt the lord of this castle,\nSae weel it pleases me!\nFor, ere I cross the Border fells,\nThe tane of us shall die.'",
      "He took a long spear in his hand,\nShod with the metal free,\nAnd for to meet the Douglas there\nHe rode right furiously.",
      "But O how pale his lady looked\nFrae off the castle wa,\nWhen down before the Scottish spear\nShe saw proud Percy fa!",
      "'Had we twa been upon the green,\nAnd never an eye to see,\nI wad hae had you, flesh and fell;\nBut your sword sall gae wi me.'",
      "'But gae ye up to Otterbourne,\nAnd wait there dayis three;\nAnd, if I come not ere three dayis end,\nA fause knight ca' ye me.'",
      "The Douglas turned him round and said,\n'What maun needs be maun be.\nGae back to Northumberland, and tell\nThem what you've seen wi me.'",
      "They lighted high on Otterburn,\nUpon the bent sae broun;\nThey lighted high on Otterburn,\nAnd threw their pallions doun.",
      "And he that had a bonny boy,\nSent out his horse to grass;\nAnd he that had not a bonny boy,\nHis ain servant he was.",
      "But up then spake a little page,\nBefore the peep of dawn:\n'O waken ye, waken ye, my good lord,\nFor Percy's hard at hand.'",
      "'Ye lie, ye lie, ye liar loud!\nSae loud I hear ye lie!\nFor Percy had not men yestreen\nTo dight my men and me.'",
      "'But I have dreamed a dreary dream,\nBeyond the Isle of Sky;\nI saw a dead man win a fight,\nAnd I think that man was I.'",
      "He belted on his guid braid sword,\nAnd to the field he ran,\nBut he forgot the helmet good\nThat should have kept his brain.",
      "This deed was done at Otterburn,\nAbout the breaking of the day;\nEarl Douglas was buried at the bracken-bush,\nAnd Percy led captive away.",
    ],
  },

  "child167": {
    title: "Sir Andrew Barton",
    childNumber: "Child 167",
    version: "Version A (Percy's Reliques, 1765)",
    stanzas: [
      "As it befell in midsummer-time,\nWhen birds sing sweetly on every tree,\nOur king commanded Lord Howard the Admiral\nTo go take Sir Andrew Barton on the sea.",
      "When Flora, with her fragrant flowers,\nBedecked the earth so trim and gay,\nAnd Neptune, with his dainty showers,\nCame to present the month of May.",
      "Our king he caused a royal fleet\nTo be rigged out with all good speed,\nOf ships of war both great and small,\nAnd brave Lord Howard was their head.",
      "Lord Howard then, of courage bold,\nWent to the sea with pleasant cheer,\nNot curbed with winter's piercing cold,\nThough it was the stormy time of the year.",
      "With pikes, and guns, and bowmen bold,\nThis noble Howard is gone to the sea,\nOn the day before Midsummer's Eve,\nAnd out at Thames mouth sailed they.",
      "They had not sailed days two or three\nBefore they met with a merchant's ship;\nThen they hailed her, and asked her wither she came,\nAnd whence she did her voyage keep.",
      "'We are merchants from the northeast come,\nWe came from Bordeaux upon the bay;\nWe have met with Sir Andrew Barton today,\nWho robbed us of our goods and spoil.'",
      "'We durst not fight for loss of life,\nNor could we stand against his power;\nHis ship is armed so passing well,\nThat none can match him in an hour.'",
      "Then said Lord Howard, 'By God's grace,\nI'll make him rue this deed today;\nFor I will never return to the king\nTill I have brought Sir Andrew to bay.'",
      "The admiral brought his ship about,\nAnd towards Sir Andrew did make way;\nHis ship was clad in iron plates,\nTo keep the cannon shot at bay.",
    ],
  },

  "child173": {
    title: "Mary Hamilton",
    childNumber: "Child 173",
    version: "Version A (Motherwell's Manuscript, c.1825)",
    stanzas: [
      "Last night Queen Mary had four Maries,\nThis night she'll have but three;\nThere was Mary Seaton and Mary Beaton,\nAnd Mary Carmichael, and me.",
      "Last night I washed Queen Mary's feet,\nAnd bore her to her bed;\nThis day she's given me my reward,\nThis gallows-tree to tread.",
      "O often have I dressed my queen,\nAnd put gold in her hair;\nThe gallows-tree is my reward\nFor a' my service there.",
      "They've tied a handkerchief round my eyes,\nThat I might not see to dee;\nAnd they've put a robe of white on me,\nTo hang on the gallows-tree.",
      "'O little did my mither think,\nWhen first she cradled me,\nThat I should die sae far frae hame,\nAnd hang on a gallows-tree.'",
      "'O happy, happy is the maid\nThat's born of beauty free;\nIt was my dimpled cheeks and eyes\nThat's been the deil o me.'",
      "'Cast off, cast off my gown of silk,\nAnd let it fa below;\nFor my ain sake and fair Mary's sake,\nGae wrap it round thee so.'",
      "'O what care I for my gown of silk,\nOr what care I for my fee?\nWhat I do mourn and ay must mourn\nIs the babe that's torn frae me.'",
      "'O tie a napkin round my face,\nFor that I dare not see,\nTo see myself hung in the sun,\nFor a' the world to see.'",
      "Yestreen the queen had four Maries,\nThe night she'll hae but three;\nThere was Mary Seaton and Mary Beaton,\nAnd Mary Carmichael, and me.",
    ],
  },

  "child193": {
    title: "The Death of Parcy Reed",
    childNumber: "Child 193",
    version: "Version A (Scott's Minstrelsy, 1803)",
    stanzas: [
      "The Liddesdale Crosiers have ridden a race,\nAnd they had far better stayed at hame,\nFor they have lost a gallant gay,\nYoung Whinton Crosier it was his name.",
      "For Parcy Reed has him ta'en,\nAnd he's delivered him to the law;\nBut auld Crosier has made answer\nThat he'll gar the house of the Troughend fa.",
      "So as it happened on a day\nThat Parcy Reed is a-hunting gane,\nAnd the three false Halls of Girsonsfield\nThey all along with him are gane.",
      "They hunted high, they hunted low,\nThey hunted up, they hunted down,\nUntil the day was past the prime,\nAnd it grew late in the afternoon.",
      "They hunted high in Batinghope,\nTill weariness on Parcy seized;\nAt the Batinghope he's fallen asleep,\nAmid the heather green he's eased.",
      "'O some they stole his powder-horn,\nAnd some put water in his lang gun:\nO waken, waken, Parcy Reed!\nFor we do doubt thou sleeps too sound.'",
      "'O waken, O waken, Parcy Reed!\nFor we do doubt thou sleeps too long;\nFor yonder's the five Crosiers coming,\nThey're coming by the Hingin Stane.'",
      "'If they be five men, we are four,\nIf ye will all stand true to me;\nNow every one of you may take one,\nAnd two of them ye may leave to me.'",
      "'We will not stay, nor we dare not stay,\nO Parcy Reed, to fight with thee;\nFor thou wilt find, O Parcy Reed,\nThat they will slay both us and thee.'",
      "Now foul fa' ye, ye traitors all,\nThat ever ye should in England won!\nYou have left me in a fair field standing\nAnd in my hand an uncharged gun.",
      "'O fare thee well, my wedded wife!\nO fare you well, my children five!\nAnd fare thee well, my daughter Jane,\nThat I love best that's born alive!'",
    ],
  },

  "child200": {
    title: "The Gypsy Laddie",
    childNumber: "Child 200",
    version: "Version A / Version F composite",
    stanzas: [
      "The gypsies came to our good lord's gate,\nAnd O but they sang bonnie!\nThey sang sae sweet and sae complete\nThat down came the fair lady.",
      "She came tripping down the stair,\nAnd all her maids before her;\nAs soon as they saw her well-favoured face,\nThey cast their glamour o'er her.",
      "She gave to them the good wheat bread,\nAnd they gave her the ginger;\nBut she gave them a far better thing,\nThe gold ring from her finger.",
      "Yestreen I lay in a well-made bed,\nAnd my good lord beside me;\nThis night I'll lie in a tenant's barn,\nWhatever shall betide me.",
      "'Come to your bed,' says Johny Faa,\n'Oh come to your bed, my deary;\nFor I vow and I swear, by the hilt of my sword,\nThat your lord shall no more come near ye.'",
      "She's taken off her silk mantle,\nAnd she's brought to her a plaidie,\nFor she would travel the world o'er\nAlong with the gypsy laddie.",
      "They wandered high, they wandered low,\nThey wandered late and early,\nUntil they came to that wan water,\nAnd by this time she was weary.",
      "Now when our lord came home at even,\nHe speired for his fair lady;\nThe ane she cried, the tither replied,\nShe's awa' wi' the gypsy laddie.",
      "'Go saddle to me the black, black steed,\nGo saddle and make him ready;\nBefore that I either eat or sleep,\nI'll go seek my fair lady.'",
      "He rode east and he rode west,\nHe rode through field and fallow,\nUntil he came to the green green wood,\nWhere the gypsies camp did follow.",
      "'O come thee home, my own true love,\nO come thee home, my deary!\nFor I'll pledge my honour and my word\nThat your lord shall aye be near thee.'",
    ],
  },

  "child204": {
    title: "Jamie Douglas",
    childNumber: "Child 204",
    version: "Version G / Version H composite",
    stanzas: [
      "O waly, waly up the bank!\nAnd waly, waly down the brae!\nAnd waly, waly by yon burn-side,\nWhere me and my love were wont to gae!",
      "I leant my back unto an aik,\nI thought it was a trusty tree;\nBut first it bowed and syne it brak,\nSae my true-love did lichtly me.",
      "O waly, waly, but love be bonny\nA little time while it is new!\nBut when 'tis auld it waxes cauld,\nAnd fades awa' like morning dew.",
      "O wherefore should I busk my head?\nOr wherefore should I kame my hair?\nFor my true-love has me forsook,\nAnd says he'll never love me mair.",
      "Now Arthur's Seat shall be my bed,\nThe sheets shall ne'er be pressed by me;\nSaint Anton's well shall be my drink,\nSince my true-love has forsaken me.",
      "In the morning when I arose,\nMy bonnie palace for to see,\nI came unto my lord's room-door,\nBut he would not speak one word to me.",
      "Martinmas wind, when wilt thou blaw\nAnd shake the green leaves off the tree?\nO gentle death, when wilt thou come?\nFor of my life I am weary.",
      "'Tis not the frost that freezes fell,\nNor blawing snaw's inclemency;\n'Tis not sic cauld that makes me cry,\nBut my love's heart grown cauld to me.",
      "When we came in by Glasgow town,\nWe were a comely sight to see;\nMy love was clad in the black velvet,\nAnd I mysel' in cramasie.",
      "But had I wist, before I kissed,\nThat love had been sae ill to win,\nI'd locked my heart in a case of gowd\nAnd pinned it wi' a siller pin.",
    ],
  },

  "child214": {
    title: "The Braes o Yarrow",
    childNumber: "Child 214",
    version: "Version F (Herd's Manuscripts, c.1776)",
    stanzas: [
      "Late in the evening, drinking the wine,\nOr early in the morning,\nThey set a combat them between,\nTo fight it out in the dawning.",
      "'I dreamed a dreary dream last night,\nGod keep us all from sorrow!\nI dreamed I pulled the heather green\nUpon the braes of Yarrow.'",
      "'O gentle wind that bloweth south\nFrom where my love repaireth,\nConvey a kiss from his dear mouth\nAnd tell me how he fareth!'",
      "She sought him east, she sought him west,\nShe sought him braid and narrow;\nSyne in the cleaving of a craig,\nShe found him drowned in Yarrow.",
      "She took him up in her arms,\nWith bitter grief and sorrow,\nAnd she carried him to yonder bank,\nUpon the braes of Yarrow.",
      "'How can I live,' the lady cried,\n'How can I live in sorrow!\nFor I have lost the bonniest lad\nThat e'er rode on the Yarrow.'",
      "Her hair it was three quarters long,\nIt hung down by her middle;\nShe tied it round his white white neck,\nAnd carried him home frae Yarrow.",
    ],
  },

  "child243": {
    title: "The Daemon Lover",
    childNumber: "Child 243",
    version: "Version C (Motherwell's Manuscript, 1825)",
    stanzas: [
      "There came a ghost to Margret's door,\nWith many a grievous groan,\nCrying, O Margaret, are you within,\nOr are you gone from home?",
      "'I am your own true-love,' he said,\n'The man you pledged to me;\nBut seven years have come and gone\nSince last our lips did meet.'",
      "'I am married now,' said Margaret,\n'I have a husband dear;\nAnd two small babes sit by my knee,\nThey call me mother here.'",
      "'Then farewell, farewell, Margaret dear,\nFarewell for evermore;\nYou were the first I pledged my troth,\nThe last I shall adore.'",
      "She's ta'en her babe upon her knee,\nAnd kissed it tenderly;\n'My little babe, be still and sleep,\nFor troubled now am I.'",
      "She laid the baby in its cradle,\nAnd dressed herself with care;\nShe's gone with the spirit through the night\nBeyond all earthly prayer.",
      "When they had sailed a league, a league,\nA league but barely three,\nShe espied the tops of the mountains high\nAnd she wept right bitterly.",
      "When they had sailed a league, a league,\nA league but barely nine,\nShe heard a sound like rushing wind\nAnd she saw a sunken shrine.",
      "'O what hills are yon, yon pleasant hills,\nThe sun shines sweetly on?'\n'O yon are the hills of heaven,' he said,\n'Where you will never won.'",
      "'O what a mountain dark and drear,\nWhere never sun shines bright?'\n'O yon is the mountain of hell,' he cried,\n'Where you and I this night shall bide.'",
      "He sank the ship in a surging sea,\nTo the bottom of the main;\nAnd down with him went Margaret,\nNever to rise again.",
      "O sleep ye, wake ye, my husband?\nI wish ye wake in time!\nI would not for ten thousand pounds\nThis night ye knew my mind.",
    ],
  },

  "child248": {
    title: "The Grey Cock",
    childNumber: "Child 248",
    version: "Version A (Buchan's Ballads, 1828)",
    stanzas: [
      "'Saw ye my father? or saw ye my mother?\nOr saw ye my true-love John?'\n'I saw not your father, I saw not your mother,\nBut I saw your true-love John.'",
      "'It's now ten at night, and the stars give no light,\nAnd the bells they ring ding, dang;\nHe's met with some delay that caused him to stay,\nBut he will be here ere lang.'",
      "The surly auld carl did naething but snarl,\nAnd Johnie made haste to come in;\nHe chapped at the door, and he tirled the pin,\nAnd sae low he began to win.",
      "'O stay, my dear Johnie, O stay but a while,\nFor there is neither moon nor light;\nBut the cock will soon crow, and the day it will daw,\nAnd ye can go home by light.'",
      "'O an the cock craw at the dawning of day,\nO maiden, I must be away;\nMy white neck shall be like the bonny beaten gold,\nAnd my wings like the silver grey.'",
      "Flee, flee up, my bonny grey cock,\nAnd crow when it is day;\nYour neck shall be like the bonny beaten gold,\nAnd your wings of the silver grey.",
      "The cock crew east, the cock crew west,\nThe cock crew north and sooth;\nShe only heard the one short crow\nEre Johnie fled to the wood.",
    ],
  },

  "child250": {
    title: "Henry Martyn",
    childNumber: "Child 250",
    version: "Version A (Traditional, c.1800)",
    stanzas: [
      "In merry Scotland, in merry Scotland\nThere lived brothers three;\nThey all did cast lots which of them should go\nA-robbing upon the salt sea.",
      "The lot it fell upon Henry Martyn,\nThe youngest of the three;\nThat he should go rob on the salt sea, salt sea,\nTo maintain his brothers and he.",
      "He had not been sailing but a short winter's night,\nAnd part of a short winter's day,\nWhen he espied a lofty ship,\nCome sailing all along that way.",
      "'Hello, hello,' cried Henry Martyn,\n'What makes you sail so nigh?'\n'I'm a rich merchant ship bound for London town;\nWill you please let me pass by?'",
      "'O no, O no,' cried Henry Martyn,\n'That thing it cannot be;\nYour ship and your cargo and your good merchantmen\nThis night shall come along with me.'",
      "With broadside and broadside and at it they went\nFor fully two hours or three;\nTill Henry Martyn gave to her the death-shot,\nAnd down to the bottom sank she.",
      "Bad news, bad news to old England came,\nBad news to fair London town:\nThere's been a rich vessel lost all on the sea,\nAnd all of her merry men drowned.",
    ],
  },

  "child252": {
    title: "The Kitchie Boy",
    childNumber: "Child 252",
    version: "Version C (Buchan's Ballads of the North of Scotland, 1828)",
    stanzas: [
      "There lived a lady in the north,\nO mickle birth and fame;\nShe's fallen in love with her kitchen-boy,\nThe greater was her shame.",
      "Her father called her to his bower:\n'Daughter, what ails thee now?\nYou look so pale and wan today,\nI fear you've made a vow.'",
      "She called him in one evening late,\nAnd many words did say;\nHe kissed her lips and promised her\nHe'd sail no more away.",
      "He's ta'en her rings from off her hand,\nHer garters from her knee,\nAnd he has sailed away from her\nFar out upon the sea.",
      "A lord came courting to her door\nWith jewels rich and gay;\n'Now will you marry me,' he said,\n'And name the wedding day?'",
      "'There is a man far over the sea\nThat I do love the best;\nAnd until he comes home to me\nI cannot be at rest.'",
      "But oh, the wind blew sore that night,\nAnd the sea ran wondrous deep;\nAnd at the hour of midnight keen\nThe gallant ship went reep.",
      "He came before her father's gate,\nA sailor bold was he;\nHe showed the lady's rings he had\nAs tokens from the sea.",
      "She looked in his bonny face,\nAnd through her tears did smile:\n'Awa, awa, thou false, false love,\nHow could you me beguile?'",
      "The day it is gone, and the night's come on,\nAnd the King's court it is begun;\nAll the ladies in the court are going to bed,\nAnd it's time that I were gone.",
      "He's drawn the mask from off his face,\nAnd smiled right courteously:\n'A priest! a priest!' the old man cried,\n'Come wed this maid and me.'",
    ],
  },

  "child255": {
    title: "Willie's Lyke-Wake",
    childNumber: "Child 255",
    version: "Version B (Herd's Manuscripts, c.1776)",
    stanzas: [
      "'O Willie my son, what makes thee sae sad?'\n'I lie sairly sick for the love of a maid.'",
      "'O Willie my son, I'll learn thee a wile:\nHow this fair maid thou mayst beguile.'",
      "'Thou'lt gie the principal bellman a groat,\nAnd bid him cry thy dead lyke-wake.'",
      "So he gae the principal bellman a groat,\nHe bade him cry his dead lyke-wake.",
      "The maiden she stood till she heard it all,\nAnd down from her cheeks the tears did fall.",
      "She's gone to her bower as fast as she can:\n'I'll go to yon lyke-wake but only one man.'",
      "As she walked in by her own bower stair,\nShe saw seven brothers standing there.",
      "As she walked in through ae dark door,\nShe saw the corpse laid on the floor.",
      "'O I'll kiss his cheek and I'll clap his hand,\nAnd I'll have but one look ere I gang.'\nShe lifted up the green covering,\nAnd kissed his lips and stroked his hair.",
      "About the dead hour of the night\nShe heard the bridles ring;\nAnd Janet was as glad of that\nAs any earthly thing.",
      "She's kissed his cheek and she's clapped his hand,\nAnd three times has she him kissed;\nThen he looked up into her face,\nWith the blythe blink in his eyes.",
      "'O bonny maid, since we are met,\nWe'll never more be separate;\nAnd I will wed thee now this night,\nEre ever thou canst think of flight.'",
    ],
  },

  "child265": {
    title: "The Knight's Ghost",
    childNumber: "Child 265",
    version: "Version A (Buchan's Ballads of the North of Scotland, 1828)",
    stanzas: [
      "She looked over her castle wall,\nTo see what she might see;\nShe spied her own dear lord\nCome riding over the lee,\nAt the dead hour of the night.",
      "'How came you here, my own dear lord,\nAt this untimely hour?\nFor I have mourned for you seven years,\nAnd you've been cold in earth so long.'",
      "'I am not come from any grave,\nNor yet from any sea;\nBut I am come from heaven above,\nTo take my leave of thee.'",
      "'O lay not my head on cold church floor,\nNor yet in churchyard ground;\nBut lay me in your own bower window,\nWhere music it does sound.'",
      "She called up her merry men all,\nBy one, by two, by three;\nShe bade them make a bier of birch,\nTo carry her love from the sea.",
      "They laid him in her bower window,\nWhere she was wont to be;\nAnd there she wept and there she mourned\nFor her true love eternally.",
    ],
  },

  "child272": {
    title: "The Suffolk Miracle",
    childNumber: "Child 272",
    version: "Version A (Broadside, c.1700)",
    stanzas: [
      "A young man riding in the night,\nHis journey for to take,\nHe rode until the morning light,\nFor his true love's sake.",
      "There was a wealthy farmer's son\nWho courted a farmer's daughter;\nBut her father he would not agree,\nFor he was of a lower order.",
      "He sent his daughter far away\nTo friends she had in London;\nBut for the love she bore this youth,\nShe wished she'd never gone there.",
      "When forty weeks were past and gone,\nThis maid began to wonder;\nAnd thinking on her absent love\nShe sighed and mourned thereunder.",
      "One night when she sat all alone,\nA knock came to her chamber;\n'Come down, come down, my dear,' he said,\n'Let nothing make you wander.'",
      "She dressed herself and came down stairs,\nWith many a silent gesture;\nHe placed her up behind himself\nAnd rode on through the darkness.",
      "He neither sang, nor yet he spoke,\nNo word the live-long journey;\nBut when they came to her father's gate,\nHe bade her there be easy.",
      "A young man riding in the night,\nHis journey for to take,\nHe rode until the morning light,\nFor his true love's sake.",
    ],
  },

  "child281": {
    title: "The Keach i the Creel",
    childNumber: "Child 281",
    version: "Version A (Herd's Manuscripts, c.1776)",
    stanzas: [
      "A fair maid sat in her bower door,\nWringing her lily hands;\nAnd by there came a sprightly youth,\nFast tripping o'er the strands.",
      "'Where gang ye, young John,' she said,\n'Sae early in the day?\nIt gars me think, by your fast trip,\nYe're gaun some road astray.'",
      "'I gang to see a lovely maid,\nAs fair as fair can be;\nAnd if ye will not hinder me,\nI'll soon come back tae thee.'",
      "'Gin ye be for that lovely maid,\nI'll point you out the way;\nYe'll find her in the garden green,\nAnd there she'll bid you stay.'",
      "He's ta'en the creel upon his back,\nAnd to the garden green;\nThe maiden met him at the gate\nAnd bade him enter in.",
      "She's set him in a creel of straw\nAnd drawn it up full high;\nHer father heard a noise above\nAnd came the stair to spy.",
      "But the night was dark, and the way was sair,\nAnd the morn came up on them unaware;\nHe called out, 'What strange creature's there?'\nBut she had slipped inside with care.",
      "He's let the creel down to the ground\nAnd laughed as he did fall;\nAnd the maiden blushed with rosy cheek\nBehind her bower wall.",
    ],
  },

  "child299": {
    title: "Trooper and Maid",
    childNumber: "Child 299",
    version: "Version A (Traditional)",
    stanzas: [
      "When the trumpet sounds to horse and away,\nEarly in the morning,\nLeave thy bed and leave thy beau,\nEarly in the morning.",
      "The trooper laced his cloak so gay,\nEarly in the morning,\nAnd kissed his maid ere riding away,\nEarly in the morning.",
      "'O soldier, soldier, will you marry me?\nEarly in the morning;\nWith your musket, fife, and drum?'\nEarly in the morning.",
      "'O no, sweet maid, I cannot marry thee,\nEarly in the morning;\nFor I have a wife in my own countree,\nEarly in the morning.'",
      "'O what will you give me for my maidenhead\nEarly in the morning?\nThat I gave to you in my bower-bed,\nEarly in the morning?'",
      "'I'll give you a ring and a silver pin,\nEarly in the morning,\nAnd a fine new dress in the spring,\nEarly in the morning.'",
      "The trumpet sounded and away he rode,\nEarly in the morning,\nAnd left the maid by the grassy road,\nEarly in the morning.",
    ],
  },

  "child305": {
    title: "The Broom of Cowdenknows",
    childNumber: "Child 305",
    version: "Version A (Traditional Scottish)",
    stanzas: [
      "There was a troop of merry gentlemen\nWere riding tween twa knowes;\nThey swore they smelled a bonny lass,\nAs they came by the broom of Cowdenknows.\nIt's up then spake the foremost man,\nSaid, I see her standing there;\nA bonny lass in a green mantle,\nCombing down her yellow hair,\nEarly on a May morning.",
      "'O maid, O maid, come tell to me\nWhat land you belong unto?'\n'I'm a poor maid in good green wood,\nAnd herding of the ewes, sir.'",
      "The knight's descended from his horse\nAnd tied it to a tree;\nHe's ta'en the maiden by the hand\nAnd sat down on the lea.",
      "'Now will you go with me,' he said,\n'This merry month of May?\nI'll wed you and I'll bed you,\nAnd your fortune shall be gay.'",
      "'O no, kind sir, O no,' she said,\n'I dare not venture so;\nFor my father and my mother dear\nWould count me far too low.'",
      "'If I should bring my father's horse\nAnd set you upon his back,\nWould you go with me then?' he said,\n'And never more come back?'",
      "She's ta'en his hand between her own\nAnd sworn upon the lea;\nSaid, If you'll prove true to your word,\nI'll prove as true to thee.",
    ],
  },

  "child47": {
    title: "Proud Lady Margaret",
    childNumber: "Child 47",
    version: "Version A / Version B composite",
    stanzas: [
      "'Twas on a night, an evening bright,\nWhen the dew began to fall,\nLady Margaret was walking up and down,\nLooking o'er her castle wall.",
      "She looked east and she looked west,\nTo see what she could spy,\nWhen a gallant knight came in her sight,\nAnd to the gate drew nigh.",
      "'You seem to be no gentleman,\nYou wear your boots so wide;\nBut you seem to be some cunning hunter,\nYou wear the horn so syde.'",
      "'I am no cunning hunter,' he said,\n'Nor e'er intend to be;\nBut I am come to this castle\nTo seek the love of thee.\nAnd if you do not grant me love,\nThis night for thee I'll die.'",
      "'If you should die for me, sir knight,\nThere's few for you will mean;\nFor many a better has died for me,\nWhose graves are growing green.'",
      "'But ye maun read my riddle,' she said,\n'And answer my questions three;\nAnd but ye read them right,' she said,\n'Gae stretch ye out and die.'",
      "'Now what is the flower, the ae first flower,\nSprings either on moor or dale?\nAnd what is the bird, the bonnie bonnie bird,\nSings on the evening gale?'",
      "'The primrose is the ae first flower\nSprings either on moor or dale,\nAnd the thristle-cock is the bonniest bird\nSings on the evening gale.'",
      "'O hey, how many small pennies\nMake thrice three thousand pound?\nOr hey, how many salt fishes\nSwim the salt sea round?'",
      "'I think you maun be my match,' she said,\n'My match and something mair;\nYou are the first e'er got the grant\nOf love frae my father's heir.'",
      "'My father was lord of nine castles,\nMy mother lady of three;\nMy father was lord of nine castles,\nAnd there's nane to heir but me.'",
      "'And round about a' thae castles\nYou may baith plow and saw,\nAnd on the fifteenth day of May\nThe meadows they will maw.'",
      "'O hald your tongue, Lady Margaret,' he said,\n'For loud I hear you lie;\nYour father was lord of nine castles,\nYour mother was lady of three.'",
      "'And round about a' thae castles\nYou may baith plow and saw,\nBut on the fifteenth day of May\nThe meadows will not maw.'",
      "'I am your brother Willie,' he said,\n'I trow ye ken na me;\nI came to humble your haughty heart,\nHas gard sae many die.'",
      "'If ye be my brother Willie,' she said,\n'As I trow weel ye be,\nThis night I'll neither eat nor drink,\nBut gae alang wi thee.'",
      "'O hold your tongue, Lady Margaret,' he said,\n'Again I hear you lie;\nFor ye've unwashen hands and ye've unwashen feet,\nTo gae to clay wi me.'",
      "'For the wee worms are my bedfellows,\nAnd cauld clay is my sheets,\nAnd when the stormy winds do blow,\nMy body lies and sleeps.'",
      "There was a knight, in a summer's night,\nAppeared in a lady's hall,\nAs she was walking up and down,\nLooking o'er her castle wall.",
    ],
  },

  "child50": {
    title: "The Bonny Hind",
    childNumber: "Child 50",
    version: "Version A (Child's English and Scottish Popular Ballads)",
    stanzas: [
      "O May she comes, and May she goes,\nDown by yon garden green,\nAnd there she spied a gallant squire\nAs squire had ever been.",
      "And May she comes, and May she goes,\nDown by yon hollin tree,\nAnd there she spied a brisk young squire,\nAnd a brisk young squire was he.",
      "'Give me your green manteel, fair maid,\nGive me your maidenhead;\nGif ye winna gie me your green manteel,\nGi me your maidenhead.'",
      "He has taen her by the milk-white hand,\nAnd softly laid her down,\nAnd when he's lifted her up again\nGiven her a silver kaim.",
      "'Perhaps there may be bairns, kind sir,\nPerhaps there may be nane;\nBut if you be a courtier,\nYou'll tell to me your name.'",
      "'I am nae courtier, fair maid,\nBut new come frae the sea;\nI am nae courtier, fair maid,\nBut when I courteth thee.'",
      "'They call me Jack when I'm abroad,\nSometimes they call me John;\nBut when I'm in my father's bower\nJock Randal is my name.'",
      "'Ye lee, ye lee, ye bonny lad,\nSae loud as I hear ye lee!\nFor I'm Lord Randal's ae daughter,\nHe has nae mair nor me.'",
      "'Ye lee, ye lee, ye bonny may,\nSae loud as I hear ye lee!\nFor I'm Lord Randal's ae yae son,\nJust now come o'er the sea.'",
      "She's putten her hand down by her spare,\nAnd out she's taen a knife,\nAnd she has put it in her heart's blood,\nAnd ta'en away her life.",
      "And he's taen up his bonny sister,\nWith the big tear in his een,\nAnd he has buried his bonny sister\nAmang the hollins green.",
      "And syne he's hied him o'er the dale,\nHis father dear to see:\n'Sing O and O for my bonny hind,\nBeneath yon hollin tree!'",
      "'What needs you care for your bonny hyn?\nFor it you needna care;\nThere's aught score hyns in yonder park,\nAnd five score hyns to spare.'",
      "'Four score of them are siller-shod,\nOf thae ye may get three;\nBut O and O for my bonny hyn,\nBeneath yon hollin tree!'",
      "'I care na for your hyns, my lord,\nI care na for your fee;\nBut O and O for my bonny hyn,\nBeneath the hollin tree!'",
      "'O were ye at your sister's bower,\nYour sister fair to see,\nYe'll think na mair o your bonny hyn\nBeneath the hollin tree.'",
    ],
  },

  "child58": {
    title: "Sir Patrick Spens",
    childNumber: "Child 58",
    version: "Version A (Percy's Reliques, 1765)",
    stanzas: [
      "The king sits in Dumferling town,\nDrinking the blood-red wine:\n'O where will I get a guid sailor,\nTo sail this ship of mine?'",
      "Up and spak an eldern knight,\nSat at the king's right knee:\n'Sir Patrick Spens is the best sailor\nThat sails upon the sea.'",
      "The king has written a braid letter,\nAnd signed it wi his hand,\nAnd sent it to Sir Patrick Spens,\nWas walking on the sand.",
      "The first line that Sir Patrick read,\nA loud laugh laughed he;\nThe next line that Sir Patrick read,\nThe tear blinded his ee.",
      "'O wha is this has done this deed,\nThis ill deed done to me,\nTo send me out this time o the year,\nTo sail upon the sea!'",
      "'Make haste, make haste, my merry men all,\nOur guid ship sails the morn:'\n'O say na sae, my master dear,\nFor I fear a deadly storm.'",
      "'Late late yestreen I saw the new moon,\nWi the auld moon in her arm,\nAnd I fear, I fear, my dear master,\nThat we will come to harm.'",
      "O our Scots nobles were right loath\nTo wet their cork-heeled shoes;\nBut long ere all the play was played,\nTheir hats they swam aboon.",
      "O long, long may their ladies sit,\nWi their fans into their hand,\nOr e'er they see Sir Patrick Spens\nCome sailing to the land.",
      "O long, long may the ladies stand,\nWi their gold combs in their hair,\nWaiting for their ain dear lords,\nFor they'll see them na mair.",
      "Half o'er, half o'er to Aberdour,\nIt's fifty fathoms deep,\nAnd there lies guid Sir Patrick Spens,\nWi the Scots lords at his feet.",
    ],
  },

  "child63": {
    title: "Child Waters",
    childNumber: "Child 63",
    version: "Version B (Jamieson-Brown Manuscript, c.1783)",
    stanzas: [
      "I warn ye all, ye gay ladies,\nThat wear scarlet and brown,\nThat ye dinna leave your father's house\nTo follow young men frae the town.",
      "O here am I, a lady gay,\nThat wears scarlet and brown,\nYet I will leave my father's house\nAnd follow Lord John frae the town.",
      "Lord John stood in his stable-door,\nSaid he was bound to ride;\nBurd Ellen stood in her bower-door,\nSaid she'd run by his side.",
      "'But ye maun rin through the wood, Ellen,\nAnd I will ride my steed;\nYe maun rin through the water clear,\nThough ye should never speed.'",
      "He rode, she ran, the livelong day,\nUntil they cam to Clyde;\nShe waded to the middle o the ford,\nAnd he sat on the other side.",
      "O four and twenty ladies fair\nWere playing at the ba',\nAnd out then came Lord John's mother,\nThe flower amang them a'.",
      "'How cam ye by the bonny boy,\nThat rides by your side?'\n'He is my brother William, mother,\nCome riding frae the tide.'",
      "Lord John's mother in her bower\nWas sitting all alone;\nWhen in the silence of the night\nShe heard fair Ellen's moan.",
      "She went unto the horse's stall,\nAnd there she found her son;\n'Rise up, rise up now, Lord John,' she said,\n'Your lady has born a son.'",
      "He's raised her frae the horse's stall,\nAnd set her in a chair:\n'Here is the best bed in my house,\nFor you and your young heir.'",
    ],
  },

  "child69": {
    title: "Clerk Saunders",
    childNumber: "Child 69",
    version: "Version B (Herd's Manuscripts, 1769)",
    stanzas: [
      "Clerk Saunders and a gay lady\nWas walking in yonder green,\nAnd heavy, heavy was the love\nThat fell this twa lovers between.",
      "'A bed, a bed,' Clerk Saunders said,\n'A bed for you and me!'\n'Fy na, fy na,' said the lady,\n'Till anes we married be.'",
      "'For in it will come my seven brothers,\nAnd a' their torches burning bright;\nThey'll say, We hae but ae sister,\nAnd here her lying wi a knight.'",
      "'You'll take the sourocks on your lap,\nThe moon shines over the wall;\nAnd I shall come to your bower-door,\nAnd in softly I shall fa'.'",
      "And he has ta'en a lady's mantle,\nAnd he has spread it on the floor;\nAnd, softly stepping, Clerk Saunders\nHas entered at the bower-door.",
      "And they baith lay in ae embrace,\nAnd love passed high between;\nBut little thought Clerk Saunders then\nThat love was to be their bane.",
      "In and came her seven brothers,\nWith torches burning bright;\nSays they, We hae but ae sister,\nAnd here her lying wi a knight.",
      "Then ane of them has drawn his sword,\nAnd another has drawn another;\nAnd they've thrust them through Clerk Saunders' body,\nThe coldest blood ran over.",
      "Yestreen I made my bed full wide,\nThis night I'll make it narrow,\nFor all the livelong winter's night\nI lie twined o' my marrow.",
      "O are ye sleeping, Margret? he said,\nOr are ye waking presentlie?\nGive me my faith and troth again,\nI wot, true love, I gied to thee.",
      "'Your faith and troth ye sanna get,\nAnd our true love sall never twin,\nUntil ye tell me what comes of women,\nI wot, that die in strong travelling?'",
      "'Their beds are made in the heavens high,\nDown at the foot of our good Lord's knee;\nWeel set about wi' gillyflowers,\nI wot, sweet company for to see.'",
      "'O cocks are crowing a merry midnight,\nI wot the wild fowl boding day;\nThe psalms of heaven will be sung,\nAnd I, ere now, will be missed away.'",
      "'Up, up, up, my seven brothers,\nUp, up, up, and awa';\nI wonder what hinders our good Lord's gate,\nSo late as ye come in the daw.'",
      "O it's they've taen up the clay-cold corpse,\nAnd put it in the grave so deep;\nAnd they've taen up the leal maiden,\nAnd bade her mourn and weep.",
      "O she has made her brother's bed,\nAnd she has made it braid and wide;\nAnd she has dried her wet, wet eyes,\nAnd she has laid her down to bide.",
      "They baith lay still, and slept sound,\nUntil the sun began to sheen;\nShe drew the curtains a wee bit,\nAnd dull and drowsy was his een.",
      "This night, said she, the sleepiest man\nThat ever my twa eyes did see;\nYe've lain all night within my arms,\n'Tis shame for you and me.",
      "She's rowd the claiths a to the foot,\nAnd then she spied his deadly wounds:\n'O wae be to my seven brothers,\nA wat an ill death may they die!'",
    ],
  },

  "child70": {
    title: "Willie and Lady Maisry",
    childNumber: "Child 70",
    version: "Version A (Motherwell's Manuscript, 1826)",
    stanzas: [
      "Willie was a widow's son,\nAnd he wore a milk-white weed,\nAnd weel could Willie read and write,\nFar better ride on steed.",
      "Lady Margerie was the first lady\nThat drank to him the wine,\nAnd aye as the healths gade round and round,\n'Laddy, your love is mine.'",
      "Lady Margerie was the first ladye\nThat drank to him the beer,\nAnd aye as the healths gade round and round,\n'Laddy, you're welcome here.'",
      "'You must come into my bower\nWhen the evening bells do ring,\nAnd you must come into my bower\nWhen the evening mass doth sing.'",
      "He's taen four and twenty braid arrows,\nAnd laced them in a whang,\nAnd he's awa to Lady Margerie's bower,\nAs fast as he can gang.",
      "He set ae foot on the wall,\nAnd the other on a stane,\nAnd he's killed a' the king's life-guards,\nAnd he's killed them every man.",
      "'Oh open, open, Lady Margerie,\nOpen and let me in;\nThe weet weets a' my yellow hair,\nAnd the dew draps on my chin.'",
      "With her feet as white as sleet\nShe strode her bower within,\nAnd with her fingers long and small\nShe's looten Sweet Willie in.",
      "'O Willie, Willie, I fear that thou\nHas bred me dule and sorrow;\nThe deed that thou has done this night\nWill kythe upon the morrow.'",
      "In then came her father dear,\nAnd a broad sword by his side,\nAnd he's given Willie, the widow's son,\nA deep wound and a sair.",
      "'Lye yont, lye yont, Willie,' she says,\n'Your sweat weets a' my side;\nLye yont, lie yont, Willie,' she says,\n'For your sweat I downa bide.'",
      "She turned her back unto the wall,\nHer face unto the room,\nAnd there she saw her auld father,\nWalking up and down.",
      "'Woe be to you, father,' she said,\n'And an ill deed may you die!\nFor ye've killed Willie, the widow's son\nAnd he would have married me.'",
      "She turned her back unto the room,\nHer face unto the wall,\nAnd with a deep and heavy sigh\nHer heart it brak in twa.",
    ],
  },

  "child72": {
    title: "The Clerk's Twa Sons o Owsenford",
    childNumber: "Child 72",
    version: "Version A (Child's English and Scottish Popular Ballads)",
    stanzas: [
      "O I will sing to you a sang,\nBut oh my heart is sair!\nThe clerk's twa sons in Owsenford\nHas to learn some unco lair.",
      "They hadna been in fair Parish\nA twelvemonth and a day,\nTill the clerk's twa sons o Owsenford\nWi the mayor's twa daughters lay.",
      "O words gaen to the mighty mayor,\nAs he sailed on the sea,\nThat the clerk's twa sons o Owsenford\nWi his twa daughters lay.",
      "'If they hae lain wi my twa daughters,\nMeg and Marjorie,\nThe morn, or I taste meat or drink,\nThey shall be hangit hie.'",
      "O words gaen to the clerk himself,\nAs he sat drinking wine,\nThat his twa sons in fair Parish\nWere bound in prison strong.",
      "Then up and spak the clerk's ladye,\nAnd she spak powerfully:\n'O tak with ye a purse of gold,\nOr take with ye three,\nAnd if ye canna get William,\nBring Andrew hame to me.'",
      "'O lie ye here for owsen, dear sons,\nOr lie ye here for kye?\nOr what is it that ye lie for,\nSae sair bound as ye lie?'",
      "'We lie not here for owsen, dear father,\nNor yet lie here for kye,\nBut it's for a little o dear-bought love\nSae sair bound as we lie.'",
      "O he's gane to the mighty mayor,\nAnd he spoke powerfully:\n'Will ye grant me my twa sons' lives,\nEither for gold or fee?\nOr will ye be sae gude a man\nAs grant them baith to me?'",
      "'I'll no grant ye your twa sons' lives,\nNeither for gold or fee,\nNor will I be sae gude a man\nAs gie them back to thee;\nBefore the morn at twelve o'clock\nYe'll see them hangit hie.'",
      "Up and spak his twa daughters,\nAnd they spak powerfully:\n'Will ye grant us our twa loves' lives,\nEither for gold or fee?\nOr will ye be sae gude a man\nAs grant them baith to me?'",
      "'I'll no grant ye your twa loves' lives,\nNeither for gold or fee,\nNor will I be sae gude a man\nAs grant their lives to thee;\nBefore the morn at twelve o'clock\nYe'll see them hangit hie.'",
      "O he's taen out these proper youths,\nAnd hanged them on a tree,\nAnd he's bidden the clerk of Owsenford\nTo tak them hame wi thee.",
      "The bonny clerks they died that morn,\nTheir loves died lang ere noon,\nAnd the waefu' clerk o Owsenford\nTo his lady has gane hame.",
      "His lady sits on yon castle-wa,\nBeholding dale and down,\nAnd there she saw her ain gude lord\nCome walkin to the town.",
      "'Ye're welcome, welcome, my ain gude lord,\nYe're welcome hame to me;\nBut where away are my twa sons?\nYe should hae brought them wi ye.'",
      "'It's I've putten them to a deeper lair,\nAnd to a higher school;\nYour ain twa sons'll no be here\nTill the hallow days o Yule.'",
      "'O sorrow, sorrow come mak my bed,\nAnd dool come lay me down!\nFor I'll neither eat nor drink,\nNor set a fit on ground.'",
    ],
  },

  "child73": {
    title: "Lord Thomas and Fair Annet",
    childNumber: "Child 73",
    version: "Version A (Percy's Reliques, 1765)",
    stanzas: [
      "Lord Thomas and Fair Annet\nSate a day on a hill;\nWhan night was cum, and sun was sett,\nThey had not talkt their fill.",
      "Lord Thomas said a word in jest,\nFair Annet took it ill:\n'A, I will nevir wed a wife\nAgainst my ain friends will.'",
      "'Gif ye wull nevir wed a wife,\nA wife wull neir wed yee:'\nSae he is hame to tell his mither,\nAnd knelt upon his knee.",
      "'O rede, O rede, mither,' he says,\n'A gude rede gie to mee:\nO sall I tak the nut-browne bride,\nAnd let fair Annet bee?'",
      "'The nut-browne bride haes gowd and gear,\nFair Annet she has gat nane;\nAnd the little beauty fair Annet has,\nO it wull soon be gane!'",
      "And he has till his brother gane:\n'Now, brother, rede ye mee;\nA' sall I marrie the nut-browne bride,\nAnd let fair Annet bee?'",
      "'The nut-browne bride haes oxen, brother,\nThe nut-browne bride haes kye;\nI wad hae ye marrie the nut-browne bride,\nAnd cast fair Annet bye.'",
      "'Her oxen may dye i the house, billie,\nAnd her kye into the byre;\nAnd I sall hae nothing to my-sell\nBot a fat fadge by the fyre.'",
      "And he has till his sister gane:\n'Now, sister, rede ye mee;\nO sall I marrie the nut-browne bride,\nAnd set fair Annet free?'",
      "'I'se rede ye tak fair Annet, Thomas,\nAnd let the browne bride alane;\nLest ye sould sigh and say, Alace!\nWhat is this we brought hame?'",
      "'No, I will tak my mither's counsel,\nAnd marrie me out o hand;\nAnd I will tak the nut-browne bride;\nFair Annet may leive the land.'",
      "Up then rose fair Annet's father\nTwa hours or it wer day,\nAnd he is gane into the bower,\nWherein fair Annet lay.",
      "'Rise up, rise up, fair Annet,' he says,\n'Put on your silken sheene;\nLet us gae to St Marie's kirk,\nAnd see that rich weddeen.'",
      "'My maids, gae to my dressing-room,\nAnd dress to me my hair;\nWhere-eir yee laid a plait before,\nSee yee lay ten times mair.'",
      "'My maids, gae to my dressing-room,\nAnd dress to me my smock;\nThe one half is o the Holland fine,\nThe other o needle-work.'",
      "The horse fair Annet rade upon,\nHe amblit like the wind;\nWi siller he was shod before,\nWi burning gowd behind.",
      "Four and twenty siller bells\nWer a' tied till his mane,\nAnd yae tift o the norland wind,\nThey tinkled ane by ane.",
      "Four and twenty gay gude knights\nRade by fair Annet's side,\nAnd four and twenty fair ladies,\nAs gin she had bin a bride.",
      "And whan she cam to Marie's kirk,\nShe sat on Marie's stean:\nThe cleading that fair Annet had on\nIt skinkled in their een.",
      "And whan she cam into the kirk,\nShe shimmered like the sun;\nThe belt that was about her waist\nWas a' wi pearles bedone.",
      "She sat her by the nut-browne bride,\nAnd her een they wer sae clear,\nLord Thomas he clean forgat the bride,\nWhan fair Annet drew near.",
      "He had a rose into his hand,\nHe gae it kisses three,\nAnd reaching by the nut-browne bride,\nLaid it on fair Annet's knee.",
      "Up than spak the nut-browne bride,\nShe spak wi meikle spite:\n'And whair gat ye that rose-water,\nThat does mak yee sae white?'",
      "'O I did get the rose-water\nWhair ye wull neir get nane,\nFor I did get that very rose-water\nInto my mither's wame.'",
      "The bride she drew a long bodkin\nFrae out her gay head-gear,\nAnd strake fair Annet unto the heart,\nThat word spak nevir mair.",
      "Lord Thomas he saw fair Annet wex pale,\nAnd marvelit what mote bee;\nBut whan he saw her dear heart's blood,\nA wood-wroth wexed hee.",
      "He drew his dagger, that was sae sharp,\nThat was sae sharp and meet,\nAnd drave it into the nut-browne bride,\nThat fell deid at his feet.",
      "'Now stay for me, dear Annet,' he sed,\n'Now stay, my dear,' he cried;\nThen strake the dagger until his heart,\nAnd fell deid by her side.",
      "Lord Thomas was buried without kirk-wa,\nFair Annet within the quire,\nAnd o the tane there grew a birk,\nThe other a bonny briere.",
      "And ay they grew, and ay they threw,\nAs they wad faine be near;\nAnd by this ye may ken right weil\nThey were twa lovers dear.",
      "Sweet Willie and Fair Annie,\nAs they sat on yonder hill,\nIf they had sat from morn till evening,\nThey had not talked their fill.",
    ],
  },

  "child74": {
    title: "Fair Margaret and Sweet William",
    childNumber: "Child 74",
    version: "Version A (Broadside, c.1711)",
    stanzas: [
      "As it fell out on a long summer's day,\nTwo lovers they sat on a hill;\nThey sat together that long summer's day,\nAnd could not talk their fill.",
      "'I see no harm by you, Margaret,\nNor you see none by me;\nBefore tomorrow eight a clock\nA rich wedding shall you see.'",
      "Fair Margaret sat in her bower-window,\nA-combing of her hair,\nAnd there she spied Sweet William and his bride,\nAs they were riding near.",
      "Down she laid her ivory comb,\nAnd up she bound her hair;\nShe went her way forth of her bower,\nBut never more did come there.",
      "When day was gone, and night was come,\nAnd all men fast asleep,\nThen came the spirit of Fair Margaret,\nAnd stood at William's feet.",
      "'God give you joy, you two true lovers,\nIn bride-bed fast asleep;\nLo I am going to my green grass grave,\nAnd am in my winding-sheet.'",
      "When day was come, and night was gone,\nAnd all men waked from sleep,\nSweet William to his lady said,\n'My dear, I have cause to weep.'",
      "'I dreamed a dream, my dear lady,\nSuch dreams are never good;\nI dreamed my bower was full of red swine,\nAnd my bride-bed full of blood.'",
      "'Such dreams, such dreams, my honoured lord,\nThey never do prove good,\nTo dream thy bower was full of swine,\nAnd thy bride-bed full of blood.'",
      "He called up his merry men all,\nBy one, by two, and by three,\nSaying, 'I'll away to Fair Margaret's bower,\nBy the leave of my lady.'",
      "And when he came to Fair Margaret's bower,\nHe knocked at the ring;\nSo ready was her seven brethren\nTo let Sweet William in.",
      "He turned up the covering-sheet:\n'Pray let me see the dead;\nMethinks she does look pale and wan,\nShe has lost her cherry red.'",
      "'I'll do more for thee, Margaret,\nThan any of thy kin;\nFor I will kiss thy pale wan lips,\nTho a smile I cannot win.'",
      "With that bespeak her seven brethren,\nMaking most piteous moan:\n'You may go kiss your jolly brown bride,\nAnd let our sister alone.'",
      "'Deal on, deal on, my merry men all,\nDeal on your cake and your wine;\nFor whatever is dealt at her funeral today\nShall be dealt tomorrow at mine.'",
      "Fair Margaret died on the over-night,\nSweet William died on the morrow;\nFair Margaret died for pure, pure love,\nSweet William died for sorrow.",
      "Margaret was buried in the lower chancel,\nAnd William in the higher;\nOut of her breast there sprang a rose,\nAnd out of his a briar.",
      "They grew till they grew unto the church top,\nAnd then they could grow no higher;\nAnd there they tied in a true lover's knot,\nWhich made all the people admire.",
    ],
  },

  "child76": {
    title: "The Lass of Roch Royal",
    childNumber: "Child 76",
    version: "Version A / Version C / Version F composite",
    stanzas: [
      "Fair Isabell of Rochroyall,\nShe dreamed where she lay,\nShe dreamed a dream of her love Gregory,\nA little before the day.",
      "O softly, softly rose she up,\nAnd softly put she on,\nAnd softly, softly she put on\nThe silks of crimson.",
      "'Saddle me the black,' she says,\n'Saddle me the brown;\nSaddle me the swiftest steed\nThat ever rode the town.'",
      "And she has ridden o'er muir and moss,\nAnd she has ridden right slee,\nUntil she cam to a fair castle,\nStood on a tower sae hie.",
      "She knocked at the castle gate,\nAnd loud and sair cried she:\n'O open, open, Love Gregory,\nAnd let your true love in!'",
      "But there stood by that castle-side\nA nurse, a wicked woman,\nAnd she has raised the gate so wide\nAnd spoken to this woman.",
      "The night was dark, and the wind blew cold,\nAnd her love was fast asleep,\nAnd the bairn that was in her two arms\nFull sore began to weep.",
      "'O waken, waken, Love Gregory,\nWaken and let me in;\nFor the rain rains on my scarlet robe\nAnd the dew is on my skin.'",
      "She knocked long at the castle gate,\nAnd called full loud and sair;\nBut Love Gregory would not rise,\nFor all his lady's prayer.",
      "When the cock had crawn, and day did dawn,\nAnd the sun began to peep,\nThen it rose him Love Gregor,\nAnd sorely did he weep.",
      "'O where is she, my dearest dear,\nThe lass of Roch Royal?\nAnd where is all my heart's delight,\nThat I loved best of all?'",
      "'O cursed be ye, ye wicked nurse,\nA hard heart had ye;\nFor she's gone from my castle gate,\nAnd she's gone far from me.'",
    ],
  },

  "child77": {
    title: "Sweet William's Ghost",
    childNumber: "Child 77",
    version: "Version A (Ramsay's Tea-Table Miscellany, 1740)",
    stanzas: [
      "There came a ghost to Margret's door,\nWith many a grievous groan,\nAnd ay he tirled at the pin,\nBut answer made she none.",
      "'Is that my father Philip,\nOr is't my brother John?\nOr is't my true-love, Willy,\nFrom Scotland new come home?'",
      "'Tis not thy father Philip,\nNor yet thy brother John;\nBut 'tis thy true-love, Willy,\nFrom Scotland new come home.",
      "'O sweet Margret, O dear Margret,\nI pray thee speak to me;\nGive me my faith and troth, Margret,\nAs I gave it to thee.'",
      "'Thy faith and troth thou's never get,\nNor yet will I thee lend,\nTill that thou come within my bower,\nAnd kiss my cheek and chin.'",
      "'If I shoud come within thy bower,\nI am no earthly man;\nAnd shoud I kiss thy rosy lips,\nThy days will not be lang.'",
      "'Is there any room at your head, Willy?\nOr any room at your feet?\nOr any room at your twa sides,\nWhere fain, fain I could sleep?'",
      "'There's no room at my head, Margret,\nThere's no room at my feet;\nThere's no room at my twa sides,\nFor fain, fain thou would sleep.'",
      "'O Margret, take the red, red gold,\nThat's written in my will,\nAnd give it to my sister dear,\nFor I love her wondrous well.'",
      "'O cocks are crowing at merry midnight,\nAnd the wild fowls herald the day;\nGive me my faith and troth again,\nAnd let me fare me on my way.'",
      "'Thy faith and troth thou's never get,\nNor yet will I thee lend,\nTill thou take me to the kirk, Willy,\nAnd wed me wi a ring.'",
      "'My banes are buried in yon kirk-yard,\nIt's far ayont the sea;\nAnd it is my spirit, Margret,\nThat's speaking unto thee.'",
    ],
  },

  "child78": {
    title: "The Unquiet Grave",
    childNumber: "Child 78",
    version: "Version A (Lilly MS, c.1650)",
    stanzas: [
      "'The wind doth blow today, my love,\nAnd a few small drops of rain;\nI never had but one true-love,\nIn cold grave she was lain.",
      "'I'll do as much for my true-love\nAs any young man may;\nI'll sit and mourn all at her grave\nFor a twelvemonth and a day.'",
      "The twelvemonth and a day being up,\nThe dead began to speak:\n'Who sits weeping on my grave,\nAnd will not let me sleep?'",
      "'Tis I, my love, sits on your grave,\nAnd will not let you sleep;\nFor I crave one kiss of your clay-cold lips,\nAnd that is all I seek.'",
      "'You crave one kiss of my clay-cold lips,\nBut my breath smells earthy strong;\nIf you have one kiss of my clay-cold lips,\nYour time will not be long.'",
      "'Tis down in yonder garden green,\nLove, where we used to walk,\nThe finest flower that e'er was seen\nIs withered to a stalk.",
      "'The stalk is withered dry, my love,\nSo will our hearts decay;\nSo make yourself content, my love,\nTill God calls you away.'",
    ],
  },

  "child80": {
    title: "Old Robin of Portingale",
    childNumber: "Child 80",
    version: "Version A (Percy Folio MS, c.1650)",
    stanzas: [
      "God let never so old a man\nMarry so young a wife\nAs did Old Robin of Portingale;\nHe may rue all the days of his life.",
      "For the mayor's daughter of Lin,\nGod wot,\nHe chose her to his wife,\nAnd thought to have lived in quietness\nWith her all the days of his life.",
      "They had not in their wed-bed laid,\nScarcely were both asleep,\nBut up she rose, and forth she goes\nTo Sir Gyles, and fast can weep.",
      "'Sleep you, wake you, fair Sir Gyles?\nOr be not you within?'\n'But I am waking, sweet,' he said,\n'Lady, what is your will?'",
      "'I have bethought me of a wile,\nHow my wed lord we shall spill;\nFour and twenty of my next cousins\nWill help to bring him down.'",
      "With that was heard his little foot-page,\nAs he was watering his master's steed;\nSo softly he heard their words,\nAnd told his lord with speed.",
      "'And thou be sick, my own wed lord,\nSo sore it grieves me;\nBut my five maidens and myself\nWill watch thy bed for thee.'",
      "'And at the waking of your first sleep,\nWe will a hot drink make;\nAnd at the waking of your next sleep,\nYour sorrows we will slake.'",
      "He put a silk coat on his back,\nAnd mail of many a fold;\nAnd he put a steel cap on his head,\nWas gilt with good red gold.",
      "He laid a bright brown sword by his side,\nAnd another at his feet;\nAnd twenty good knights he placed at hand,\nTo watch him in his sleep.",
      "And there he lay full still and close,\nAnd watched in his array;\nAnd by there came the false steward\nWith torch and lantern gay.",
      "He looked east, he looked west,\nTo see if all was clear;\nThen softly stepped to the chamber door,\nAnd thought no man was there.",
      "He stepped in at the chamber door,\nAnd to the bed did go;\nOld Robin started from his sleep,\nAnd struck a deadly blow.",
      "Then up spoke the lady fair,\nFrom bed where she did lie:\n'O spare me now, my own wed lord,\nFor Robin, spare not thee!'",
      "Old Robin with his bright brown sword\nSir Gyles his head has won;\nAnd scarce of all those twenty-four\nDid Robin leave a one.",
      "He called up his little foot-page,\nBefore the peep of day:\n'For this good deed that thou hast done\nMy heir thou shalt be aye.'",
      "Says, 'Ride now, my little foot-page,\nAnd ride thou well with speed,\nAnd when thou com'st to fair London\nTell them Old Robin's deed.'",
      "He has ta'en the lady by the hand,\nHe has led her through the hall;\n'Come, we'll go see what's to be done\nThis morning after all.'",
      "Old Robin took her by the hand,\nAnd said with mournful tone:\n'For this thy deed, my own wed-wife,\nThou shalt make bitter moan.'",
      "He called up his merry men all,\nBy one, by two, by three;\n'Now I must needs to merry London,\nGod be with you all,' said he.",
      "He cut the paps from off her breast,\nGreen wounds full wide and sore;\n'Now I am off to good Jerusalem,\nFor to pray forevermore.'",
      "He took his horse and rode away,\nBy the lee light of the moon;\nAnd there he knelt at the Holy Grave,\nAnd he prayed till he was done.",
      "And about the middle time of the night\nCame twenty-four good knights in;\nSir Gyles he was the foremost man,\nSo well he knew that gin.",
      "Old Robin with his bright brown sword\nHe smote them one by one;\nAnd ere the dawning of the day\nHe left not one alive thereon.",
    ],
  },

  "child81": {
    title: "Little Musgrave and Lady Barnard",
    childNumber: "Child 81",
    version: "Version A (Wit Restor'd, 1658)",
    stanzas: [
      "As it fell one holy-day,\nAs many be in the year,\nWhen young men and maids together did go\nTheir matins and mass to hear.",
      "Little Musgrave came to the church door,\nThe priest was at private mass;\nBut he had more mind of the fair women\nThen he had of our lady's grace.",
      "The one of them was clad in green,\nAnother was clad in pall;\nAnd then came in my lord Barnard's wife,\nThe fairest amongst them all.",
      "She cast an eye on Little Musgrave,\nAs bright as the summer sun;\nAnd then bethought this Little Musgrave,\nThis lady's heart have I won.",
      "Quoth she, 'I have loved thee, Little Musgrave,\nFull long and many a day;'\n'So have I loved you, fair lady,\nYet never word durst I say.'",
      "'I have a bower at Bucklesfordbury,\nFull daintily it is dight;\nIf thou wilt wend thither, thou Little Musgrave,\nThou's lig in mine arms all night.'",
      "Quoth he, 'I thank thee, fair lady,\nThis kindness thou showest to me;\nBut whether it be to my weal or woe,\nThis night I will lig with thee.'",
      "With that he heard, a little tiny page,\nBy this lady's coach as he ran:\n'Although I am my lady's foot-page,\nYet I am Lord Barnard's man.'",
      "'My lord Barnard shall know of this,\nWhether I sink or swim;'\nAnd ever where the bridges were broke\nHe laid him down to swim.",
      "'Asleep or wake, thou Lord Barnard,\nAs thou art a man of life,\nFor Little Musgrave is at Bucklesfordbury,\nAbed with thy own wedded wife.'",
      "'If this be true, thou little tiny page,\nThis thing thou tellest to me,\nThen all the land in Bucklesfordbury\nI freely will give to thee.'",
      "'But if it be a lie, thou little tiny page,\nThis thing thou tellest to me,\nOn the highest tree in Bucklesfordbury\nThen hanged shalt thou be.'",
      "He called up his merry men all:\n'Come saddle me my steed;\nThis night must I to Bucklesfordbury,\nFor I never had greater need.'",
      "When supper was over, and mass was sung,\nAnd every man bound for bed,\nLittle Musgrave and that lady\nIn one chamber were laid.",
      "'Methinks I hear the thresel-cock,\nMethinks I hear the jay;\nMethinks I hear my lord Barnard,\nAnd I would I were away.'",
      "'Lie still, lie still, thou Little Musgrave,\nAnd huggle me from the cold;\n'Tis nothing but a shepherd's boy,\nA driving his sheep to the fold.'",
      "'Is not thy hawk upon a perch?\nThy steed eats oats and hay;\nAnd thou a fair lady in thine arms,\nAnd wouldst thou be away?'",
      "With that my lord Barnard came to the door,\nAnd lit a stone upon;\nHe plucked out three silver keys,\nAnd he opened the doors each one.",
      "He lifted up the coverlet,\nHe lifted up the sheet:\n'How now, how now, thou Little Musgrave,\nDost thou find my lady sweet?'",
      "'I find her sweet,' quoth Little Musgrave,\n'The more 'tis to my pain;\nI would gladly give three hundred pounds\nThat I were on yonder plain.'",
      "'Arise, arise, thou Little Musgrave,\nAnd put thy clothing on;\nIt shall ne'er be said in my country\nI have killed a naked man.'",
      "'I have two swords in one scabbard,\nFull dear they cost my purse;\nAnd thou shalt have the best of them,\nAnd I will have the worse.'",
      "The first stroke that Little Musgrave struck,\nHe hurt Lord Barnard sore;\nThe next stroke that Lord Barnard struck,\nLittle Musgrave ne'er struck more.",
      "With that bespake this fair lady,\nIn bed whereas she lay:\n'Although thou'rt dead, thou Little Musgrave,\nYet I for thee will pray.'",
      "'I wish thee well,' then Barnard cried,\n'And well in yonder town,\nAnd well for all the lords and ladies\nThat on thee look and frown.'",
      "Lord Barnard he hewed off her head\nAnd set it on a spear;\n'The fairest lady in all the land\nHas paid for sin right dear.'",
    ],
  },

  "child82": {
    title: "The Bonny Birdy",
    childNumber: "Child 82",
    version: "Version A (Herd's Manuscripts, 1769)",
    stanzas: [
      "There was a knight, in a summer's night,\nWas riding o'er the lee,\nAnd there he saw a bonny birdy,\nWas singing upon a tree.",
      "'Make haste, make haste, ye gentle knight,\nWhat keeps you here so late?\nIf ye knew what was doing at home,\nI fear you'd look right blate.'",
      "'O what needs I toil day and night,\nMy fair body to kill,\nWhen I have knights at my command,\nAnd ladies at my will?'",
      "'Ye lie, ye lie, ye gentle knight,\nSo loud I hear you lie;\nYour lady has a knight in her arms two\nThat she loves far better nor thee.'",
      "'Ye lie, ye lie, ye bonny birdy,\nHow you lie upon my sweet!\nI will take out my bonny bow,\nAnd in truth I will you sheet.'",
      "'But before ye have your bow well bent,\nAnd all your arrows yare,\nI will flee to another tree,\nWhere I can better fare.'",
      "'O where were you gotten, and where were you hatched?\nO bonny birdy, tell me.'\n'O I was hatched in good green wood,\nIn a holly tree;\nA gentleman my nest did harry,\nAnd gave me to his lady.'",
      "'With good white bread and farrow-cow milk\nHe bade her feed me oft,\nAnd gave her a little summer wand\nTo ding me seldom and soft.'",
      "'With good white bread and farrow-cow milk\nI wot she fed me nought,\nBut with a little summer wand\nShe dinged me sore and oft;\nIf she had done as ye her bade,\nI would not tell how she has wrought.'",
      "The knight he rode, and the birdy flew,\nThe livelong summer's night,\nTill he came to his lady's bower-door,\nThen even down he did light.",
      "The birdy sat on the top of a tree,\nAnd I wot it sang full dight:\n'What ails you now, ye false lady,\nYe look so pale tonight?'",
      "'I have been sore sick,' the lady said,\n'And near unto my end;'\n'Nay, you have been in another man's arms,\nYe need not now pretend.'",
    ],
  },

  "child83": {
    title: "Child Maurice",
    childNumber: "Child 83",
    version: "Version D (Scots composite, c.1755)",
    stanzas: [
      "Child Maurice hunted the Silver Wood,\nHe hunted it round about;\nAnd nobody that he found therein,\nNor none there was without.",
      "He took his silver comb in hand,\nTo comb his yellow locks;\n'Come hither, thou little foot-page,\nThat runnest lowly by my knee.'",
      "'For thou shalt go to John Steward's wife,\nAnd pray her speak with me;\nAnd as it falls, as many times\nAs knots be knit on a kell.'",
      "'And here I send her a mantle of green,\nAs green as any grass,\nAnd bid her come to the Silver Wood,\nTo hunt with Child Maurice.'",
      "'And here I send her a ring of gold,\nA ring of precious stone;\nAnd bid her come to the Silver Wood,\nLet for no kind of man.'",
      "One while the little boy he walked,\nAnother while he ran,\nUntil he came to John Steward's hall,\nI wis he never blan.",
      "'I am come from Child Maurice,\nA message unto thee;\nAnd Child Maurice, he greets you well,\nAnd ever so well from me.'",
      "'And here he sends you a mantle of green,\nAs green as any grass,\nAnd he bids you come to the Silver Wood,\nTo hunt with Child Maurice.'",
      "'Now peace, now peace, thou little foot-page,\nFor Christ's sake, I pray thee;\nFor if my lord hear one of these words,\nThou must be hanged high.'",
      "John Steward stood under the castle wall,\nAnd he wrote the words every one;\nAnd he called up his horse-keeper:\n'Make ready thou my steed.'",
      "And he cast a leash upon his back,\nAnd he rode to the Silver Wood;\nAnd there he found him Child Maurice,\nSitting upon a block.",
      "With a silver comb in his hand,\nCombing his yellow locks:\n'How now, how now, Child Maurice?\nAlack, how may this be?'",
      "'For thou hast sent her love-tokens,\nMore now than two or three;\nThou hast sent her a mantle of green,\nAs green as any grass.'",
      "'I do not know your lady,' he said,\n'If that I do her see;'\n'O how could I know thy lady dear,\nAmongst so many free?'",
      "'She's not the wife of John Steward,\nFor I have known her long;\nShe is mine own dear mother,\nWhom I have loved so strong.'",
      "Then John Steward took his sword in hand,\nAnd smote off Maurice's head;\nAnd he carried it on the sword's point\nTo show his lady the deed.",
      "'Now here is the head of Child Maurice,\nI pray how like ye this?'\nShe turned away her face and wept:\n'Alas, and woe is me!'",
      "'It is not the head of Child Maurice,\nThe head of my own dear son;\nFor his eyes were as bright as the morning star,\nAnd the hair that round it shone.'",
      "'I got him in my father's house,\nWith much sin and shame;\nI brought him up in the good green wood,\nUnder a different name.'",
      "'O were it not for Child Maurice' sake,\nFor him whom I loved best,\nI'd thrust this sword through my own heart,\nAnd lay me down to rest.'",
      "John Steward pulled out his sword in grief,\nAnd pierced it through his side:\n'Now may the Lord have mercy on my soul,\nFor this is sin and pride.'",
      "Then up and spake her eldest son,\nStood by his mother's knee:\n'If I be living, John Steward's wife,\nI'll be revenged on thee.'",
      "The lady wept, the lady mourned,\nFor her son slain at morn;\nThe one was killed in the morning air,\nHis mother died at eve,\nAnd ere the morning bells were rung,\nThe threesome were all gone.",
    ],
  },

  "child84": {
    title: "Bonny Barbara Allan",
    childNumber: "Child 84",
    version: "Version A (Ramsay's Tea-Table Miscellany, 1740)",
    stanzas: [
      "It was in and about the Martinmas time,\nWhen the green leaves were a-falling,\nThat Sir John Graeme, in the West Country,\nFell in love with Barbara Allan.",
      "He sent his men down through the town,\nTo the place where she was dwelling;\n'O haste and come to my master dear,\nGin ye be Barbara Allan.'",
      "O hooly, hooly rose she up,\nTo the place where he was lying,\nAnd when she drew the curtain by:\n'Young man, I think you're dying.'",
      "'O it's I'm sick, and very very sick,\nAnd tis all for Barbara Allan;'\n'O the better for me ye's never be,\nThough your heart's blood were a-spilling.'",
      "'O dinna ye mind, young man,' said she,\n'When ye was in the tavern a-drinking,\nThat ye made the healths go round and round,\nAnd slighted Barbara Allan?'",
      "He turned his face unto the wall,\nAnd death was with him dealing;\n'Adieu, adieu, my dear friends all,\nAnd be kind to Barbara Allan.'",
      "And slowly, slowly raised she up,\nAnd slowly, slowly left him;\nAnd sighing said she could not stay,\nSince death of life had reft him.",
      "She had not gone a mile but two,\nWhen she heard the dead-bell ringing;\nAnd every jow that the dead-bell gave\nIt cried, 'Woe to Barbara Allan!'",
      "'O mother, mother, make my bed,\nO make it soft and narrow;\nSince my love died for me today,\nI'll die for him tomorrow.'",
      "All in the merry month of May,\nWhen green leaves they were springing,\nThis young man on his death-bed lay,\nFor the love of Barbara Allan.",
      "It fell about the Lammas time,\nWhen the woods grow green and yellow,\nThere was a young man fell in love,\nBut he could not get his fellow.",
    ],
  },

  "child85": {
    title: "Lady Alice",
    childNumber: "Child 85",
    version: "Version A (Percy's Reliques, 1765)",
    stanzas: [
      "Lady Alice was sitting in her bower-window,\nMending her midnight coif,\nAnd there she saw as fine a corpse\nAs ever she saw in her life.",
      "'What bear ye, what bear ye, ye six men tall?\nWhat bear ye on your shoulders?'\n'We bear the corpse of Giles Collins,\nWho was once a true lover of yours.'",
      "'O lay him down gently, ye six men tall,\nAll on the grass so green,\nAnd tomorrow, when the sun goes down,\nLady Alice a corpse shall be seen.'",
      "And she, herself, did dig his grave\nWith her own lily-white hand;\nAnd she herself did bury him\nIn the holy churchyard land.",
      "Lady Alice was buried in the east,\nGiles Collins was buried in the west;\nThere grew a lily from Giles Collins\nThat touched Lady Alice's breast.",
      "There grew a briar from Lady Alice\nThat twined about the yew;\nAnd every time they touched each other\nThey clung so fast and true.",
      "There blew a cold north-easterly wind\nAnd cut this briar in twain;\nWhich never was seen to grow again,\nAnd it never will again.",
    ],
  },

  "child86": {
    title: "Young Benjie",
    childNumber: "Child 86",
    version: "Version A (Herd's Manuscripts, c.1783)",
    stanzas: [
      "Of all the maids of fair Scotland\nThe fairest was Marjorie,\nAnd young Benjie was her own true-love,\nAnd a dear true-love was he.",
      "And wow, but they were lovers dear,\nAnd loved full constantly;\nBut ay the more, when they fell out,\nThe sorier was their plea.",
      "And they have quarrelled on a day,\nTill Marjorie's heart grew wae,\nAnd she said she'd choose another love,\nAnd let Young Benjie go.",
      "And he was stout, and proud-hearted,\nAnd thought it bitterly,\nAnd he's gone by the wan moonlight\nTo meet his Marjorie.",
      "'O open, open, my true love,\nO open and let me in!'\n'I dare not open, Young Benjie,\nMy three brothers are within.'",
      "'Ye lied, ye lied, ye bonny bird,\nSo loud I hear ye lie;\nAs I came by the Lowden banks,\nThey bade good even to me.'",
      "'But fare ye well, my own false love,\nThat I have loved so lang;\nIt sets ye choose another love,\nAnd let Young Benjie gang.'",
      "Then Marjorie turned her round about,\nThe tear blinding her ee:\n'I dare not, dare not let thee in,\nBut I'll come down to thee.'",
      "Then soft, soft went she down the stair,\nAnd low, low down the gait;\nShe put her hand upon the pin,\nBut dared not open it straight.",
      "Young Benjie he stood at the door,\nThe moon shone wondrous clear;\nHe seized her by the waist so slim,\nAnd threw her in the linn so dear.",
      "The stream was strong, the maid was stout,\nAnd loath, loath to be drowned;\nBut ere she won the Lowden banks\nHer fair colour was gone.",
      "Then up bespake her eldest brother:\n'O see ye not what I see?'\nAnd out then spake her second brother:\n'It's our sister Marjorie!'",
      "Out then spake her eldest brother:\n'O how shall we her ken?'\nAnd out then spake her youngest brother:\n'There's a honey-mark on her chin.'",
      "Then they have ta'en up the comely corpse,\nAnd laid it on the ground;\n'O who has killed our own sister,\nAnd how can he be found?'",
      "'The night it is her low lykewake,\nThe morn her burial day,\nAnd we maun watch at mirk midnight,\nAnd hear what she will say.'",
      "With doors ajar, and candle-light,\nAnd torches burning clear,\nThe laid-out corpse, till still midnight,\nThey waked, but nothing hear.",
      "About the middle of the night\nThe cocks began to crow,\nAnd at the dead hour of the night\nThe corpse began to thraw.",
      "'O who has done the wrong, sister,\nOr dared the deadly sin?\nWho was so stout, and feared no doubt,\nAs throw ye o'er the linn?'",
      "'Young Benjie was the first man\nI laid my love upon;\nHe was so stout, and feared no doubt,\nAnd threw me o'er the linn.'",
      "'Shall we Young Benjie head, brothers,\nOr shall we Benjie hang?\nOr shall we pike out his two gray eyes,\nAnd punish him ere he gang?'",
      "'Ye mauna Benjie head, brothers,\nYe mauna Benjie hang,\nBut ye maun pike out his two gray eyes,\nAnd punish him ere he gang.'",
      "'Tie a green cravat round his neck,\nAnd lead him out and in,\nAnd the best servant about your house\nTo wait Young Benjie on.'",
    ],
  },

  "child90": {
    title: "Jellon Grame",
    childNumber: "Child 90",
    version: "Version A (Herd's Manuscripts, c.1783)",
    stanzas: [
      "O Jellon Grame sat in Silver Wood,\nHe whistled and he sang,\nAnd he has called his little foot-page,\nHis errand for to gang.",
      "'Win up, my bonny boy,' he says,\n'As quick as ever you may;\nFor ye maun gang for Lillie Flower,\nBefore the break of day.'",
      "The boy has buckled his belt about,\nAnd through the green-wood ran,\nAnd he came to the lady's bower-door\nBefore the day did dawn.",
      "'O sleep ye, or wake ye, Lillie Flower?\nThe red runs in the rain;\nI sleep not oft, I wake right oft;\nWhas that that kens my name?'",
      "'Ye are bidden come to Silver Wood,\nBut I fear you'll never win hame;\nYe are bidden come to Silver Wood,\nAnd speak wi Jellon Grame.'",
      "'O I will gang to Silver Wood,\nThough I should never win hame;\nFor the thing I most desire on earth\nIs to speak wi Jellon Grame.'",
      "She had not ridden a mile, a mile,\nA mile but barely three,\nEre she came to a new-made grave,\nBeneath a green oak tree.",
      "O then up started Jellon Grame,\nOut of a bush hard by:\n'Light down, light down now, Lillie Flower,\nFor it's here that ye maun lie.'",
      "She lighted off her milk-white steed,\nAnd knelt upon her knee:\n'O mercy, mercy, Jellon Grame!\nFor I'm not prepared to die.'",
      "'Your bairn, that stirs between my sides,\nMaun shortly see the light;\nBut to see it weltering in my blood\nWould be a piteous sight.'",
      "'O should I spare your life,' he says,\n'Until that bairn be born,\nI ken full well your stern father\nWould hang me on the morn.'",
      "'My father you need never dread;\nI'll keep my bairn in the good green wood,\nOr with it I'll beg my bread.'",
      "He took no pity on that lady,\nThough she for life did pray;\nBut pierced her through the fair body,\nAs at his feet she lay.",
      "He felt no pity for that lady,\nThough she was lying dead;\nBut he felt some for the bonny boy\nLay weltering in her blood.",
      "Up has he ta'en that bonny boy,\nGiven him to nurses nine;\nThree to wake, and three to sleep,\nAnd three to go between.",
      "And he's brought up that bonny boy,\nCalled him his sister's son;\nHe thought no man would ever find out\nThe deed that he had done.",
      "But it so fell out upon a time,\nAs a-hunting they did go,\nThat they rested them in Silver Wood,\nUpon a summer day.",
      "Then out it spake that bonny boy,\nWhile the tear stood in his eye:\n'O tell me this now, Jellon Grame,\nAnd I pray you do not lie.'",
      "'The reason that my mother dear\nDoes never take me home;\nTo keep me still in banishment\nIs both a sin and shame.'",
      "'You wonder that your mother dear\nDoes never send for thee;\nLo, there's the place I slew thy mother,\nBeneath that green oak tree.'",
      "With that the boy has bent his bow,\nIt was both stout and long,\nAnd through and through him Jellon Grame\nHe's sent an arrow strong.",
      "'Lie you there now, Jellon Grame,\nMy malison go with thee;\nThe place my mother lies buried in\nIs far too good for thee.'",
    ],
  },

  "child79": {
    title: "The Wife of Usher's Well",
    childNumber: "Child 79",
    version: "Version A (Child's English and Scottish Popular Ballads)",
    stanzas: [
      "It fell about the Martinmas,\nWhen nights are lang and mirk,\nThe carlin wife's three sons came home,\nAnd their hats were of the birch.",
      "It neither grew in syke nor ditch,\nNor yet in ony sheugh;\nBut at the gates o Paradise\nThat birk grew fair eneugh.",
      "'Blow up the fire, my maidens!\nBring water from the well!\nFor a' my house shall feast this night,\nSince my three sons are well.'",
      "The hallow day of Yule are come,\nThe nights are long and dark,\nAnd in it came her own three sons,\nAnd their hats were of birch bark.",
      "And it grew not in the syke or ditch,\nNor in any haugh or fen;\nBut at the very gates of Paradise\nThat birch tree flourished then.",
      "'Blow up the fire now, maidens mine,\nBring water from the well;\nFor a' my house shall feast this night,\nSince my three sons are hale and well.'",
      "And she has made to them a bed,\nShe's made it large and wide;\nAnd she's ta'en her mantle her about,\nSat down at the bedside.",
      "The young cock crew in the merry morning,\nAnd the wild fowl chirped for day;\nThe elder to the younger did say,\n'Dear brother, we must away.'",
      "Up then crew the red, red cock,\nAnd up and crew the gray;\nThe eldest to the youngest said,\n'Tis time we were away.",
      "The cock he hadna crawed but once,\nAnd clapped his wings at a',\nWhen the youngest to the eldest said,\n'Brother, we must awa.",
      "'The cock doth craw, the day doth daw,\nThe channerin worm doth chide;\nGin we be mist out o our place,\nA sair pain we maun bide.",
      "'Fare ye weel, my mother dear!\nFareweel to barn and byre!\nAnd fare ye weel, the bonny lass\nThat kindles my mother's fire!'",
    ],
  },
};

// ============================================================
//  HELPERS
// ============================================================
function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function getSeason(month) {
  // Meteorological seasons, Northern Hemisphere, 0-indexed month
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

function getPool(timeOfDay, season) {
  // Match on time first; season is a bonus filter if matches exist
  const timeMatch = QUOTES.filter((q) => q.time.includes(timeOfDay));
  const seasonMatch = timeMatch.filter(
    (q) => q.season.length === 0 || q.season.includes(season)
  );
  // Prefer season-aware matches; fall back to time-only if pool is too small
  return seasonMatch.length >= 2 ? seasonMatch : timeMatch;
}

function pickQuote(pool, lastId) {
  if (pool.length === 0) return null;
  const candidates = pool.length > 1 ? pool.filter((q) => q !== lastId) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ============================================================
//  THEME TOKENS  (time × season)
// ============================================================
const THEMES = {
  morning: {
    spring: { bg: "#f0ebe0", ink: "#2c2416", accent: "#577144", mist: "#d4e8c2" },
    summer: { bg: "#fdf3d0", ink: "#2c2416", accent: "#9b6322", mist: "#fae89a" },
    autumn: { bg: "#f5e6cc", ink: "#2c2416", accent: "#a84e1b", mist: "#e8c998" },
    winter: { bg: "#eaf0f5", ink: "#1a2530", accent: "#447190", mist: "#c8dde8" },
  },
  afternoon: {
    spring: { bg: "#e8f0dc", ink: "#1e2d14", accent: "#4d7631", mist: "#c5dba8" },
    summer: { bg: "#fef0b0", ink: "#2a2010", accent: "#926417", mist: "#fad870" },
    autumn: { bg: "#f0dcc0", ink: "#2a1e10", accent: "#a04a18", mist: "#ddb880" },
    winter: { bg: "#dde8f0", ink: "#182230", accent: "#3a6888", mist: "#b0cede" },
  },
  evening: {
    spring: { bg: "#2a3520", ink: "#e8f0d8", accent: "#90c060", mist: "#405030" },
    summer: { bg: "#302818", ink: "#f8e8c0", accent: "#e0a040", mist: "#504028" },
    autumn: { bg: "#2e2010", ink: "#f0d8b0", accent: "#d56d25", mist: "#503020" },
    winter: { bg: "#181e28", ink: "#c8d8e8", accent: "#6090b8", mist: "#283040" },
  },
  night: {
    spring: { bg: "#121c10", ink: "#d0e8c0", accent: "#70a850", mist: "#1e2e18" },
    summer: { bg: "#181408", ink: "#f0e0a0", accent: "#c89030", mist: "#282010" },
    autumn: { bg: "#140e08", ink: "#e8c890", accent: "#b76727", mist: "#221408" },
    winter: { bg: "#080c14", ink: "#b0c8e0", accent: "#4d7dad", mist: "#101828" },
  },
};

const TIME_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

const SEASON_LABELS = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

// Decorative glyphs per time of day — plain Unicode, not emoji
// The variation selector \uFE0E forces text rendering (no emoji colour)
const TIME_GLYPHS = {
  morning: "☀\uFE0E",
  afternoon: "◑\uFE0E",
  evening: "☽\uFE0E",
  night: "✦\uFE0E",
};

// ============================================================
//  LYRICS SCREEN COMPONENT
// ============================================================
function LyricsScreen({ entry, stanzaIndex, onClose }) {
  const highlightRef = React.useRef(null);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, []);

  return (
    <div className="lyrics-overlay">
      <button className="lyrics-close" onClick={onClose}>X</button>
      <div className="lyrics-title-block">
        <div className="lyrics-title">{entry.title}</div>
        <div className="lyrics-meta">{entry.childNumber} · {entry.version}</div>
      </div>
      <div className="lyrics-rule">
        <div className="rule-line" />
        <div className="rule-diamond" />
        <div className="rule-line" />
      </div>
      <div className="lyrics-body">
        {entry.stanzas.map((stanza, i) => {
          const isHighlight = i === stanzaIndex;
          return (
            <p
              key={i}
              ref={isHighlight ? highlightRef : null}
              className={isHighlight ? "lyrics-stanza lyrics-stanza--highlight" : "lyrics-stanza"}
            >
              {stanza.split("\n").map((line, j) => (
                <span key={j}>{line}{j < stanza.split("\n").length - 1 && <br />}</span>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
//  MAIN COMPONENT
// ============================================================
export default function FolkClock() {
  const [now, setNow] = useState(new Date());
  const [quote, setQuote] = useState(null);
  const [lastQuote, setLastQuote] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [devTime, setDevTime] = useState(getTimeOfDay(new Date().getHours()));
  const [devSeason, setDevSeason] = useState(getSeason(new Date().getMonth()));
  const [devSearch, setDevSearch] = useState("");
  const [pinnedQuote, setPinnedQuote] = useState(null);

  // Ensure viewport-fit=cover so iOS respects safe-area-inset env() vars
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && !meta.content.includes("viewport-fit")) {
      meta.content += ", viewport-fit=cover";
    }
  }, []);

  const hour = now.getHours();
  const month = now.getMonth();
  const timeOfDay = DEV_MODE ? devTime : getTimeOfDay(hour);
  const season = DEV_MODE ? devSeason : getSeason(month);
  const theme = THEMES[timeOfDay][season];
  const pool = getPool(timeOfDay, season);

  const refresh = useCallback(
    (currentLastQuote) => {
      const next = pickQuote(pool, currentLastQuote);
      if (next) {
        setQuote(next);
        setLastQuote(next);
        setFadeKey((k) => k + 1);
        setShowLyrics(false);
        setPinnedQuote(null);
        setDevSearch("");
      }
    },
    [pool]
  );

  // Initial pick
  useEffect(() => {
    refresh(null);
  }, []);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const next = new Date(now);
    const mins = next.getMinutes();
    const minsUntilNext = 15 - (mins % 15);
    next.setMinutes(next.getMinutes() + minsUntilNext, 0, 0);
    const ms = next - now;
    const t = setTimeout(() => {
      setNow(new Date());
      refresh(null);
    }, ms);
    return () => clearTimeout(t);
  }, [now]);

  // Re-pick when time slot changes
  useEffect(() => {
    if (quote) refresh(null);
  }, [timeOfDay, season]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setShowInfo(false);
        setShowLyrics(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!quote) return null;

  const displayQuote = pinnedQuote || quote;

  const devSearchResults = DEV_MODE && devSearch.trim().length >= 2
    ? QUOTES.filter((q) =>
        q.source.toLowerCase().includes(devSearch.toLowerCase()) ||
        q.text.toLowerCase().includes(devSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Lato:ital,wght@0,400;0,700;1,400&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      height: 100%;
      /* Extend background into safe-area gutters on iOS */
      background: ${theme.bg};
    }

    body {
      background: ${theme.bg};
      transition: background 1.2s ease;
    }

    .folk-root {
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      /* Respect iOS safe-area insets in landscape */
      padding: 1.75rem max(1.5rem, env(safe-area-inset-right)) 1.75rem max(1.5rem, env(safe-area-inset-left));
      font-family: 'IM Fell English', Georgia, serif;
      color: ${theme.ink};
      position: relative;
      overflow: hidden;
      transition: color 1.2s ease;
    }

    .folk-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 20%, ${theme.mist}88 0%, transparent 60%),
        radial-gradient(ellipse at 80% 80%, ${theme.mist}55 0%, transparent 55%);
      pointer-events: none;
      transition: background 1.2s ease;
    }

    .folk-root::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      background-size: 200px 200px;
      pointer-events: none;
      opacity: 0.6;
    }

    /* Header: pinned top */
    .header {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      flex-shrink: 0;
      padding-bottom: 1rem;
    }

    .time-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      opacity: 0.7;
      text-transform: uppercase;
    }

    .glyph { font-size: 1rem; }

    .info-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: ${theme.ink};
      opacity: 0.5;
      padding: 0.25rem 0.5rem;
      text-transform: uppercase;
      transition: opacity 0.2s;
    }
    .info-btn:hover { opacity: 1; }

    /* Ornamental rule */
    .rule {
      position: relative;
      z-index: 1;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      opacity: 0.3;
      flex-shrink: 0;
    }
    .rule-line {
      flex: 1;
      height: 1px;
      background: ${theme.ink};
    }
    .rule-diamond {
      width: 5px;
      height: 5px;
      background: ${theme.accent};
      transform: rotate(45deg);
      flex-shrink: 0;
      transition: background 1.2s ease;
    }

    /* Quote: vertically centered in remaining space */
    .quote-section {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
      overflow-y: auto;
      padding: 0.25rem 0;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .quote-wrap {
      animation: fadeUp 0.7s ease forwards;
      text-align: center;
      width: 100%;
    }

    blockquote {
      font-size: clamp(1.15rem, 4.5vw, 1.9rem);
      line-height: 1.85;
      font-style: normal;
      color: ${theme.ink};
      transition: color 1.2s ease;
    }

    .attribution {
      margin-top: 1.1rem;
      font-size: 1.125rem;
      font-family: 'IM Fell English SC', serif;
      letter-spacing: 0.08em;
      opacity: 0.6;
      font-style: normal;
    }

    /* Footer: pinned bottom */
    .footer {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      flex-shrink: 0;
      padding-top: 1rem;
    }

    .btn-another {
      background: none;
      border: 1px solid ${theme.accent};
      color: ${theme.accent};
      font-family: 'IM Fell English SC', serif;
      font-size: 0.78rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 0.5rem 1.4rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .btn-another:hover {
      background: ${theme.accent};
      color: ${theme.bg};
    }

    .pool-note {
      font-size: 0.75rem;
      opacity: 0.4;
      font-family: 'IM Fell English SC', serif;
      letter-spacing: 0.08em;
    }

    /* Attribution as link */
    .attribution-link {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-family: 'IM Fell English SC', serif;
      font-size: 1.125rem;
      letter-spacing: 0.08em;
      color: ${theme.ink};
      opacity: 0.6;
      font-style: normal;
      text-decoration: underline;
      text-decoration-color: ${theme.accent};
      text-underline-offset: 3px;
      transition: opacity 0.2s;
    }
    .attribution-link:hover { opacity: 1; }

    /* Lyrics overlay — fades in */
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .lyrics-overlay {
      position: fixed;
      inset: 0;
      background: ${theme.bg};
      z-index: 10;
      display: flex;
      flex-direction: column;
      animation: fadeIn 0.2s ease;
      overflow: hidden;
    }


    .lyrics-close {
      position: fixed;
      top: 1.75rem;
      right: 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: ${theme.ink};
      opacity: 0.5;
      padding: 0.25rem 0.5rem;
      transition: opacity 0.2s;
      text-transform: uppercase;
      z-index: 20;
    }
    .lyrics-close:hover { opacity: 1; }

    .lyrics-rule {
      position: relative;
      z-index: 1;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      opacity: 0.3;
      flex-shrink: 0;
      padding: 0.6rem clamp(1.5rem, 8vw, 90px) 0 clamp(1.5rem, 8vw, 90px);
    }

    .lyrics-title-block {
      flex-shrink: 0;
      padding: 1.75rem clamp(1.5rem, 8vw, 90px) 0 clamp(1.5rem, 8vw, 90px);
    }

    .lyrics-title {
      font-family: 'IM Fell English', serif;
      font-size: clamp(1.3rem, 5vw, 1.9rem);
      letter-spacing: 0.02em;
      color: ${theme.ink};
      margin-bottom: 0.2rem;
    }

    .lyrics-meta {
      font-family: 'Lato', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 0.02em;
      opacity: 0.55;
      margin-top: 0.15rem;
    }

    .lyrics-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem clamp(1.5rem, 8vw, 90px) 2rem clamp(1.5rem, 8vw, 90px);
      -webkit-overflow-scrolling: touch;
    }

    .lyrics-stanza {
      font-size: clamp(0.9rem, 3vw, 1.05rem);
      line-height: 1.9;
      margin-bottom: 2.8rem;
      color: ${theme.ink};
      opacity: 0.45;
      transition: opacity 0.3s;
      font-family: 'Lato', sans-serif;
      font-weight: 400;
    }

    .lyrics-stanza--highlight {
      opacity: 1;
      font-weight: 700;
    }
    .overlay {
      position: fixed;
      inset: 0;
      background: ${theme.bg};
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      animation: fadeUp 0.4s ease;
    }

    .info-box {
      max-width: 440px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .info-title {
      font-family: 'IM Fell English SC', serif;
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      color: ${theme.accent};
    }

    .info-body {
      font-size: 0.9rem;
      line-height: 1.8;
      font-style: normal;
      font-family: 'Lato', sans-serif;
    }
    .info-body p + p { margin-top: 1.5rem; }

    .overlay-body .lyrics-rule {
      padding-left: 0;
      padding-right: 0;
      margin-bottom: 0.75rem;
    }

    /* Info overlay */
    .overlay {
      position: fixed;
      inset: 0;
      background: ${theme.bg};
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
      overflow: hidden;
    }

    .overlay-body {
      overflow-y: auto;
      padding: 1.75rem clamp(1.5rem, 8vw, 90px) 2rem clamp(1.5rem, 8vw, 90px);
      max-width: 720px;
      width: 100%;
      -webkit-overflow-scrolling: touch;
    }

    .info-title {
      font-family: 'IM Fell English', serif;
      font-size: clamp(1.3rem, 5vw, 1.9rem);
      letter-spacing: 0.02em;
      color: ${theme.ink};
      margin-bottom: 0.75rem;
    }

    /* Dev panel */
    .dev-bar {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 20;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      background: ${theme.bg};
      border: 1px solid ${theme.accent};
      padding: 0.5rem 0.75rem;
      opacity: 0.85;
      min-width: 280px;
    }
    .dev-bar:hover { opacity: 1; }

    .dev-bar-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .dev-search-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      border-top: 1px solid ${theme.accent}44;
      padding-top: 0.35rem;
    }

    .dev-bar label {
      font-family: 'IM Fell English SC', serif;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: ${theme.ink};
      opacity: 0.6;
      text-transform: uppercase;
      flex-shrink: 0;
    }
    .dev-bar select {
      background: none;
      border: none;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: ${theme.accent};
      cursor: pointer;
      text-transform: uppercase;
    }

    .dev-search-input {
      background: none;
      border: none;
      border-bottom: 1px solid ${theme.accent}66;
      font-family: 'IM Fell English', serif;
      font-size: 0.7rem;
      color: ${theme.ink};
      padding: 0.1rem 0.2rem;
      flex: 1;
      outline: none;
      min-width: 0;
    }
    .dev-search-input::placeholder { opacity: 0.35; }

    .dev-pin-clear {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.65rem;
      color: ${theme.accent};
      opacity: 0.7;
      padding: 0;
      flex-shrink: 0;
    }
    .dev-pin-clear:hover { opacity: 1; }

    .dev-results {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      border-top: 1px solid ${theme.accent}44;
      padding-top: 0.35rem;
      max-height: 220px;
      overflow-y: auto;
    }

    .dev-result-item {
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      padding: 0.25rem 0.3rem;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      border-radius: 2px;
      transition: background 0.15s;
    }
    .dev-result-item:hover { background: ${theme.accent}22; }

    .dev-result-source {
      font-family: 'IM Fell English SC', serif;
      font-size: 0.63rem;
      letter-spacing: 0.06em;
      color: ${theme.accent};
    }

    .dev-result-preview {
      font-family: 'IM Fell English', serif;
      font-size: 0.67rem;
      color: ${theme.ink};
      opacity: 0.6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="folk-root">

        {/* Header */}
        <div className="header">
          <div className="time-badge">
            <span className="glyph">{TIME_GLYPHS[timeOfDay]}</span>
            {TIME_LABELS[timeOfDay]} · {SEASON_LABELS[season]}
          </div>
          <button className="info-btn" onClick={() => setShowInfo(true)}>
            About
          </button>
        </div>

        {/* Top rule */}
        <div className="rule">
          <div className="rule-line" />
          <div className="rule-diamond" />
          <div className="rule-line" />
        </div>

        {/* Quote: centered in flex space */}
        <div className="quote-section">
          <div key={fadeKey} className="quote-wrap">
            <blockquote>
              {displayQuote.text.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < displayQuote.text.split("\n").length - 1 && <br />}
                </span>
              ))}
            </blockquote>
            <p className="attribution">
              {displayQuote.lyricsKey && LYRICS[displayQuote.lyricsKey]
                ? <button className="attribution-link" onClick={() => setShowLyrics(true)}>— {displayQuote.source}</button>
                : <>— {displayQuote.source}</>
              }
            </p>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="rule">
          <div className="rule-line" />
          <div className="rule-diamond" />
          <div className="rule-line" />
        </div>

        {/* Footer */}
        <div className="footer">
          <button className="btn-another" onClick={() => refresh(lastQuote)}>
            Another
          </button>
          <p className="pool-note">
            {pool.length} verse{pool.length !== 1 ? "s" : ""} for this {timeOfDay}
          </p>
        </div>

        {/* Info overlay */}
        {showInfo && (
          <div className="overlay">
            <button className="lyrics-close" onClick={() => setShowInfo(false)}>X</button>
            <div className="overlay-body">
              <div className="info-title">About This Collection</div>
              <div className="lyrics-rule">
                <div className="rule-line" />
                <div className="rule-diamond" />
                <div className="rule-line" />
              </div>
              <div className="info-body">
                <p>
                  These verses are drawn from the Child Ballads — 305 traditional English
                  and Scottish folk songs, collected by Francis James Child between
                  1882 and 1898. They were passed down orally for centuries before anyone
                  wrote them down, reshaped by every singer who learned them.
                </p>
                <p>
                  Each verse is chosen to match the time of day and season where you are.
                  The words have been lightly modernised where needed.
                </p>
                <p>
                  The verses are beautiful enough on their own, but they are meant to be sung.
                  Find recordings, listen to them, learn them, and sing them!
                </p>
                <p>
                  A new verse appears every 15 minutes, or press "Another" whenever you like.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lyrics overlay */}
        {showLyrics && displayQuote.lyricsKey && LYRICS[displayQuote.lyricsKey] && (
          <LyricsScreen
            entry={LYRICS[displayQuote.lyricsKey]}
            stanzaIndex={displayQuote.stanzaIndex}
            onClose={() => setShowLyrics(false)}
          />
        )}
        {DEV_MODE && (
          <div className="dev-bar">
            <div className="dev-bar-row">
              <label>Time</label>
              <select value={devTime} onChange={(e) => { setDevTime(e.target.value); setFadeKey((k) => k + 1); }}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
              <label>Season</label>
              <select value={devSeason} onChange={(e) => { setDevSeason(e.target.value); setFadeKey((k) => k + 1); }}>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="autumn">Autumn</option>
                <option value="winter">Winter</option>
              </select>
            </div>
            <div className="dev-search-row">
              <label>Find</label>
              <input
                className="dev-search-input"
                type="text"
                value={devSearch}
                onChange={(e) => { setDevSearch(e.target.value); setPinnedQuote(null); setShowLyrics(false); }}
                placeholder="source or text…"
                spellCheck={false}
              />
              {pinnedQuote && (
                <button className="dev-pin-clear" onClick={() => { setPinnedQuote(null); setDevSearch(""); setShowLyrics(false); }}>✕</button>
              )}
            </div>
            {devSearchResults.length > 0 && (
              <div className="dev-results">
                {devSearchResults.map((q, i) => (
                  <button
                    key={i}
                    className="dev-result-item"
                    onClick={() => {
                      setPinnedQuote(q);
                      setFadeKey((k) => k + 1);
                      setShowLyrics(false);
                      setDevSearch(q.source);
                    }}
                  >
                    <span className="dev-result-source">{q.source}</span>
                    <span className="dev-result-preview">{q.text.split("\n")[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}

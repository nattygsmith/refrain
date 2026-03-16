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
  // --- Riddles Wisely Expounded (Child 1) ---
  {
    text: "He knocked at the lady's gate,\nOne evening when it was late.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["evening"],
    season: [],
  },
  {
    text: "The youngest sister, fair and bright,\nShe lay beside him all through the night.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["night"],
    season: [],
  },
  {
    text: "And in the morning, come the day,\nShe said, 'Young man, will you marry me?'",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["morning"],
    season: [],
  },
  // --- Lady Isabel and the Elf-Knight (Child 4) ---
  {
    text: "Fair lady Isabel sits in her bower sewing,\nThere she heard an elf-knight blowing his horn,\nThe first morning in May.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["morning"],
    season: ["spring"],
  },
  {
    text: "They rode till they came to the sweet water side,\nThree hours before it was day.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["night"],
    season: [],
  },
  // --- The Fair Flower of Northumberland (Child 9) ---
  {
    text: "Thus rode she all one winter's night,\nTill Edenborow they saw in sight.",
    source: "The Fair Flower of Northumberland (Child 9)",
    time: ["night"],
    season: ["winter"],
    // notes: "Child 9 = The Fair Flower of Northumberland (not The Fause Knight, a common mix-up). No modernization needed."
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
  },
  // --- Thomas Rymer (Child 37) ---
  {
    text: "And see not ye that bonny road,\nWhich winds about the fernie brae?\nThat is the road to fair Elfland,\nWhere you and I this night maun gae.",
    source: "Thomas Rymer (Child 37)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 14. No modernization needed."
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
  // --- Clerk Colvill (Child 42) ---
  {
    text: "And he is on to Clyde's water,\nBy the lee light of the moon.",
    source: "Clerk Colvill (Child 42)",
    time: ["night"],
    season: [],
    // notes: "Version C stanza 5. 'An'\u2192'And', 'licht'\u2192'light', 'o'\u2192'of'."
  },
  // --- The Broomfield Hill (Child 43) ---
  {
    text: "The one rode early in the morning,\nThe other in the afternoon.",
    source: "The Broomfield Hill (Child 43)",
    time: ["afternoon"],
    season: [],
  },
  {
    text: "She pulled the blossom of the broom,\nThe blossom it smells sweet.",
    source: "The Broomfield Hill (Child 43)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  // --- Captain Wedderburn's Courtship (Child 46) ---
  {
    text: "The moon shone bright, and it cast a fair light.",
    source: "Captain Wedderburn's Courtship (Child 46)",
    time: ["night"],
    season: [],
    // notes: "Single-line quote \u2014 may wish to expand if a fuller stanza can be confirmed."
  },
  // --- Proud Lady Margaret (Child 47) ---
  {
    text: "Twas on a night, an evening bright,\nWhen the dew began to fall,\nLady Margaret was walking up and down,\nLooking o'er her castle wall.",
    source: "Proud Lady Margaret (Child 47)",
    time: ["evening"],
    season: [],
    // notes: "Version A stanza 1. 'fa'\u2192'fall'."
  },
  {
    text: "There was a knight, in a summer's night,\nAppeared in a lady's hall,\nAs she was walking up and down,\nLooking o'er her castle wall.",
    source: "Proud Lady Margaret (Child 47)",
    time: ["night"],
    season: ["summer"],
    // notes: "Version B stanza 1. No modernization needed."
  },
  // --- The Bonny Hind (Child 50) ---
  {
    text: "It's May she comes and May she goes,\nDown by the garden green,\nIt's there she spied a good young squire,\nAs good as e'er she seen.",
    source: "The Bonny Hind (Child 50)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  // --- Sir Patrick Spens (Child 58) ---
  {
    text: "Late late last night I saw the new moon,\nWith the old moon in her arm;\nAnd I fear, I fear, my dear master,\nThat we will come to harm.",
    source: "Sir Patrick Spens (Child 58)",
    time: ["night"],
    season: ["winter"],
  },
  // --- Child Waters (Child 63) ---
  {
    text: "Lord John's mother in her bower\nWas sitting all alone;\nWhen in the silence of the night\nShe heard fair Ellen's moan.",
    source: "Child Waters (Child 63)",
    time: ["night"],
    season: [],
  },
  // --- Clerk Saunders (Child 69) ---
  {
    text: "They baith lay still, and slept sound,\nUntil the sun began to sheen;\nShe drew the curtains a wee bit,\nAnd dull and drowsy was his een.",
    source: "Clerk Saunders (Child 69)",
    time: ["morning"],
    season: [],
    // notes: "een = Scots for 'eyes'. Light modernisation: sleeped\u2192slept, Untill\u2192Until, drowsie\u2192drowsy."
  },
  // --- Willie and Lady Maisry (Child 70) ---
  {
    text: "You must come into my bower\nWhen the evening bells do ring,\nAnd you must come into my bower\nWhen the evening mass doth sing.",
    source: "Willie and Lady Maisry (Child 70)",
    time: ["evening"],
    season: [],
  },
  // --- The Clerk's Twa Sons o Owsenford (Child 72) ---
  {
    text: "The bonny clerks they died that morn,\nTheir loves died lang ere noon.",
    source: "The Clerk's Twa Sons o Owsenford (Child 72)",
    time: ["morning"],
    season: [],
    // notes: "'clerks'=scholars/students. 'lang ere noon'=long before noon. No modernization: 'lang' kept for Scots sound."
  },
  // --- Lord Thomas and Annet (Child 73) ---
  {
    text: "Sweet Willie and Fair Annie,\nAs they sat on yonder hill,\nIf they had sat from morn 'til evening,\nThey had not talked their fill.",
    source: "Lord Thomas and Annet (Child 73)",
    time: ["evening"],
    season: [],
  },
  // --- Fair Margaret and Sweet William (Child 74) ---
  {
    text: "As it fell out on a long summer's day,\nTwo lovers they sat on a hill;\nThey sat together that long summer's day,\nAnd could not talk their fill.",
    source: "Fair Margaret and Sweet William (Child 74)",
    time: ["afternoon"],
    season: ["summer"],
  },
  // --- The Lass of Roch Royal (Child 76) ---
  {
    text: "Fair Isabell of Rochroyall,\nShe dreamed where she lay,\nShe dreamed a dream of her love Gregory,\nA little before the day.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: [],
  },
  {
    text: "The night was dark, and the wind blew cold,\nAnd her love was fast asleep,\nAnd the bairn that was in her two arms\nFull sore began to weep.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: ["winter"],
  },
  {
    text: "When the cock had crawn, and day did dawn,\nAnd the sun began to peep,\nThen it rose him Love Gregor,\nAnd sorely did he weep.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["morning"],
    season: [],
    // notes: "Version F. 'raise'\u2192'rose'; 'sair, sair'\u2192'sorely'. New stanza \u2014 distinct from existing #18 and #19 from same ballad."
  },
  // --- Sweet William's Ghost (Child 77) ---
  {
    text: "O cocks are crowing at merry midnight,\nAnd the wild fowls herald the day;\nGive me my faith and troth again,\nAnd let me fare me on my way.",
    source: "Sweet William's Ghost (Child 77)",
    time: ["night"],
    season: [],
    // notes: "Modernised: 'a merry midnight'\u2192'at merry midnight'; 'are boding day'\u2192'herald the day'."
  },
  // --- The Unquiet Grave (Child 78) ---
  {
    text: "The wind does blow today, my love,\nAnd a few small drops of rain;\nI never had but one true-love,\nIn a cold grave she was lain.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn", "winter"],
  },
  {
    text: "'Tis down in yonder garden green,\nLove, where we used to walk,\nThe finest flower that e'er was seen\nIs withered to a stalk.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
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
  // --- Old Robin of Portingale (Child 80) ---
  {
    text: "And about the middle time of the night\nCame twenty-four good knights in;\nSir Gyles he was the foremost man,\nSo well he knew that gin.",
    source: "Old Robin of Portingale (Child 80)",
    time: ["night"],
    season: [],
    // notes: "Stanza 23. Light spelling modernisation only. 'gin' = scheme/trap."
  },
  // --- Little Musgrave and Lady Barnard (Child 81) ---
  {
    text: "When supper was over, and mass was sung,\nAnd every man bound for bed,\nLittle Musgrave and that lady\nIn one chamber were laid.",
    source: "Little Musgrave and Lady Barnard (Child 81)",
    time: ["evening"],
    season: [],
  },
  {
    text: "Methinks I hear the thresel-cock,\nMethinks I hear the jay;\nMethinks I hear my lord Barnard,\nAnd I would I were away.",
    source: "Little Musgrave and Lady Barnard (Child 81)",
    time: ["morning"],
    season: [],
    // notes: "thresel=throstle (song thrush). jaye\u2192jay. Kept 'thresel' for atmosphere."
  },
  // --- The Bonny Birdy (Child 82) ---
  {
    text: "There was a knight, in a summer's night,\nWas riding o'er the lee,\nAnd there he saw a bonny birdy,\nWas singing upon a tree.",
    source: "The Bonny Birdy (Child 82)",
    time: ["night"],
    season: ["summer"],
    // notes: "Version A stanza 1. 'oer'\u2192'o'er'. Opening line shared with Child 47 Version B (#45) \u2014 different ballads, accepted."
  },
  // --- Child Maurice (Child 83) ---
  {
    text: "The one was killed in the morning air,\nHis mother died at eve,\nAnd ere the morning bells were rung,\nThe threesome were all gone.",
    source: "Child Maurice (Child 83)",
    time: ["morning", "evening"],
    season: [],
    // notes: "Version D stanza 30. 'mornin'\u2192'morning' (twice); 'een'\u2192'eve'; 'or'\u2192'ere'; 'was rung'\u2192'were rung'; 'a gane'\u2192'all gone'."
  },
  // --- Bonny Barbara Allan (Child 84) ---
  {
    text: "It was in and about the Martinmas time,\nWhen the green leaves were a-falling.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  {
    text: "All in the merry month of May,\nWhen green leaves they were springing,\nThis young man on his death-bed lay,\nFor the love of Barbara Allen.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  {
    text: "It fell about the Lammas time,\nWhen the woods grow green and yellow.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  // --- Lady Alice (Child 85) ---
  {
    text: "Lady Alice was sitting in her bower-window,\nMending her midnight coif,\nAnd there she saw as fine a corpse\nAs ever she saw in her life.",
    source: "Lady Alice (Child 85)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 1. 'quoif'\u2192'coif'."
  },
  {
    text: "O lay him down gently, ye six men tall,\nAll on the grass so green,\nAnd tomorrow, when the sun goes down,\nLady Alice a corpse shall be seen.",
    source: "Lady Alice (Child 85)",
    time: ["evening"],
    season: [],
    // notes: "Version A stanza 3. No modernisation needed."
  },
  // --- Young Benjie (Child 86) ---
  {
    text: "And he was stout, and proud-hearted,\nAnd thought it bitterly,\nAnd he's gone by the wan moonlight\nTo meet his Marjorie.",
    source: "Young Benjie (Child 86)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 4. 'ot'\u2192'it'; 'hes gaen'\u2192'he's gone'."
  },
  // --- Jellon Grame (Child 90) ---
  {
    text: "Win up, my bonny boy, he says,\nAs quick as ever you may;\nFor ye maun gang for Lillie Flower,\nBefore the break of day.",
    source: "Jellon Grame (Child 90)",
    time: ["night"],
    season: [],
    // notes: "Stanza 2. 'eer'\u2192'ever'."
  },
  // --- The Gay Goshawk (Child 96) ---
  {
    text: "And well he knew that lady fair\nAmong her maidens free,\nFor the flower that springs in May morning\nWas not so sweet as she.",
    source: "The Gay Goshawk (Child 96)",
    time: ["morning"],
    season: ["spring"],
    // notes: "Version E stanza 12. 'kent'\u2192'knew'; 'ladye feir'\u2192'lady fair'."
  },
  // --- Brown Adam (Child 98) ---
  {
    text: "It was late, late in the evening,\nLate, late in the afternoon,\nThere came a knight to Brown Adam's house,\nAnd he was clad all in brown.",
    source: "Brown Adam (Child 98)",
    time: ["evening", "afternoon"],
    season: [],
    // notes: "Opening stanza. No modernisation needed."
  },
  // --- Johnie Scot (Child 99) ---
  {
    text: "O up then rose him Johnie Scot,\nAn hour before the day,\nAnd he is on to Fair Ellen's bower,\nTo hear what she did say.",
    source: "Johnie Scot (Child 99)",
    time: ["night"],
    season: [],
    // notes: "Version A. Pre-dawn rising stanza. No modernisation needed."
  },
  // --- Willie o Winsbury (Child 100) ---
  {
    text: "He's mounted her on a milk-white steed,\nHimself on a dapple-grey,\nAnd made her a lady of as much land\nShe could ride in a whole summer day.",
    source: "Willie o Winsbury (Child 100)",
    time: ["morning", "afternoon"],
    season: ["summer"],
  },
  // --- Rose the Red and White Lily (Child 103) ---
  {
    text: "She hadna been in fair France\nA twelvemonth and a day,\nTill there she heard the morning drum\nBeat out at break of day.",
    source: "Rose the Red and White Lily (Child 103)",
    time: ["morning"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Famous Flower of Serving-Men (Child 106) ---
  {
    text: "She dressed herself in man's array,\nAnd to the king's court took her way,\nShe rode till she came to the palace gate,\nOne morning when it was late.",
    source: "The Famous Flower of Serving-Men (Child 106)",
    time: ["morning"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Baffled Knight (Child 112) ---
  {
    text: "As I went out one May morning,\nTo view the fields and meadows gay,\nI met a maid came out of the wood,\nAnd she had lost her way.",
    source: "The Baffled Knight (Child 112)",
    time: ["morning"],
    season: ["spring"],
    // notes: "No modernisation needed."
  },
  // --- The Great Silkie of Sule Skerry (Child 113) ---
  {
    text: "Then one arose at her bed-foot,\nA grumbly guest I'm sure was he.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["night"],
    season: [],
  },
  {
    text: "And it shall come to pass on a summer's day,\nWhen the sun shines hot on every stone.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning", "afternoon"],
    season: ["summer"],
  },
  {
    text: "And he'll go out on a May morning,\nAnd he'll kill both my wee son and me.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning"],
    season: ["spring"],
  },
  // --- Johnie Cock (Child 114) ---
  {
    text: "Johnie rose up in a May morning,\nCalled for water to wash his hands,\nAnd he has called for his good gray hounds,\nThat lay bound in iron bands.",
    source: "Johnie Cock (Child 114)",
    time: ["morning"],
    season: ["spring"],
  },
  // --- Robin Hood and the Monk (Child 119) ---
  {
    text: "John early in a May morning,\nLooking his shoes upon,\nHe took him to Nottingham,\nTo matins all alone.",
    source: "Robin Hood and the Monk (Child 119)",
    time: ["morning"],
    season: ["spring"],
    // notes: "Version A. 'morow'\u2192'morning'. 'Much' (the miller's son) rendered as 'John' in this version."
  },
  // --- Sir Hugh, or, The Jew's Daughter (Child 155) ---
  {
    text: "She's taen him to her cellar dark,\nAt the hour o midnight keen;\nShe's stabbed him with a little penknife,\nAnd put him in the well sae deep.",
    source: "Sir Hugh, or, The Jew's Daughter (Child 155)",
    time: ["night"],
    season: [],
    // notes: "Version B. 'o midnight keen' = of sharp/bitter midnight. No modernisation needed."
  },
  // --- Durham Field (Child 159) ---
  {
    text: "The sixth of August the muster was,\nEarly in a morning clear;\nOur English archers their bows did bend,\nAnd many a black blade did appear.",
    source: "Durham Field (Child 159)",
    time: ["morning"],
    season: [],
    // notes: "'black blade' substituted for 'black bill' (a pole weapon with blackened blade) for readability. No other modernisation."
  },
  // --- The Battle of Otterburn (Child 161) ---
  {
    text: "It fell about the Lammas tide,\nWhen the muir-men win their hay,\nThe doughty Douglas bound him to ride\nInto England, to drive a prey.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    // notes: "Version C stanza 1. Lammas = early August harvest festival. No modernisation needed."
  },
  {
    text: "But up then spake a little page,\nBefore the peep of dawn:\nO waken ye, waken ye, my good lord,\nFor Percy's hard at hand.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["night"],
    season: [],
    // notes: "Version C stanza 17. No modernisation needed."
  },
  {
    text: "This deed was done at Otterburn,\nAbout the breaking of the day;\nEarl Douglas was buried at the bracken-bush,\nAnd Percy led captive away.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["morning"],
    season: [],
    // notes: "Version B stanza 14. No modernisation needed."
  },
  // --- Sir Andrew Barton (Child 167) ---
  {
    text: "As it befell in midsummer-time,\nWhen birds sing sweetly on every tree.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning"],
    season: ["summer"],
  },
  {
    text: "When Flora, with her fragrant flowers,\nBedecked the earth so trim and gay,\nAnd Neptune, with his dainty showers,\nCame to present the month of May.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  {
    text: "Lord Howard then, of courage bold,\nWent to the sea with pleasant cheer,\nNot curbed with winter's piercing cold,\nThough it was the stormy time of the year.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["winter"],
  },
  {
    text: "With pikes, and guns, and bowmen bold,\nThis noble Howard is gone to the sea,\nOn the day before Midsummer's Eve,\nAnd out at Thames mouth sailed they.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["evening"],
    season: ["summer"],
  },
  // --- Mary Hamilton (Child 173) ---
  {
    text: "Last night Queen Mary had four Maries,\nThis night she'll have but three;\nThere was Mary Seaton and Mary Beaton,\nAnd Mary Carmichael, and me.",
    source: "Mary Hamilton (Child 173)",
    time: ["night"],
    season: [],
  },
  {
    text: "Last night I washed Queen Mary's feet,\nAnd bore her to her bed;\nThis day she's given me my reward,\nThis gallows-tree to tread.",
    source: "Mary Hamilton (Child 173)",
    time: ["morning", "afternoon"],
    season: [],
  },
  // --- The Death of Parcy Reed (Child 193) ---
  {
    text: "They hunted high, they hunted low,\nThey hunted up, they hunted down,\nUntil the day was past the prime,\nAnd it grew late in the afternoon.",
    source: "The Death of Parcy Reed (Child 193)",
    time: ["afternoon"],
    season: [],
  },
  // --- The Gypsy Laddie (Child 200) ---
  {
    text: "Yestreen I lay in a well-made bed,\nAnd my good lord beside me;\nThis night I'll lie in a tenant's barn,\nWhatever shall betide me.",
    source: "The Gypsy Laddie (Child 200)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 4. 'yestreen'=last night. No modernisation needed."
  },
  {
    text: "Now when our lord came home at even,\nHe speired for his fair lady;\nThe ane she cried, the tither replied,\nShe's awa wi the gypsy laddie.",
    source: "The Gypsy Laddie (Child 200)",
    time: ["evening"],
    season: [],
    // notes: "Version F stanza 8. 'een'\u2192'even'. 'speired'=asked."
  },
  // --- Jamie Douglas (Child 204) ---
  {
    text: "In the morning when I arose,\nMy bonnie palace for to see,\nI came unto my lord's room-door,\nBut he would not speak one word to me.",
    source: "Jamie Douglas (Child 204)",
    time: ["morning"],
    season: [],
    // notes: "Version G stanza 6. No modernisation needed."
  },
  {
    text: "O waly, waly up the bank!\nAnd waly, waly down the brae!\nAnd waly, waly by yon burn-side,\nWhere me and my love were wont to gae!",
    source: "Jamie Douglas (Child 204)",
    time: ["morning", "afternoon"],
    season: [],
    // notes: "Version H stanza 1 ('Waly Waly'). 'waly' = cry of lamentation. No modernisation needed."
  },
  // --- The Braes o Yarrow (Child 214) ---
  {
    text: "Late in the evening, drinking the wine,\nOr early in the morning,\nThey set a combat them between,\nTo fight it out in the dawning.",
    source: "The Braes o Yarrow (Child 214)",
    time: ["evening", "morning"],
    season: [],
    // notes: "Version F stanza 1. 'eenin'\u2192'evening'."
  },
  // --- The Daemon Lover (Child 243) ---
  {
    text: "O sleep ye, wake ye, my husband?\nI wish ye wake in time!\nI would not for ten thousand pounds\nThis night ye knew my mind.",
    source: "The Daemon Lover (Child 243)",
    time: ["night"],
    season: [],
    // notes: "Version C stanza 12. No modernisation needed."
  },
  // --- The Grey Cock (Child 248) ---
  {
    text: "It's now ten at night, and the stars give no light,\nAnd the bells they ring ding, dang;\nHe's met with some delay that caused him to stay,\nBut he will be here ere lang.",
    source: "The Grey Cock (Child 248)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 2. 'gie'\u2192'give'. 'ere lang'=before long."
  },
  {
    text: "Flee, flee up, my bonny grey cock,\nAnd crow when it is day;\nYour neck shall be like the bonny beaten gold,\nAnd your wings of the silver grey.",
    source: "The Grey Cock (Child 248)",
    time: ["morning"],
    season: [],
    // notes: "Version A stanza 6. No modernisation needed."
  },
  // --- Henry Martyn (Child 250) ---
  {
    text: "He had not been sailing but a short winter's night,\nAnd part of a short winter's day,\nWhen he espied a lofty ship,\nCome sailing all along that way.",
    source: "Henry Martyn (Child 250)",
    time: ["night", "morning", "afternoon"],
    season: ["winter"],
    // notes: "No modernisation needed."
  },
  // --- The Kitchie Boy (Child 252) ---
  {
    text: "The day it is gone, and the night's come on,\nAnd the King's court it is begun;\nAll the ladies in the court are going to bed,\nAnd it's time that I were gone.",
    source: "The Kitchie Boy (Child 252)",
    time: ["evening"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- Willie's Lyke-Wake (Child 255) ---
  {
    text: "About the dead hour of the night\nShe heard the bridles ring;\nAnd Janet was as glad of that\nAs any earthly thing.",
    source: "Willie's Lyke-Wake (Child 255)",
    time: ["night"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Knight's Ghost (Child 265) ---
  {
    text: "She looked over her castle wall,\nTo see what she might see;\nShe spied her own dear lord\nCome riding over the lee,\nAt the dead hour of the night.",
    source: "The Knight's Ghost (Child 265)",
    time: ["night"],
    season: [],
    // notes: "'deid'\u2192'dead'. No other modernisation."
  },
  // --- The Suffolk Miracle (Child 272) ---
  {
    text: "A young man riding in the night,\nHis journey for to take,\nHe rode until the morning light,\nFor his true love's sake.",
    source: "The Suffolk Miracle (Child 272)",
    time: ["night", "morning"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Keach i the Creel (Child 281) ---
  {
    text: "But the night was dark, and the way was sair,\nAnd the morn came up on them unaware.",
    source: "The Keach i the Creel (Child 281)",
    time: ["night", "morning"],
    season: [],
    // notes: "'sair' kept for Scots sound (=sore/hard). No other modernisation."
  },
  // --- Trooper and Maid (Child 299) ---
  {
    text: "When the trumpet sounds to horse and away,\nEarly in the morning,\nLeave thy bed and leave thy beau,\nEarly in the morning.",
    source: "Trooper and Maid (Child 299)",
    time: ["morning"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Broom of Cowdenknows (Child 305) ---
  {
    text: "There was a troop of merry gentlemen\nWere riding tween twa knowes;\nThey swore they smelled a bonny lass,\nAs they came by the broom of Cowdenknows.\nIt's up then spake the foremost man,\nSaid, I see her standing there;\nA bonny lass in a green mantle,\nCombing down her yellow hair,\nEarly on a May morning.",
    source: "The Broom of Cowdenknows (Child 305)",
    time: ["morning"],
    season: ["spring"],
    // notes: "'twa knowes'=two hills. No modernisation needed."
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
      padding: 0.6rem 90px 0 90px;
    }

    .lyrics-title-block {
      flex-shrink: 0;
      padding: 1.75rem 90px 0 90px;
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
      padding: 1.25rem 90px 2rem 90px;
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
      padding: 1.75rem 90px 2rem 90px;
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

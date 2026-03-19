import React from "react";

// ============================================================
//  AboutOverlay
//  Full-screen overlay describing the app's source collections.
//
//  Props:
//    onClose  — fn() called when the overlay is dismissed
// ============================================================
export default function AboutOverlay({ onClose }) {
  return (
    <div className="overlay">
      <button className="lyrics-close" onClick={onClose}>X</button>
      <div className="overlay-body">
        <div className="info-title">About This Collection</div>
        <div className="lyrics-rule">
          <div className="rule-line" />
          <div className="rule-diamond" />
          <div className="rule-line" />
        </div>
        <div className="info-body">
          <p>These verses are drawn from several collections:</p>
          <ul>
            <li>
              <strong>The Child Ballads</strong>—305 traditional English and Scottish folk songs
              collected by Francis James Child between 1882 and 1898. They are among the oldest
              surviving songs in the English language.
            </li>
            <li>
              <strong>One Hundred English Folksongs</strong>—100 traditional English folk songs
              collected by Cecil Sharp from roughly 1903–1913 and published in 1916. Sharp gathered
              them from singers across rural England in the early twentieth century, at a time when
              many of these songs were on the verge of being forgotten.
            </li>
            <li>
              <strong>Folk Songs from Somerset</strong>—130 traditional English folk songs
              collected by Cecil J. Sharp and Charles L. Marson from singers across Somerset,
              and published in five series between 1904 and 1911. Sharp later drew on many of
              these songs for his 1916 collection.
            </li>
            <li>
              <strong>English Folk Songs from the Southern Appalachians</strong>—122 traditional
              English folk songs collected by Olive Dame Campbell and Cecil J. Sharp from singers
              in the mountain communities of Virginia, North Carolina, Kentucky, and Tennessee,
              and published in 1917. Many of the songs are British ballads brought to America by
              settlers generations earlier, preserved in the mountains long after they had faded
              from memory elsewhere.
            </li>
            <li>
              <strong>Folk Songs from Newfoundland</strong>—30 traditional folk songs collected by Maud Karpeles in Newfoundland in 1929–30 during two six-week visits. Karpeles collected most of the songs from fishermen and their families in the “outports” of St. Johns. She collected 200 songs (including variants), from which this collection was established. It was published in 1934 with piano accompaniments by Vaughan Williams and his associates.
            </li>
          </ul>
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
  );
}

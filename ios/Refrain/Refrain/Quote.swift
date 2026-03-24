import Foundation

// MARK: - Quote

struct Quote: Codable, Identifiable {
    // 'id' is synthesised from the array index at load time, not stored in JSON.
    // Identifiable conformance lets SwiftUI use quotes directly in ForEach etc.
    var id: Int = 0

    let text: String
    let source: String
    let time: [TimeOfDay]
    let season: [Season]

    // Optional — only present when full lyrics are available for this quote
    let lyricsKey: String?
    let stanzaIndex: Int?
    
    enum CodingKeys: String, CodingKey {
        case text, source, time, season, lyricsKey, stanzaIndex
    }
    }

    // JSON keys match the field names exactly, so no custom CodingKeys needed.


// MARK: - LyricsEntry

struct LyricsEntry: Codable {
    let title: String
    let version: String
    let stanzas: [String]

    // Exactly one of these will be present, depending on the collection.
    // Child Ballads use childNumber; Sharp uses sharpNumber;
    // Campbell/Sharp and others use collectionNumber.
    let childNumber: String?
    let sharpNumber: String?
    let collectionNumber: String?

    /// A human-readable collection label for display — whichever field is present.
    var collectionLabel: String? {
        childNumber ?? sharpNumber ?? collectionNumber
    }
}

// MARK: - TimeOfDay

enum TimeOfDay: String, Codable, CaseIterable {
    case morning
    case afternoon
    case evening
    case night

    /// Returns the time slot for the current time of day.
    static var current: TimeOfDay {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12:  return .morning
        case 12..<17: return .afternoon
        case 17..<21: return .evening
        default:      return .night
        }
    }
}

// MARK: - Season

enum Season: String, Codable, CaseIterable {
    case spring
    case summer
    case autumn
    case winter

    /// Returns the current season based on the month.
    /// Uses meteorological seasons (March–May = spring, etc.).
    static var current: Season {
        let month = Calendar.current.component(.month, from: Date())
        switch month {
        case 3...5:  return .spring
        case 6...8:  return .summer
        case 9...11: return .autumn
        default:     return .winter
        }
    }
}

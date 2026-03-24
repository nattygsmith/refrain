//
//  RefrainWidgetLiveActivity.swift
//  RefrainWidget
//
//  Created by Nathaniel Smith on 3/24/26.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct RefrainWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct RefrainWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: RefrainWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension RefrainWidgetAttributes {
    fileprivate static var preview: RefrainWidgetAttributes {
        RefrainWidgetAttributes(name: "World")
    }
}

extension RefrainWidgetAttributes.ContentState {
    fileprivate static var smiley: RefrainWidgetAttributes.ContentState {
        RefrainWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: RefrainWidgetAttributes.ContentState {
         RefrainWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: RefrainWidgetAttributes.preview) {
   RefrainWidgetLiveActivity()
} contentStates: {
    RefrainWidgetAttributes.ContentState.smiley
    RefrainWidgetAttributes.ContentState.starEyes
}

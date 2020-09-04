---
layout: post
title:  "Build Hacker News iOS Client with SwiftUI"
date:   2020-08-17
categories: SwiftUI
---

After more than one week of swift and SwiftUI self learning. I decide to build a project to polish my understanding on that. The project is described as the title, I plan to build a hacker news client for iPhone, MacOS and iWatch.

By the ways, here are the materials I used to learn iOS development.

- https://cs193p.sites.stanford.edu/
- https://developer.apple.com/tutorials/swiftui/
- https://docs.swift.org/swift-book/LanguageGuide/TheBasics.html

Now let's start!

### Check the hacker news API documentation

https://github.com/HackerNews/API

It uses firebase for the public api, so probably I should also integrate with the firebase for the realtime experience.

https://github.com/firebase/firebase-ios-sdk

### Setup the project

I created a single view app for this project and did not add any ui tests nor the core data module. Because I don't think I need any persistent layer for this app.

### Add model part

```swift
import Foundation

enum ItemType {
    case job
    case story
    case comment
    case poll
    case pollopt
}

struct Item: Identifiable {
    var id: Int
    var type: ItemType
    var by: String
    var time: Date
    var title: String
    var url: URL
    var score: Int
}
```

There are actually more attributes than the item above, but for simplicy other attributes are ignored, I will add them back if really needed. All data type are represented as non optional as they are all necessary attributes to me. The `ItemType` has poll and pollopt types there, which is unclear to me now, but I still leave them there, could be deleted later.

### Add Basic Views

The first view and the most basic one is the item row view. For the moment, it contains only the title, score and the author.

```swift
import SwiftUI

struct ItemView: View {
    var item: Item

    var body: some View {
        VStack(alignment: .leading) {
            Text(item.title)
                .font(.subheadline)
            Text("\(item.score) points by \(item.by)")
                .font(.caption)
        }
    }
}
```

Another view is the list view, which user can see all hacker news posts

```swift
import SwiftUI

struct ItemListView: View {
    var items: [Item]
    
    var body: some View {
        NavigationView {
            List {
                ForEach(items) { item in
                    NavigationLink(destination: WebView(url: item.url)) {
                        ItemView(item: item)
                    }
                }
            }
            .navigationBarTitle("Hacker News")
        }
    }
}
```

There is an `WebView` above, which is defined by ourself. And is used to show the external web content. This one is the first challenge to me. As it uses `WKWebView` which essentially belongs to the old world. You need to bridge it to the new SwiftUI world. The code is as follows, which is th simplest one I could made.

```swift
import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL
    
    func makeUIView(context: UIViewRepresentableContext<WebView>) -> WKWebView {
        let webview = WKWebView()
        let request = URLRequest(url: url, cachePolicy: .returnCacheDataElseLoad)
        webview.load(request)
        return webview
    }
    
    func updateUIView(_ webview: WKWebView, context: UIViewRepresentableContext<WebView>) {
        let request = URLRequest(url: url, cachePolicy: .returnCacheDataElseLoad)
        webview.load(request)
    }
}
```

Until now you can successfully navigate between the item list and the web page, but there a weird gap between the navigator and the web page.

![gap problem](https://user-images.githubusercontent.com/6628202/92063031-b42a3e00-edcc-11ea-854a-ad809c3cd6b1.png)

Let's fix that!

The problem seems on the `NavigationLink`, so probably we should check that element first. Maybe we misse configured. After detail check, it seems the destination view inherit the list view layout. The header part of the list view was left blank there on the destination part.

First attempt, ignoring safe area seems solving the problem. But when I scrolled downward, thare is still a gap. So this method does not solve the problem. Which means I did not figured out the problem reason yet.

```swift
NavigationLink(destination: WebView(url: item.url).edgesIgnoringSafeArea(.top)) {
    ItemView(item: item)
}
```

https://stackoverflow.com/questions/57517803/how-to-remove-the-default-navigation-bar-space-in-swiftui-navigiationview

According to the link and my understanding, the blank area is the navigation title bar area and it will present also on the destination view. So in order to remove the, you need to set the title to nil first and then hide it. So my final implementation is as follows. There is another problem for the back button. But I will leave it for the moment.

```swift
NavigationLink(
    destination: WebView(url: item.url)
        .navigationBarTitle("")
        .navigationBarHidden(true)
) {
    ItemView(item: item)
}
```

Now you can navigate the list item and see the url content, but still no actual data loaded yet. Next step, let's try to fetch the data and fill them to views.

### Add data fetch layer

After searching around for a while, I found an open source project which did the similar stuff I was doing, so I am going to take some from his project.

https://github.com/woxtu/SwiftUI-HackerNews

This project above did not integrate firebase as the data fetch service. Instead it just call the api endpoint and get the json data. So maybe I will do the same, instead of integrating the firebase.

After several tries, I made a hacker new api wrapper using the `URLSession`

```swift
import Foundation
import Combine

struct HackerNewsAPI {
    let baseUrl = "https://hacker-news.firebaseio.com/v0"
    
    private func fetchItem(id: Int, onComplete: @escaping (Item) -> ()) {
        let url = URL(string: "\(baseUrl)/item/\(id).json")
        URLSession.shared.dataTask(with: url!) { (data, _, _) in
            do {
                var item = try JSONDecoder().decode(Item.self, from: data!)
                if item.url == nil {
                    item.url = URL(string: "https://news.ycombinator.com/item?id=\(item.id)")
                }
                DispatchQueue.main.async {
                    onComplete(item)
                }
            } catch {
                print("Unexpected error: \(error).")
                print(data!)
            }
        }
        .resume()
    }
    
    func fetchItems(ids: ArraySlice<Int>, onReceive: @escaping (Item) -> ()) {
        for id in ids {
            fetchItem(id: id, onComplete: onReceive)
        }
    }
    
    func fetchStoryIds(storyCategory: StoryCategory, onComplete: @escaping ([Int]) -> ()) {
        let url = URL(string: "\(baseUrl)/\(storyCategory)stories.json")
        URLSession.shared.dataTask(with: url!) { (data, _, _) in
            let ids = try! JSONDecoder().decode([Int].self, from: data!)
            onComplete(ids)
        }
        .resume()
    }
}

enum StoryCategory: String {
    case top
    case new
    case best
    case ask
    case show
    case job
}
```

And the navigation and data loading also works fine now. How ever, you still can't refresh the list or append new values when pushing up. So, next step is try to figure out a way to add interactions.
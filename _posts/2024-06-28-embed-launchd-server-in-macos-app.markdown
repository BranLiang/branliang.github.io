---
layout: post
title:  "How to embed an executable server in macos"
date:   2024-06-28 17:31:00 +0800
categories: macos
---

![xcode](/assets/images/20240628/xcode.jpeg){: width="100%" }

Recently I am trying to learn a bit macos development by building a [shadowsocks](https://shadowsocks.org) client based on the existing rust library - [shadowsocks rust](https://github.com/shadowsocks/shadowsocks-rust). The idea behind is simple, the app will use the compiled executable to run a server behind the scence, which basically handles all the network proxy job. The client app is used to configure and manage the underlying app server. For example, you can add a new server through manual input or by using a qr code. Also, you can easily subscribe to server providers and download servers easily. 

<!--end_excerpt-->

As usual, I started by googling how to embed a command line app to xcode project, and unexpectedly, there wasn't much useful resources. The only one I found useful is an official guideline - [Embedding a command-line tool in a sandboxed app](https://developer.apple.com/documentation/xcode/embedding-a-helper-tool-in-a-sandboxed-app), so natually I followed this tutorial bindly without knowing much behind the scene. 

Another resource I found useful is the example project from the [service management](https://developer.apple.com/documentation/ServiceManagement) framework, which shows how should I put the property list and how should I register/deregister the service. The only problem is that it doesn't tell you how to start/stop the service. Luckily, I found that I could just use the `launchctl` and trigger the service to start and stop.

However, I got stuck almost immediately after the start. I can't start the underlying server. The problem is that I can register a launchd service using the new [service management](https://developer.apple.com/documentation/ServiceManagement) framework. But when I was trying to start the service, the log shows that I was not allowed to do such operation.

I also tried invoke the executable directly in the terminal, but it will show something like the below

```
[1]    17457 illegal hardware instruction
```

I thought maybe there is something wrong with the executable signing, so I went to that rabbit hole direction but for nothing. At the same time, I also can't set key `StandardOutPath` in the service property list, which means I can't see any logs from the target service.

What should I do? There must be a way.

It turns out that, all problems are caused by the `AppSandbox` entitlement. After removing it from both app and executable entitlement, I could start the executable as a server in the launchd, everything works.

So, in short, if you encounter permission issues, trying removing the `AppSandbox` constraint and try again. I understand that using `AppSandbox` is a best practice, but for beginners for macos, this is such a pain to use that, I will see if I add it back someday later.

## Steps to embed an executable server built by third party in xcode

* Build your executable using your tools (Cargo, Make...)
* Move the executable to the xcode project folder
* Prepare a entitlements without `AppSandbox` key, and use it to sign the executable

```
# Example
codesign -s - -i branliang.Shadoxify.sslocal -o runtime --entitlements sslocal.entitlements -f sslocal
```

* Prepare the launch agent property list, this actually a bit tricky, for your reference, here is my example configuration

![property_list](/assets/images/20240628/property_list.png){: width="100%" }

* Configure the app build phase, make sure both executable and property list are copied to the proper location. Again here is my configuration screenshot for reference.

![build phase](/assets/images/20240628/build_phase.png){: width="100%" }

## Next

That's my first journal to the macos development world. Let's continue exploring!


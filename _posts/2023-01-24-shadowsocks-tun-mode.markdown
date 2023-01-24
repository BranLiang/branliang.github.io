---
layout: post
title:  "Using shadowsocks with utun interface"
date:   2023-01-24 12:54:12 +0800
categories: vpn
---
![shadowsocks](https://github.com/branliang/branliang.github.io/blob/master/assets/images/shadowsocks.png?raw=true){: width="100%" }

As you all know that [shadowsocks](https://shadowsocks.org/) could help to proxy the network traffic to your remote server. However, with the development of the [shadowsocks-rust](https://github.com/shadowsocks/shadowsocks-rust), now it has a new mode which utilizes the unix [tun interface feature](https://en.wikipedia.org/wiki/TUN/TAP). This post will show you briefly how that looks like.

This post uses linux as the test environment, but should be similar to macos.

<!--end_excerpt-->

### What is tun interface?

The unix kernal maintains a division between the hardware and internet layer. And it provides a communication standard that links them. This division is called the `network interface`. You could query the network interface by using command `ip addr`.

```
bran@sslocal:~$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: ens4: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc mq state UP group default qlen 1000
    link/ether 42:01:0a:80:00:02 brd ff:ff:ff:ff:ff:ff
    inet 10.128.0.2/32 metric 100 scope global dynamic ens4
       valid_lft 2771sec preferred_lft 2771sec
    inet6 fe80::4001:aff:fe80:2/64 scope link
       valid_lft forever preferred_lft forever
```

With the interface created, you could then route certain ip traffic to the network interface.

### Why is that useful?

It is common that commertial VPN softwares that uses the network interface feature to route network traffics. One example is the famous [ExpressVPN](https://www.expressvpn.com/). Compare the interfaces and routes table, you could easily find that a new interface is created by the expressvpn when it is enabled.

```
➜  Documents ifconfig
...
utun10: flags=8051<UP,POINTOPOINT,RUNNING,MULTICAST> mtu 1350
	inet 10.140.0.6 --> 10.140.0.5 netmask 0xffffffff
```

A new network interface `utun10` is created when ExpressVPN is turned on.

```
➜  Documents ip route
...
0.0.0.0/1 via 10.140.0.5 dev utun10
10.140.0.1/32 via 10.140.0.5 dev utun10
10.140.0.5/32 via 10.140.0.6 dev utun10
128.0.0.0/1 via 10.140.0.5 dev utun10
```

It routes most of the ip traffic to the new network interface.

So, with this tun approach, you could route all traffic through shadowsocks, compared with the proxy approach, you don't rely on the certain software which needs to support proxy mode. Basically, you could ultilize the shadowsocks as the other commertial VPN software.

### How to enabled the tun mode?

First, let's create a dummy shadowsocks server in a remote computer.

```shell
# You could use your own way to create the server
git clone https://github.com/shadowsocks/shadowsocks-rust.git
cd shadowsocks-rust
cargo build --bin server
./target/debug/ssserver -s 0.0.0.0:8388 -k hello-world -m chacha20-ietf-poly1305
```

Next, let's build a `sslocal` client which has feature `local-tun` enabled.

```shell
git clone https://github.com/shadowsocks/shadowsocks-rust.git
cd shadowsocks-rust
cargo build --features local-tun --bin sslocal
# Replace the ip address below with your server ip address
# You need sudo permission to create tun interface and add new route rules.
sudo ./target/debug/sslocal -s xx.xx.xx.xx:8388 -k hello-world -m chacha20-ietf-poly1305 --tun-interface-address 10.255.0.1/24 --protocol tun
```

Checking the network interfaces, you could see that there is a new `tun0` interface created.

```shell
bran@sslocal:~$ ip addr
...
4: tun0: <POINTOPOINT,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UNKNOWN group default qlen 500
    link/none
    inet 10.255.0.1/24 scope global tun0
       valid_lft forever preferred_lft forever
    inet6 fe80::69e8:35ef:6c29:5fd3/64 scope link stable-privacy
       valid_lft forever preferred_lft forever
```

Checking the ip route table as well, you could find that a new rule is added with `tun0` linked. That means all the traffic send to the subnet `10.255.0.0/24` will be forwrded to the interface `tun0`, which could be read by the `sslocal` client application.

```shell
bran@sslocal:~$ ip route | grep tun0
10.255.0.0/24 dev tun0 proto kernel scope link src 10.255.0.1
```

However, if you try to test the request, you will see that you are still requesting using your native ip interface instead of through the `tun0`.

```shell
bran@sslocal:~$ curl http://wtfismyip.com/json
{
    "YourFuckingIPAddress": "still.my.orginal.ip",
    "YourFuckingLocation": "Council Bluffs, IA, United States",
    "YourFuckingHostname": "aa.bb.cc.dd.bc.googleusercontent.com",
    "YourFuckingISP": "Google Cloud",
    "YourFuckingTorExit": false,
    "YourFuckingCity": "Council Bluffs",
    "YourFuckingCountry": "United States",
    "YourFuckingCountryCode": "US"
}
```

The reason is because the ip route still route your traffic through the default rule. You need to explicitly tell the route to route your traffic through `tun0`.

```shell
bran@sslocal:~$ ip route
default via 10.128.0.1 dev ens4 proto dhcp src 10.128.0.2 metric 100
10.128.0.1 dev ens4 proto dhcp scope link src 10.128.0.2 metric 100
```

Let's find the ip address of domain `wtfismyip.com` and route the traffic to `tun0`.

```shell
bran@sslocal:~$ ping wtfismyip.com
PING wtfismyip.com (95.217.228.176) 56(84) bytes of data.

bran@sslocal:~$ sudo ip route add 95.217.228.176 dev tun0
bran@sslocal:~$ ip route | grep tun0
10.255.0.0/24 dev tun0 proto kernel scope link src 10.255.0.1
95.217.228.176 dev tun0 scope link
```

Check the ip address again using the `curl` command.

```shell
bran@sslocal:~$ curl http://wtfismyip.com/json
{
    "YourFuckingIPAddress": "my.remote.server.ip",
    "YourFuckingLocation": "Council Bluffs, IA, United States",
    "YourFuckingHostname": "aa.b.cc.dd.bc.googleusercontent.com",
    "YourFuckingISP": "Google Cloud",
    "YourFuckingTorExit": false,
    "YourFuckingCity": "Council Bluffs",
    "YourFuckingCountry": "United States",
    "YourFuckingCountryCode": "US"
}
```

Stopping the `sslocal` application and you will see both network interface and route rules are restored without `tun0` interface.

### Next

`tun` feature is still not widely used, the major reason could be lack of supported client software, maybe we could create one and make is feels like using ExpressVPN.


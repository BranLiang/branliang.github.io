---
layout: post
title:  "Install luci-app-ssr-plus in GL-iNET E750"
date:   2021-12-29 19:41:12 +0800
categories: vpn
---

![mudi](https://github.com/branliang/branliang.github.io/blob/master/assets/images/2022032404.jpeg?raw=true)

### TL'DR

This post shows you how to install luci-app-ssr-plus in you GL-iNET mobile router.

### Requirements

- Device: usb150/ar150/ar300m/mifi/ar750/ar750s/x750/x300b/xe300/e750/x1200
- Openwrt: openwrt-19.07.7

### Before you start

It's very hard to compile the package luci-app-ssr-plus alone using [sdk](https://github.com/gl-inet/sdk), and I am providing a precompiled package here.

[Package link](https://github.com/branliang/branliang.github.io/blob/master/assets/file/luci-app-ssr-plus.zip)

### Steps

- (Optional) Restore your device to the factory setting.

So you could have a clean start, otherwise, you may encounter unexpected error. Highly recommended but not necessary.

- Download all the packages and upload to the router using ssh.

```shell
# Upload local package
scp ~/Downloads/luci-app-ssr-plus.zip root@192.168.8.1:/root/luci-app-ssr-plus.zip

# Login to the ssh session
ssh root@192.168.8.1

# Unzip the package
unzip luci-app-ssr-plus.zip
```

- Install luci and login to the luci dashboard

Luci could be installed in the settings -> advanced.

![2022032401.png](https://github.com/branliang/branliang.github.io/blob/master/assets/images/2022032401.png?raw=true)

- Install dependent luci packages

Manual install package `luci-compat`

![2022032402.png](https://github.com/branliang/branliang.github.io/blob/master/assets/images/2022032402.png?raw=true)

- Install downloaded packages in the ssh session

```shell
opkg install \
shadowsocks-libev-config_3.2.5-5_mips_24kc.ipk \
shadowsocksr-libev-alt_2.5.6-5_mips_24kc.ipk \
pdnsd-alt_1.2.9b-par-a8e46ccba7b0fa2230d6c42ab6dcd92926f6c21d_mips_24kc.ipk \
microsocks_1.0-1_mips_24kc.ipk \
dns2socks_2.1-1_mips_24kc.ipk \
shadowsocks-libev-ss-local_3.2.5-5_mips_24kc.ipk \
shadowsocksr-libev-ssr-local_2.5.6-5_mips_24kc.ipk \
shadowsocks-libev-ss-redir_3.2.5-5_mips_24kc.ipk \
simple-obfs_0.0.5-5_mips_24kc.ipk \
tcping_0.3-1_mips_24kc.ipk \
luci-app-ssr-plus_180-10_all.ipk
```

- Refresh the luci window and now you should see the sweet luci ssr plus!

![2022032403.png](https://github.com/branliang/branliang.github.io/blob/master/assets/images/2022032403.png?raw=true)

Enjoy!

### Help

If you have any problem with the above steps, leave an issue in the github!

### Credits

- [Sedap](https://github.com/sedap/gl-inet-ar300m-trojan-luci-app-ssr-plus)





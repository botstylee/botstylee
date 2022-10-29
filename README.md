# BOTSTYLEE _ GAMES

<a href="https://github.com/botstylee/botstylee/network/members"><img title="Forks" src="https://img.shields.io/github/forks/findme-19/antibot_md?label=Forks&color=blue&style=flat-square"></a>
<a href="https://github.com/botstylee/botstylee/watchers"><img title="Watchers" src="https://img.shields.io/github/watchers/findme-19/antibot_md?label=Watchers&color=green&style=flat-square"></a>
<a href="https://github.com/botstylee/botstylee/stargazers"><img title="Stars" src="https://img.shields.io/github/stars/findme-19/antibot_md?label=Stars&color=yellow&style=flat-square"></a>
<a href="https://github.com/botstylee/botstylee/graphs/contributors"><img title="Contributors" src="https://img.shields.io/github/contributors/findme-19/antibot_md?label=Contributors&color=blue&style=flat-square"></a>
<a href="https://github.com/botstylee/botstylee/issues"><img title="Issues" src="https://img.shields.io/github/issues/findme-19/antibot_md?label=Issues&color=success&style=flat-square"></a>
<a href="https://github.com/botstylee/botstylee/issues?q=is%3Aissue+is%3Aclosed"><img title="Issues" src="https://img.shields.io/github/issues-closed/findme-19/antibot_md?label=Issues&color=red&style=flat-square"></a>
<a href="https://github.com/botstylee/botstylee/pulls"><img title="Pull Request" src="https://img.shields.io/github/issues-pr/findme-19/antibot_md?label=PullRequest&color=success&style=flat-square"></a>
<a href="https://github.com/botstylee/botstylee/pulls?q=is%3Apr+is%3Aclosed"><img title="Pull Request" src="https://img.shields.io/github/issues-pr-closed/findme-19/antibot_md?label=PullRequest&color=red&style=flat-square"></a>


#### Deploy to Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/botstylee/botstylee)

#### Heroku Buildpack
| BuildPack | LINK |
|--------|--------|
| **FFMPEG** |[here](https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest) |
| **IMAGEMAGICK** | [here](https://github.com/DuckyTeam/heroku-buildpack-imagemagick) |

### FOR TERMUX USER
1. Type mentioned below given commands one by one in Termux.
```sh
$ pkg upgrade && pkg update && pkg install git nodejs ffmpeg imagemagick nano bash mc -y
$ git clone https://github.com/botstylee/botstylee
$ cd botstylee
$ npm i 
$ node .
```
2. Wait for bot starting...
3. Scan QR code from 2nd device. (Go to whatsapp > Linked Devices > Join `Multi Device Beta` > Click on `link device`)
4. Now your bot is ready to rock n roll.

---------

## INSTALL ON TERMUX WITH UBUNTU

[ INSTALLING UBUNTU ]

```bash
apt update && apt full-upgrade
apt install wget curl git proot-distro
proot-distro install ubuntu
echo "proot-distro login ubuntu" > $PREFIX/bin/ubuntu
ubuntu
```
---------

[ INSTALLING REQUIRED PACKAGES ]

```bash
ubuntu
apt update && apt full-upgrade
apt install wget curl git ffmpeg imagemagick build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev dbus-x11 ffmpeg2theora ffmpegfs ffmpegthumbnailer ffmpegthumbnailer-dbg ffmpegthumbs libavcodec-dev libavcodec-extra libavcodec-extra58 libavdevice-dev libavdevice58 libavfilter-dev libavfilter-extra libavfilter-extra7 libavformat-dev libavformat58 libavifile-0.7-bin libavifile-0.7-common libavifile-0.7c2 libavresample-dev libavresample4 libavutil-dev libavutil56 libpostproc-dev libpostproc55 graphicsmagick graphicsmagick-dbg graphicsmagick-imagemagick-compat graphicsmagick-libmagick-dev-compat groff imagemagick-6.q16hdri imagemagick-common libchart-gnuplot-perl libgraphics-magick-perl libgraphicsmagick++-q16-12 libgraphicsmagick++1-dev
```

---------

[ INSTALLING NODEJS & antibot_md ]

```bash
ubuntu
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
apt install -y nodejs gcc g++ make
git clone https://github.com/botstylee/botstylee
cd botstylee
npm install
npm update
```

---------

## FOR WINDOWS/VPS/RDP USER

* Download And Install Git [`Click Here`](https://git-scm.com/downloads)
* Download And Install NodeJS [`Click Here`](https://nodejs.org/en/download)
* Download And Install FFmpeg [`Click Here`](https://ffmpeg.org/download.html) (**Don't Forget Add FFmpeg to PATH enviroment variables**)
* Download And Install ImageMagick [`Click Here`](https://imagemagick.org/script/download.php)

```bash
git clone https://github.com/botstylee/botstylee
cd botstylee
npm install
npm update
```

---------

## Run

```bash
node .
```

---------

## Arguments `node . [--options] [<session name>]`

### `--self`

Activate self mode (Ignores other)

### `--pconly`

If that chat not from private bot, bot will ignore

### `--gconly`

If that chat not from group, bot will ignore

### `--swonly`

If that chat not from status, bot will ignore

### `--prefix <prefixes>`

* `prefixes` are seperated by each character
Set prefix

### `--server`

Used for [heroku](https://heroku.com/) or scan through website

### `--big-qr`

If small qr unicode doesn't support

### `--restrict`

Enables restricted plugins (which can lead your number to be **banned** if used too often)

* Group Administration `add, kick`

### `--img`

Enable image inspector through terminal

### `--autoread`

If enabled, all incoming messages will be marked as read

### `--nyimak`

No bot, just print received messages and add users to database

### `--test`

**Development** Testing Mode

### `--trace`

```js
conn.logger.level = 'trace'
```

### `--debug`

```js
conn.logger.level = 'debug'
```

---------

## How To Customise Message Display

### Hydrated Buttons Image Location
```bash
conn.sendHydrated(m.chat, 'text', 'footer', 'buffer', 'template-url', 'Template-Name', '0123456789', 'Template-CALL', [
      ['Donate', '/donasi'],
      ['Speed', '/ping'],
      ['Owner', '/owner']
], m, {asLocation: true})
```

### Remove Call Button
```bash
conn.sendHydrated(m.chat, 'text', 'footer', 'buffer', 'template-url', 'Template-Name', null, null, [
      ['Donate', '/donasi'],
      ['Speed', '/ping'],
      ['Owner', '/owner']
    ], m, {asLocation: true})
```

### Remove Both Template & Call Button
```bash
conn.sendHydrated(m.chat, 'text', 'footer', 'buffer', null, null, null, null, [
      ['Donate', '/donasi'],
      ['Speed', '/ping'],
      ['Owner', '/owner']
    ], m, {asLocation: true})
```
### Add/Remove/Edit Buttons
* To remove button, delete `['button', '/button']` line.
* To add button, add `['button', '/button']` code line.
* To edit button, edit `button` name.
```bash
conn.sendHydrated(m.chat, 'text', 'footer', 'buffer', null, null, null, null, [
      ['Button¹', '/button¹'],
      ['Button²', '/button²'],
      ['Button³', '/button³']
    ], m, {asLocation: true})
```

---------

### Thanks To 
**Allah SWT**

[![Nurutomo](https://github.com/Nurutomo.png?size=100)](https://github.com/Nurutomo)
[![BochilGaming](https://github.com/BochilGaming.png?size=100)](https://github.com/BochilGaming)
[![Botstylee](https://github.com/Botstylee.png?size=100)](https://github.com/Botstylee)
#### Contributor
[![Botstylee](https://github.com/botstylee.png?size=100)](https://github.com/Botstylee)

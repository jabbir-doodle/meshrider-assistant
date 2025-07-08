# MeshRider Assistant

Advanced RF Diagnostics & Network Intelligence tool for MeshRider radios.

## Features

- One-click health diagnostics
- Smart troubleshooting with command transparency
- Real-time RF analysis
- Mesh network monitoring
- Professional dark theme UI matching MeshRider Analytics

## Installation

```bash
npm install
npm start
```

## Usage

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Commands Transparency

Hover over any diagnostic button to see the exact commands that will be executed:
- `iw dev wlan0 survey dump` - Channel analysis
- `iwinfo wlan0 assoclist` - Station information
- `batctl o` - Mesh topology
- `/usr/sbin/get_noise_stats.sh` - Noise analysis
- And many more...

## Tech Stack

- React with TypeScript
- Modern CSS Grid/Flexbox
- MeshRider design system
- Professional dark theme

Built with ❤️ for MeshRider radio diagnostics.
# meshrider-assistant

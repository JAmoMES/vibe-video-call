# LinePlanet Video Call App

A modern, high-quality peer-to-peer video calling application powered by **LINE Planet SDK**.

## Features

- **🎥 HD Video Calling**: Crystal clear video quality with adaptive bitrate
- **🔊 High-Quality Audio**: Echo cancellation and noise reduction
- **🖥️ Screen Sharing**: Share your screen with participants
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Modern UI**: Beautiful interface with dark/light themes
- **⚡ Real-time**: Low latency P2P connections
- **🔒 Secure**: End-to-end encrypted communications

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Video SDK**: LINE Planet Kit (WebRTC-based)
- **UI Components**: Radix UI + Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- LinePlanet account and credentials
- Modern browser (Chrome 72+, Safari 14.5+)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vibe-video-call
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000` - the app will automatically redirect to the LinePlanet video call interface.

## LinePlanet Integration

### Configuration

The app includes a configuration interface where you can set up your LinePlanet credentials:

```typescript
interface LinePlanetConfig {
  appId: string; // Your LinePlanet App ID
  env: "eval" | "real"; // Environment (eval for testing, real for production)
  userId: string; // Unique user identifier
  accessToken: string; // Your LinePlanet access token
}
```

### Key Features

1. **Peer-to-Peer Calling**

   - Create or join rooms with simple peer IDs
   - Automatic peer discovery and connection
   - Real-time status updates

2. **Media Controls**

   - Toggle video/audio on demand
   - Screen sharing capabilities
   - Video preview before calling

3. **Call Management**
   - Direct peer-to-peer calling system
   - Connection status monitoring
   - Call verification and acceptance flow

## Development

### Project Structure

```
├── app/
│   ├── lineplanet-call/     # LinePlanet video call page
│   └── page.tsx             # Root page (redirects to lineplanet-call)
├── components/
│   ├── ui/                  # Reusable UI components
│   └── lineplanet-call-client.tsx # Main LinePlanet call client
├── lib/
│   ├── lineplanet.ts        # LinePlanet service wrapper
│   └── lineplanet-auth.ts   # Authentication helpers
└── hooks/
    └── use-lineplanet.ts    # React hook for LinePlanet
```

### LinePlanet Service

The `LinePlanetService` class provides a clean interface for the LINE Planet SDK:

```typescript
// Initialize the SDK
await linePlanetService.initialize(config);

// Start a new call
await linePlanetService.makeCall({ peerId, delegate });

// Join an existing call
await linePlanetService.verifyCall({ peerId, delegate });

// Media controls
await linePlanetService.muteMic(false);
await linePlanetService.muteCamera(false);
await linePlanetService.startMyScreenShare();
```

### React Hook

Use the `useLinePlanet` hook for easy integration:

```typescript
const {
  isInitialized,
  isInCall,
  makeCall,
  verifyCall,
  acceptCall,
  endCall,
  toggleVideo,
  toggleAudio,
  localVideoRef,
  remoteVideoRef,
} = useLinePlanet({ config });
```

## Usage

### Starting a Video Call

1. The app will automatically load the LinePlanet call interface
2. Configure your LinePlanet credentials (App ID, User ID, Access Token)
3. Use video preview to test your camera
4. **For Caller**: Enter peer ID and click "Start Call"
5. **For Callee**: Enter caller's peer ID, click "Verify Call", then "Accept Call"

### During a Call

- **Toggle Video**: Click the video button to turn camera on/off
- **Toggle Audio**: Click the microphone button to mute/unmute
- **Screen Share**: Click the monitor button to share your screen
- **End Call**: Click the red phone button to leave the call

## Browser Support

- **Chrome/Edge**: 72+ (Recommended)
- **Safari**: 14.5+
- **Firefox**: Limited support

## API Reference

For detailed LinePlanet API documentation, visit:

- [LINE Planet Documentation](https://docs.lineplanet.me/)
- [WebPlanetKit API Reference](https://docs.lineplanet.me/web/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:

- Create an issue in this repository
- Contact LinePlanet support: dl_planet_help@linecorp.com
- Check the [FAQ section](https://docs.lineplanet.me/faq/)

## License

This project is licensed under the MIT License.

---

**Built with ❤️ using LINE Planet SDK**

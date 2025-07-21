# LinePlanet P2P Video Call App

_Automatically synced with your [v0.dev](https://v0.dev) deployments_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/jamomes-projects/v0-line-planet-p2p-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/WkEkW54JZpq)

## Overview

A modern, high-quality peer-to-peer video calling application powered by **LINE Planet SDK**. This app provides enterprise-grade video calling capabilities with beautiful UI design and seamless user experience.

### Features

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
- **Deployment**: Vercel

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

3. **Set up LinePlanet credentials**

   - Visit [LINE Planet Console](https://docs.lineplanet.me/)
   - Create a new project and get your credentials
   - Configure the app with your App ID and Access Token

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000/lineplanet-call` to access the LinePlanet-powered video calling interface.

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

### Available Endpoints

- `/` - Original WebRTC implementation
- `/lineplanet-call` - LinePlanet SDK implementation
- `/demo-incoming-call` - Incoming call UI demo

### Key Features

1. **Peer-to-Peer Calling**

   - Create or join rooms with simple room IDs
   - Automatic peer discovery and connection
   - Real-time status updates

2. **Media Controls**

   - Toggle video/audio on demand
   - Screen sharing capabilities
   - Picture-in-picture local video

3. **Call Management**
   - Room-based calling system
   - Participant tracking
   - Connection status monitoring

## Development

### Project Structure

```
├── app/
│   ├── lineplanet-call/     # LinePlanet video call page
│   ├── demo-incoming-call/  # Incoming call demo
│   └── page.tsx            # Original WebRTC implementation
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── incoming-call.tsx   # Incoming call component
│   └── lineplanet-config.tsx # LinePlanet configuration
├── lib/
│   └── lineplanet.ts       # LinePlanet service wrapper
└── hooks/
    └── use-lineplanet.ts   # React hook for LinePlanet
```

### LinePlanet Service

The `LinePlanetService` class provides a clean interface for the LINE Planet SDK:

```typescript
// Initialize the SDK
await linePlanetService.initialize(config);

// Start a new call
await linePlanetService.makeCall({ roomId, delegate });

// Join an existing call
await linePlanetService.verifyCall({ roomId, delegate });

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
  startCall,
  joinCall,
  endCall,
  toggleVideo,
  toggleAudio,
  localVideoRef,
  remoteVideoRef,
} = useLinePlanet({ config });
```

## Deployment

### Environment Variables

For production deployment, set up the following environment variables:

```env
NEXT_PUBLIC_LINEPLANET_APP_ID=your_app_id
NEXT_PUBLIC_LINEPLANET_ENV=real
NEXT_PUBLIC_LINEPLANET_ACCESS_TOKEN=your_access_token
```

### Vercel Deployment

The project is automatically deployed to Vercel. Any changes pushed to the main branch will trigger a new deployment.

**Live Demo**: [https://vercel.com/jamomes-projects/v0-line-planet-p2p-app](https://vercel.com/jamomes-projects/v0-line-planet-p2p-app)

## Usage

### Starting a Video Call

1. Navigate to `/lineplanet-call`
2. Configure your LinePlanet credentials (if needed)
3. Enter a room ID or generate a new one
4. Click "Start Call" to create a new room
5. Share the room ID with participants
6. Others can join using "Join Call" with the same room ID

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

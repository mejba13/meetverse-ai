# ADR-001: WebRTC Architecture - SFU vs Mesh

## Status
Accepted

## Context
MeetVerse AI requires real-time video/audio communication supporting up to 200 participants per meeting. We need to decide on the WebRTC architecture.

### Options Considered

**Option 1: Mesh (Peer-to-Peer)**
- Each participant connects directly to every other participant
- No central server required
- Bandwidth: O(n²) for n participants

**Option 2: Selective Forwarding Unit (SFU)**
- Central server receives streams and forwards to participants
- Server doesn't decode/encode media
- Bandwidth: O(n) for n participants

**Option 3: Multipoint Control Unit (MCU)**
- Central server decodes, mixes, and re-encodes media
- Single stream to each participant
- High server CPU cost

## Decision
We will use **SFU architecture via LiveKit Cloud**.

## Rationale

1. **Scalability**: Mesh doesn't scale beyond 4-6 participants due to bandwidth. With 200 participants requirement, SFU is the only viable option.

2. **Quality Control**: SFU with simulcast allows adaptive bitrate - server can forward different quality layers based on recipient's bandwidth.

3. **Server-Side Recording**: SFU architecture allows recording without client involvement, essential for cloud recording feature.

4. **E2EE Compatibility**: Unlike MCU, SFU can support end-to-end encryption since it doesn't decode the media.

5. **Managed Service**: LiveKit Cloud provides:
   - Global edge network
   - Built-in TURN servers
   - Auto-scaling
   - 99.99% SLA
   - Reduced operational burden

6. **Cost**: MCU requires expensive encoding. SFU forward-only approach is more cost-effective.

## Consequences

### Positive
- Supports 200+ participants
- Server-side recording without transcoding
- Simulcast for adaptive streaming
- Lower infrastructure costs than MCU
- E2EE possible for sensitive meetings

### Negative
- Client bandwidth still O(n) for download (can subscribe selectively)
- Dependency on LiveKit as vendor
- Monthly costs scale with usage

### Mitigations
- Implement selective subscription (only subscribe to visible participants)
- Abstract LiveKit behind interface for potential future provider switch
- Monitor costs and implement usage limits per tier

## References
- [LiveKit Architecture](https://docs.livekit.io/home/concepts/architecture/)
- [WebRTC Topologies Comparison](https://webrtc.ventures/2022/01/webrtc-mesh-sfu-mcu/)

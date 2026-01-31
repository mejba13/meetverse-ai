# ADR-002: Transcription Service Selection

## Status
Accepted

## Context
MeetVerse AI requires real-time transcription with speaker identification, supporting 100+ languages with 95%+ accuracy and <500ms latency.

### Options Considered

**Option 1: OpenAI Whisper API**
- Industry-leading accuracy
- Good language support
- No real-time streaming (batch only)

**Option 2: Deepgram**
- Real-time streaming API
- Speaker diarization built-in
- 95%+ accuracy, 100+ languages
- Low latency (<300ms)

**Option 3: AssemblyAI**
- Real-time streaming
- Good accuracy
- Speaker diarization
- Slightly higher latency

**Option 4: Google Speech-to-Text**
- Real-time streaming
- Good language support
- Complex pricing model

**Option 5: Self-hosted Whisper**
- Full control
- No per-minute costs
- High infrastructure complexity
- Scaling challenges

## Decision
We will use **Deepgram as primary provider** with **AssemblyAI as fallback**.

## Rationale

1. **Real-Time Capability**: Deepgram's streaming API provides the <500ms latency required for live transcription display.

2. **Speaker Diarization**: Built-in speaker identification matches our requirement for speaker-labeled transcripts.

3. **Accuracy**: Deepgram meets our 95%+ accuracy target, especially for English and common business languages.

4. **Language Support**: 100+ languages available out of the box.

5. **Developer Experience**: Clean WebSocket API, good documentation, easy integration.

6. **Pricing**: Competitive pricing at $0.0043/minute for Nova-2 model.

7. **Reliability**: 99.9% uptime SLA.

## Consequences

### Positive
- Real-time transcription with low latency
- Speaker identification without additional processing
- Simple integration via WebSocket
- Scales automatically with usage

### Negative
- Per-minute cost adds to operational expenses
- Vendor dependency for critical feature
- May need post-processing for domain-specific accuracy

### Mitigations
- Implement AssemblyAI fallback for redundancy
- Cache transcripts to avoid re-processing
- Implement usage limits per subscription tier
- Allow user corrections to improve perceived accuracy

## Cost Analysis

| Usage | Monthly Cost |
|-------|-------------|
| 10,000 meeting hours | ~$2,580 |
| 50,000 meeting hours | ~$12,900 |
| 100,000 meeting hours | ~$25,800 |

## References
- [Deepgram Pricing](https://deepgram.com/pricing)
- [Deepgram Streaming API](https://developers.deepgram.com/docs/streaming)
- [AssemblyAI Real-Time](https://www.assemblyai.com/docs/speech-to-text/streaming)

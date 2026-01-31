# ADR-003: AI/LLM Provider for Co-Pilot and Summaries

## Status
Accepted

## Context
MeetVerse AI requires an LLM for:
- Meeting summarization (multiple formats)
- Action item extraction
- AI Co-Pilot Q&A during meetings
- Key moment identification

Requirements: <3 second response time, high accuracy, ability to process long transcripts.

### Options Considered

**Option 1: OpenAI GPT-4/GPT-4 Turbo**
- Industry standard
- 128K context window
- Excellent quality
- Higher latency for long prompts

**Option 2: Anthropic Claude 3**
- 200K context window
- Excellent at following instructions
- Strong reasoning
- Good latency

**Option 3: Google Gemini Pro**
- Long context support
- Competitive pricing
- Good quality

**Option 4: Self-hosted (Llama 3, Mixtral)**
- No per-token costs
- Full control
- Significant infrastructure complexity
- Quality gap for complex tasks

## Decision
We will use **Anthropic Claude 3 (Sonnet)** as primary with **GPT-4 Turbo as fallback**.

## Rationale

1. **Context Window**: Claude's 200K context window can handle full meeting transcripts (2-hour meeting ≈ 60K tokens) without chunking.

2. **Instruction Following**: Claude excels at structured output formats (JSON action items, formatted summaries), reducing parsing errors.

3. **Latency**: Claude Sonnet provides good balance of quality and speed for <3 second responses.

4. **Cost Efficiency**: Sonnet pricing ($3/$15 per 1M tokens) is competitive while maintaining quality.

5. **Safety**: Built-in safety features reduce risk of inappropriate responses in professional setting.

6. **API Reliability**: Anthropic API has been stable with good uptime.

## Model Selection by Task

| Task | Model | Rationale |
|------|-------|-----------|
| Real-time Co-Pilot | Claude 3 Haiku | Fastest, for quick responses |
| Summary Generation | Claude 3 Sonnet | Balance of quality and cost |
| Action Item Extraction | Claude 3 Sonnet | Structured output accuracy |
| Complex Analysis | Claude 3 Opus | Highest quality when needed |

## Consequences

### Positive
- Handle full meeting transcripts in single request
- Reliable structured output
- Good latency for real-time features
- Strong reasoning for complex queries

### Negative
- Per-token costs can add up
- Vendor dependency
- Model updates may change behavior

### Mitigations
- Implement GPT-4 fallback for redundancy
- Cache common responses where appropriate
- Implement token budgets per tier
- Version-lock model IDs

## Cost Analysis

| Usage (Summaries/month) | Estimated Cost |
|------------------------|----------------|
| 10,000 meetings | ~$500 |
| 50,000 meetings | ~$2,500 |
| 100,000 meetings | ~$5,000 |

*Assumes average 5K input / 1K output tokens per meeting*

## References
- [Anthropic Claude Models](https://docs.anthropic.com/en/docs/models-overview)
- [OpenAI Models](https://platform.openai.com/docs/models)

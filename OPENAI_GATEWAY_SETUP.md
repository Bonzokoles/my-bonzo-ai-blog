# Cloudflare AI Gateway Configuration Guide

## Overview
Cloudflare AI Gateway provides caching, rate limiting, and analytics for OpenAI API calls, reducing costs and improving performance.

## Setup Steps

### 1. Create AI Gateway in Cloudflare Dashboard
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → AI → AI Gateway
2. Click **Create Gateway**
3. Enter gateway name: `mybonzo-ai-gateway` (or your preferred name)
4. Copy the Gateway URL (format: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_slug}`)

### 2. Environment Variables

Add these to your Cloudflare Pages project settings:

```bash
# OpenAI API Key (required)
OPENAI_API_KEY=sk-...your-openai-api-key...

# Cloudflare Account ID (required)
CLOUDFLARE_ACCOUNT_ID=your-account-id

# AI Gateway Slug (optional, defaults to 'mybonzo-ai-gateway')
AI_GATEWAY_SLUG=mybonzo-ai-gateway
```

### 3. Local Development

For local testing, create a `.dev.vars` file in project root:

```bash
OPENAI_API_KEY=sk-...your-openai-api-key...
CLOUDFLARE_ACCOUNT_ID=your-account-id
AI_GATEWAY_SLUG=mybonzo-ai-gateway
```

**Important:** Add `.dev.vars` to `.gitignore` to avoid committing secrets!

### 4. GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
OPENAI_API_KEY=sk-...your-key...
CLOUDFLARE_ACCOUNT_ID=your-account-id
AI_GATEWAY_SLUG=mybonzo-ai-gateway
```

## Features

### 🚀 Caching
AI Gateway automatically caches identical requests, reducing API calls and costs.

### 📊 Analytics
View detailed analytics in Cloudflare Dashboard:
- Request volume
- Token usage
- Response times
- Error rates
- Cost tracking

### 🛡️ Rate Limiting
Built-in rate limiting (20 requests per 5 minutes per IP) + AI Gateway's global rate limiting.

### 💰 Cost Control
Set spending limits and alerts in AI Gateway dashboard.

## API Endpoints

### Chat Completion
```typescript
POST /api/ai/chat-openai

// Request body
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "model": "gpt-4o-mini",  // Optional, defaults to gpt-4o-mini
  "temperature": 0.7,       // Optional
  "max_tokens": 1000,       // Optional
  "stream": true            // Optional, enables streaming
}

// Response (non-streaming)
{
  "id": "chatcmpl-...",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you?"
    }
  }],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 15,
    "total_tokens": 25
  }
}
```

### Streaming Response
When `stream: true`, the response is a Server-Sent Events stream:

```
data: {"choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":"!"}}]}
data: [DONE]
```

## Frontend UI

Access the chat interface at: `/system/openai-chat`

Features:
- Model selection (GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo)
- Streaming toggle
- Conversation history
- Token usage tracking
- Response latency monitoring

## Gateway Configuration

### Cache Settings
In AI Gateway dashboard, configure:
- Cache TTL (time-to-live)
- Cache key strategy
- Cache invalidation rules

### Rate Limiting
Set global limits:
- Requests per minute/hour/day
- Token limits
- Model-specific limits

### Logging & Monitoring
Enable:
- Request/response logging
- Error tracking
- Performance metrics
- Cost alerts

## Best Practices

1. **Always use AI Gateway in production** - saves money and provides analytics
2. **Set reasonable rate limits** - protect against abuse
3. **Monitor token usage** - track costs in real-time
4. **Use caching strategically** - identical prompts return cached responses
5. **Handle errors gracefully** - implement retry logic with exponential backoff
6. **Use streaming for long responses** - better UX, lower latency

## Cost Optimization

### Tips to Reduce Costs:
1. Use `gpt-4o-mini` for simple tasks (10x cheaper than GPT-4)
2. Enable caching in AI Gateway (avoid duplicate API calls)
3. Set `max_tokens` limits appropriately
4. Use system messages efficiently
5. Implement client-side conversation management

### Model Pricing (approximate):
- **GPT-4o Mini**: $0.00015/1K input, $0.0006/1K output
- **GPT-4o**: $0.005/1K input, $0.015/1K output
- **GPT-4 Turbo**: $0.01/1K input, $0.03/1K output
- **GPT-3.5 Turbo**: $0.0005/1K input, $0.0015/1K output

## Troubleshooting

### "OPENAI_API_KEY not configured"
- Ensure environment variable is set in Cloudflare Pages settings
- Check `.dev.vars` for local development

### "CLOUDFLARE_ACCOUNT_ID not configured"
- Add account ID to environment variables
- Find it in Cloudflare Dashboard → Workers & Pages

### Rate Limit Errors (429)
- Wait 5 minutes before retrying
- Consider increasing rate limits in code
- Check AI Gateway limits in dashboard

### Gateway Not Found
- Verify gateway slug matches environment variable
- Ensure gateway is created in Cloudflare Dashboard
- Check account ID is correct

## Security Considerations

1. **Never expose API keys in client-side code**
2. **Always use server-side endpoints** (like `/api/ai/chat-openai`)
3. **Implement proper rate limiting** to prevent abuse
4. **Sanitize user inputs** before sending to OpenAI
5. **Monitor for suspicious activity** in AI Gateway dashboard

## Additional Resources

- [Cloudflare AI Gateway Docs](https://developers.cloudflare.com/ai-gateway/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [AI Gateway Pricing](https://www.cloudflare.com/plans/enterprise/ai-gateway/)

## Support

For issues or questions:
1. Check Cloudflare AI Gateway logs
2. Review OpenAI API status page
3. Verify environment variables are set correctly
4. Test with simple requests first

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: "",
});

export async function readImage(mediaType: "image/jpeg" | "image/png", mediaData: string) {
  const message = await client.messages.create({
    max_tokens: 2048,
    messages: [
      {
          "role": "user",
          "content": [
              {
                  "type": "image",
                  "source": {
                      "type": "base64",
                      "media_type": mediaType,
                      "data": mediaData,
                  },
              },
              {
                  "type": "text",
                  "text": "This image contains a list of text. Your job is to print out exactly what the text says. Do not describe it. Simply print out exactly what it says."
              }
          ],
      }
    ],
    model: "claude-3-5-sonnet-20241022",
    // claude-3-haiku-20240307 for faster and cheaper
    // claude-3-5-sonnet-20241022 for better results
  });
  return message
}
import Anthropic from '@anthropic-ai/sdk';
import { allergensWithoutCodes, listOfAllergens, minimalistAllergenList } from './Allergens';

const client = new Anthropic({
  apiKey: "",
});

const model =  "claude-sonnet-4-5"

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
    model: model
  });
  return message
}

export async function translateText(text: string) {
  const message = await client.messages.create({
    max_tokens: 2048,
    messages: [
      {
          "role": "user",
          "content": [
              {
                  "type": "text",
                  "text": "This is the label on a bottle. Your job is to translate the text into English."
              },
              {
                  "type": "text",
                  "text": text
              }
          ],
      }
    ],
    model: model
  });
  return message
}


export async function doubleCheckList(text: string) {
  const message = await client.messages.create({
    max_tokens: 2048,
    messages: [
      {
          "role": "user",
          "content": [
              {
                  "type": "text",
                  "text": "I will provide 2 lists of text. The first list is the ingredient label on a bottle. The second list are known allergens. Your job is to see if any ingredients on the bottle matches any of the known allergens. You should consider all known synonyms as well as compounds that might be similar enough to also cause a reaction. Do not consider what other individuals are sensitive to, only the list."
              },
              {
                  "type": "text",
                  "text": "=======BOTTLE LABEL=======\n" + text
              },
              {
                  "type": "text",
                  "text": "=======LIST OF CHEMICAL/SUBSTANCE/INGREDIENT NAMES=======\n" + minimalistAllergenList.join("\n")
              }
          ],
      }
    ],
    model: model
  });
  return message
}
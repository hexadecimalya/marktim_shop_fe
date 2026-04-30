import { v2 } from "@google-cloud/translate";
const { Translate } = v2;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { text, target, source } = body;

  if (!text) {
    throw createError({ statusCode: 400, statusMessage: "No text provided" });
  }

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialsJson) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing Google credentials",
    });
  }

  let credentials;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid Google credentials JSON",
    });
  }

  credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");

  const translate = new Translate({ credentials });

  const [translated] = await translate.translate(text, {
    from: source || "uk",
    to: target || "ru",
  });

  return { translated };
});

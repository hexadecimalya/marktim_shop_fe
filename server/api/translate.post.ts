import { Translate } from '@google-cloud/translate/build/src/v2'

// const credentials = JSON.parse(
//   process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!
// )

// const translate = new Translate({
//   credentials
// })

const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

if (!raw) {
  throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON')
}

const credentials = JSON.parse(raw)

if (credentials.private_key) {
  credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')
}

const translate = new Translate({ credentials })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text, target, source } = body

  if (!text) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No text provided',
    })
  }

 const [translated] = await translate.translate(text, {
    from: source || 'uk',
    to: target || 'ru'
  })

  return { translated }
})
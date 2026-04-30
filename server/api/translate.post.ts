// import { Translate } from '@google-cloud/translate/build/src/v2'

// const credentials = JSON.parse(
//   process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!
// )

// const translate = new Translate({
//   credentials
// })

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event)
//   const { text, target, source } = body

//   if (!text) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: 'No text provided',
//     })
//   }

//  const [translated] = await translate.translate(text, {
//     from: source || 'uk',
//     to: target || 'ru'
//   })

//   return { translated }
// })
import { Translate } from '@google-cloud/translate/build/src/v2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text, target, source } = body

  if (!text) {
    throw createError({ statusCode: 400, statusMessage: 'No text provided' })
  }

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  if (!credentialsJson) {
    throw createError({ statusCode: 500, statusMessage: 'Missing Google credentials' })
  }

  const translate = new Translate({
    credentials: JSON.parse(credentialsJson)
  })

  const [translated] = await translate.translate(text, {
    from: source || 'uk',
    to: target || 'ru'
  })

  return { translated }
})
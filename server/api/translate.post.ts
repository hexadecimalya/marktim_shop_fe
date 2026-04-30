// import { v2 } from '@google-cloud/translate'
// const { Translate } = v2

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event)
//   const { text, target, source } = body

//   if (!text) {
//     throw createError({ statusCode: 400, statusMessage: 'No text provided' })
//   }

//   const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
//   if (!credentialsJson) {
//     throw createError({ statusCode: 500, statusMessage: 'Missing Google credentials.' })
//   }

//   const credentials = JSON.parse(credentialsJson)
//   credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')

//   const translate = new Translate({ credentials })

//   const [translated] = await translate.translate(text, {
//     from: source || 'uk',
//     to: target || 'ru'
//   })

//   return { translated }
// })


import { v2 } from '@google-cloud/translate'
const { Translate } = v2

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text, target, source } = body

  if (!text) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No text provided'
    })
  }

  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (!keyPath) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GOOGLE_APPLICATION_CREDENTIALS is not set'
    })
  }

  try {
    const translate = new Translate({
      keyFilename: keyPath
    })

    const [translated] = await translate.translate(text, {
      from: source || 'uk',
      to: target || 'ru'
    })

    return { translated }
  } catch (err: any) {
    console.error('Translate error:', err)

    throw createError({
      statusCode: 500,
      statusMessage: 'Translation failed',
      data: err.message
    })
  }
})
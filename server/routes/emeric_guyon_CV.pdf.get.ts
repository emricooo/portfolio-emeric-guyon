import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { sendStream, setResponseHeaders, createError } from 'h3'

const CV_PATH = process.env.CV_FILE_PATH || '/data/cv/emeric_guyon_CV.pdf'

export default defineEventHandler(async (event) => {
  try {
    const fileStat = await stat(CV_PATH)

    setResponseHeaders(event, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="emeric_guyon_CV.pdf"',
      'Content-Length': fileStat.size.toString(),
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    })

    return sendStream(event, createReadStream(CV_PATH))
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: 'CV not found' })
  }
})

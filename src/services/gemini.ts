import { GoogleGenAI } from '@google/genai'
import { env } from '../env.ts'

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash'

export async function transcribeAudio(audioAsBase64:string, mimeType:string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcreva o áudio para português brasileiro. Seja preciso e natural. Mantenha pontuação adequada e divida o texto em paragrafos quando for apropriado.',
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        }
      }
    ]
  })

  if (!response.text) {
    throw new Error('Failed to transcribe audio')
  }
  return response.text

}


export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [
      {
        text,
      }
    ],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT'
    }
  })

  if (!response.embeddings?.[0].values) {
    throw new Error('Failed to generate embeddings')
  }

  return response.embeddings[0].values
}

export async function generateAnswer(question: string, transcriptions: string[]) {
  const context = transcriptions.join('\n\n')

  const prompt = `
   Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e objetiva.
  Contexto: ${context}
  Pergunta: ${question}
  Instruções: 
   - Voce é um auxiliar de um professor que esta ensinando algo.
   - Use somente as conteudo do contexto.
   - Seja objetivo.
   - Mantenha um tom amigavel e profissional.
   - Cite trechos do contexto somente se for muito necessario.
   - Se a resposta não estiver no texto, diga que o tema não foi abordado ainda.
  `.trim()

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt
      }
    ]
  })

  if (!response.text) {
    throw new Error('Failed to generate answer')
  }
  return response.text
}


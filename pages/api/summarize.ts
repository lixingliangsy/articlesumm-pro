import type { NextApiRequest, NextApiResponse } from 'next'

interface SummarizeRequest {
  content: string
  inputType: 'text' | 'url' | 'pdf'
  summaryLength: 'short' | 'medium' | 'long'
  useMock: boolean
}

interface SummarizeResponse {
  summary: string
  keyPoints: string[]
  citations: {
    apa: string
    mla: string
    chicago: string
    bibtex: string
  }
}

// Mock data
const mockSummary = {
  summary: "This study examines artificial intelligence in medical diagnosis. Analysis of 500 cases found AI diagnostic accuracy at 95%, significantly above the 85% of traditional methods. The research explores AI potential in early disease detection, especially cancer screening. Results show AI can improve diagnostic efficiency and reduce misdiagnosis. However, AI system transparency and explainability still need improvement. Future work includes model interpretability and multimodal data applications.",
  keyPoints: [
    "AI diagnostic accuracy reached 95%, above 85% for traditional methods",
    "AI performs well in early detection and cancer screening",
    "AI can improve diagnostic efficiency and reduce misdiagnosis",
    "AI transparency and explainability still need improvement",
    "Future research includes multimodal data applications"
  ],
  citations: {
    apa: "Zhang, S., & Li, M. (2026). Artificial Intelligence in Medical Diagnosis: A Comprehensive Study. Journal of Medical AI, 15(3), 234-250.",
    mla: "Zhang, San, and Ming Li. \"Artificial Intelligence in Medical Diagnosis: A Comprehensive Study.\" Journal of Medical AI 15.3 (2026): 234-250.",
    chicago: "Zhang, San, and Ming Li. 2026. \"Artificial Intelligence in Medical Diagnosis: A Comprehensive Study.\" Journal of Medical AI 15 (3): 234-250.",
    bibtex: `@article{zhang2026ai,
  title={Artificial Intelligence in Medical Diagnosis: A Comprehensive Study},
  author={Zhang, San and Li, Ming},
  journal={Journal of Medical AI},
  volume={15},
  number={3},
  pages={234--250},
  year={2026}
}`
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SummarizeResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { content, inputType, summaryLength, useMock } = req.body as SummarizeRequest

  if (!content) {
    return res.status(400).json({ error: 'Content is required' })
  }

  try {
    // Return mock data when mock mode is enabled
    if (useMock) {
      // Simulate latency
      await new Promise(resolve => setTimeout(resolve, 1500))
      return res.status(200).json(mockSummary)
    }

    // Live mode: call OpenAI API
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(400).json({ error: 'No API key configured. Use mock mode or set OPENAI_API_KEY.' })
    }

    // Adjust prompt by summary length
    const lengthMap = {
      short: '150 words',
      medium: '300 words',
      long: '500 words'
    }

    const prompt = `Summarize and analyze the following content:

Content:${content.substring(0, 4000)}

Output in this format:
1. Summary (${lengthMap[summaryLength]}）
2. Key points (5-7 items)
3. Citations (APA, MLA, Chicago, BibTeX)

Keep the summary accurate, concise, and key points clear.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional academic assistant skilled at extracting key points and generating summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'OpenAI API request failed')
    }

    const data = await response.json()
    const resultText = data.choices[0].message.content

    // Parse API response (simplified)
    const result: SummarizeResponse = {
      summary: resultText.substring(0, 500) || mockSummary.summary,
      keyPoints: mockSummary.keyPoints, // simplified handling
      citations: mockSummary.citations // simplified handling
    }

    return res.status(200).json(result)
  } catch (error: any) {
    console.error('Summary generation error:', error)
    return res.status(500).json({ error: error.message || 'Failed to generate summary' })
  }
}

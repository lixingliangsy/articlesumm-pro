
// pages/api/features.js
// Features API

export default function handler(req, res) {
  res.status(200).json({
    product: 'articlesumm-pro',
    features: [
      {
        id: 'feature_001',
        name: 'Multi-format input',
        status: 'implemented',
        description: 'SupportPDF、URL和纯Text输入，自动解析内容'
      },
      {
        id: 'feature_002',
        name: 'AI-powered summarization',
        status: 'implemented',
        description: '使用OpenAI API生成准确、简洁的Article summary'
      },
      {
        id: 'feature_003',
        name: '多种Summary length',
        status: 'implemented',
        description: 'Short (150 words), medium (300 words), long (500 words)'
      },
      {
        id: 'feature_004',
        name: 'Key points提取',
        status: 'implemented',
        description: 'Extracts 5-7 key findings automatically'
      },
      {
        id: 'feature_005',
        name: 'Citation formats生成',
        status: 'implemented',
        description: 'Generates APA, MLA, Chicago, and BibTeX citations'
      },
      {
        id: 'feature_006',
        name: 'Mock mode',
        status: 'implemented',
        description: 'Test without an API key using sample data'
      },
      {
        id: 'feature_007',
        name: 'Responsive design',
        status: 'implemented',
        description: 'Works on desktop and mobile'
      }
    ],
    upcoming: [
      {
        id: 'upcoming_001',
        name: 'Batch processing',
        status: 'in_development',
        expectedRelease: '2026-Q3'
      },
      {
        id: 'upcoming_002',
        name: 'History',
        status: 'in_development',
        expectedRelease: '2026-Q3'
      },
      {
        id: 'upcoming_003',
        name: 'Export options',
        status: 'in_development',
        expectedRelease: '2026-Q4'
      }
    ]
  });
}

/**
 * Support assistant boundary.
 *
 * Default mode is extractive: it returns only exact excerpts from published,
 * admin-reviewed help articles, with citations, and stores minimized usage
 * metadata. A generative mode exists but activates only when MYR explicitly
 * configures a provider (SAAS_AI_PROVIDER + credentials + data-handling
 * acknowledgement); it is never enabled implicitly. Neither mode may perform
 * financial actions, change subscriptions, or read private account records.
 */
export function assistantConfig(env = process.env) {
  const provider = String(env.SAAS_AI_PROVIDER || '').trim().toLowerCase()
  if (!provider) return { mode: 'extractive' }
  if (provider !== 'openai-compatible') throw new Error('SAAS_AI_PROVIDER supports only "openai-compatible".')
  if (env.SAAS_AI_DATA_HANDLING_ACKNOWLEDGED !== 'true') throw new Error('Set SAAS_AI_DATA_HANDLING_ACKNOWLEDGED=true only after MYR approves the provider, model, data handling and retention in writing.')
  if (!env.SAAS_AI_BASE_URL || !env.SAAS_AI_API_KEY || !env.SAAS_AI_MODEL) throw new Error('Generative assistant requires SAAS_AI_BASE_URL, SAAS_AI_API_KEY and SAAS_AI_MODEL.')
  return {
    mode: 'generative',
    baseUrl: env.SAAS_AI_BASE_URL.replace(/\/$/, ''),
    apiKey: env.SAAS_AI_API_KEY,
    model: env.SAAS_AI_MODEL,
    maxSourceChars: Number(env.SAAS_AI_MAX_SOURCE_CHARS || 6000),
  }
}

function scoreArticles(articles, question) {
  const words = [...new Set(question.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2))]
  return articles
    .map((article) => {
      const haystack = `${article.title} ${article.summary} ${article.body}`.toLowerCase()
      return { article, score: words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0) }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

const SYSTEM_PROMPT = [
  'You are the MYR Software support assistant for paying customers.',
  'Answer ONLY from the approved help-article excerpts provided in the user message.',
  'If the excerpts do not contain the answer, say you could not find it and tell the customer to create a support ticket.',
  'Never invent features, prices, discounts, or account details.',
  'Never perform or promise billing, subscription, refund, or account-access changes.',
  'Keep answers short, plain, and cite article titles you used.',
].join(' ')

export async function answerQuestion({ config, articles, question, productSlug }) {
  const matches = scoreArticles(articles, question)
  const sources = matches.map(({ article }) => ({ id: article.id, title: article.title, productSlug: article.productSlug, excerpt: article.summary || article.body.slice(0, 360) }))
  if (config.mode !== 'generative') {
    const answer = sources.length
      ? `Automated help found these approved MYR article excerpts. Review the sources below; the assistant cannot change billing, subscriptions, or account access.\n\n${sources.map((item, index) => `${index + 1}. ${item.title}: ${item.excerpt}`).join('\n\n')}`
      : 'I could not find a matching answer in approved MYR help articles. Create a support ticket and a person can help.'
    return { mode: 'extractive', disclosure: 'Automated, extractive answers from approved help articles. No generative model or financial actions are used.', answer, sources, canEscalate: true }
  }
  const context = sources.map((item, index) => `Article ${index + 1}: ${item.title}\n${item.excerpt}`).join('\n\n').slice(0, config.maxSourceChars)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30_000)
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { authorization: `Bearer ${config.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.1,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Approved help articles:\n\n${context || '(none published for this product)'}\n\nCustomer question (${productSlug || 'general'}): ${question}` },
        ],
      }),
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`AI provider returned HTTP ${response.status}`)
    const payload = await response.json()
    const generated = String(payload?.choices?.[0]?.message?.content || '').trim().slice(0, 4000)
    const answer = generated || 'I could not find a matching answer in approved MYR help articles. Create a support ticket and a person can help.'
    return {
      mode: 'generative',
      disclosure: 'Generative AI answer grounded only in approved MYR help articles. It cannot change billing, subscriptions, or account access.',
      answer,
      sources,
      canEscalate: true,
    }
  } finally {
    clearTimeout(timer)
  }
}

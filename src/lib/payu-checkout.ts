export type PayUCheckout = {
  provider: 'payu'
  action: string
  params: Record<string, string>
  testMode: boolean
}

export function submitPayUCheckout(checkout: PayUCheckout) {
  const action = new URL(checkout.action)
  if (action.protocol !== 'https:' || !['test.payu.in', 'secure.payu.in'].includes(action.hostname)) {
    throw new Error('PayU checkout destination is invalid.')
  }
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = action.toString()
  form.acceptCharset = 'UTF-8'
  for (const [name, value] of Object.entries(checkout.params)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.append(input)
  }
  document.body.append(form)
  form.submit()
}
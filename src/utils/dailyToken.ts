// utils/dailyToken.ts
export const getDailyToken = (): number => {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const key = `dailyToken-${today}`

  let token = Number(localStorage.getItem(key) || 0)
  token += 1
  localStorage.setItem(key, String(token))

  return token
}

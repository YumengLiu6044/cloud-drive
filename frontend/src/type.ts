export type AuthStore = {
  token: string | null,
  setToken: (_: string | null) => void
}
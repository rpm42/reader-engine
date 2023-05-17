export default class Token {
  constructor(public readonly value: string | null = null) {}

  get header() {
    return this.value && JSON.parse(atob(this.value.split('.')[0]))
  }

  get payload() {
    return this.value && JSON.parse(atob(this.value.split('.')[1]))
  }

  get expiresIn() {
    return this.value && this.payload.exp
  }

  get issuedAt() {
    return this.value && this.payload.iat
  }

  get isValid() {
    if (!this.value) return false
    if (this.value === 'string') return false
    if (this.payload.exp * 1000 < Date.now()) return false
    return true
  }
}

export const mockUser = {
  id: 'u1',
  nome: 'Adri Costa',
  email: 'admin@teste.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  role: 'admin',
}

const MOCK_EMAIL = 'admin@teste.com'
const MOCK_PASSWORD = '123456'

export function mockLogin(email: string, password: string) {
  return new Promise<{ user: typeof mockUser; token: string }>((resolve, reject) => {
    setTimeout(() => {
      if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
        resolve({ user: mockUser, token: 'mock-token-123' })
      } else {
        reject(new Error('E-mail ou senha inválidos'))
      }
    }, 700)
  })
} 
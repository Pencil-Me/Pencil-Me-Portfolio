import { vi } from 'vitest'

const { mockApiGet, mockApiPost, mockApiPut, mockApiDelete } = vi.hoisted(() => ({
  mockApiGet: vi.fn(),
  mockApiPost: vi.fn(),
  mockApiPut: vi.fn(),
  mockApiDelete: vi.fn()
}))

vi.mock('@/services/http-client', () => ({
  apiClient: {
    get: mockApiGet,
    post: mockApiPost,
    put: mockApiPut,
    delete: mockApiDelete
  }
}))

export { mockApiDelete, mockApiGet, mockApiPost, mockApiPut }

export function resetApiClientMocks(): void {
  mockApiGet.mockReset()
  mockApiPost.mockReset()
  mockApiPut.mockReset()
  mockApiDelete.mockReset()
}

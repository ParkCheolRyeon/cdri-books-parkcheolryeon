export type SearchTarget = 'title' | 'authors' | 'publisher' | 'isbn'

export type Book = {
  id: string
  isbn: string
  title: string
  authors: string[]
  publisher: string
  contents: string
  salePrice: number | null
  price: number
  thumbnail: string
  url: string
  status: string
}

export type BookSearchParams = {
  query: string
  page: number
  size: number
  target?: SearchTarget
}

export type BookSearchResult = {
  documents: Book[]
  totalCount: number
  pageableCount: number
  isEnd: boolean
}

export type KakaoApiErrorKind =
  | 'retryable'
  | 'auth-config'
  | 'quota'
  | 'invalid-request'
  | 'unknown'

export type KakaoApiError = Error & {
  code?: number
  status?: number
  kind: KakaoApiErrorKind
  retryable: boolean
}

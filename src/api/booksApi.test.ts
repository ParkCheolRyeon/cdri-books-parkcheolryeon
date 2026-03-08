import { describe, expect, it } from 'vitest'
import { mapKakaoError, parseBookSearchResponse } from './booksApi'
import type { KakaoApiError } from '@/types/book'

describe('mapKakaoError', () => {
  it('maps quota error codes', () => {
    const error = mapKakaoError({ code: -10, status: 400 })
    expect(error.kind).toBe('quota')
    expect(error.retryable).toBe(false)
  })

  it('maps retryable error codes', () => {
    const error = mapKakaoError({ code: -9798, status: 503 })
    expect(error.kind).toBe('retryable')
    expect(error.retryable).toBe(true)
  })
})

describe('parseBookSearchResponse', () => {
  it('parses valid response payload', () => {
    const result = parseBookSearchResponse({
      meta: {
        total_count: 1,
        pageable_count: 1,
        is_end: true,
      },
      documents: [
        {
          title: '테스트 도서',
          contents: '설명',
          url: 'https://example.com/book',
          isbn: '1234567890',
          authors: ['홍길동'],
          publisher: '테스트 출판사',
          translators: [],
          price: 15000,
          sale_price: 12000,
          thumbnail: 'https://example.com/thumb.jpg',
          status: '정상판매',
        },
      ],
    })

    expect(result.pageableCount).toBe(1)
    expect(result.documents).toHaveLength(1)
    expect(result.documents[0]?.title).toBe('테스트 도서')
    expect(result.documents[0]?.salePrice).toBe(12000)
  })

  it('maps schema mismatch to KakaoApiError', () => {
    try {
      parseBookSearchResponse({
        meta: {
          total_count: 'invalid',
          pageable_count: 1,
          is_end: true,
        },
        documents: [],
      })
      expect.unreachable('schema mismatch should throw KakaoApiError')
    } catch (error) {
      const apiError = error as KakaoApiError
      expect(apiError.kind).toBe('unknown')
      expect(apiError.retryable).toBe(false)
      expect(apiError.message).toBe('도서 응답 형식이 올바르지 않습니다.')
    }
  })
})

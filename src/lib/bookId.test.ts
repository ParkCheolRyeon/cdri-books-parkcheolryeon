import { describe, expect, it } from 'vitest'
import { createBookId } from './bookId'

describe('createBookId', () => {
  it('returns ISBN-based id when a single ISBN is provided', () => {
    const id = createBookId({
      isbn: '9788996991342',
      title: '미움받을 용기',
      authors: ['기시미 이치로'],
      publisher: '인플루엔셜',
    })

    expect(id).toBe('isbn:9788996991342')
  })

  it('creates stable id from ISBN10 and ISBN13 separated by spaces', () => {
    const id = createBookId({
      isbn: '8996991341   9788996991342',
      title: '미움받을 용기',
      authors: ['기시미 이치로'],
      publisher: '인플루엔셜',
    })

    expect(id).toBe('isbn:8996991341|9788996991342')
  })

  it('falls back to metadata when ISBN is missing', () => {
    const id = createBookId({
      isbn: ' ',
      title: '미움받을 용기',
      authors: ['기시미 이치로', '고가 후미타케'],
      publisher: '인플루엔셜',
    })

    expect(id).toBe('meta::미움받을 용기::기시미 이치로,고가 후미타케::인플루엔셜')
  })
})


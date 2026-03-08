import { describe, expect, it, vi } from 'vitest'
import { FavoriteButton } from './FavoriteButton'

describe('FavoriteButton', () => {
  it('비활성 상태에서 찜하기 라벨을 노출한다', () => {
    const element = FavoriteButton({ pressed: false })

    expect(element.props['aria-label']).toBe('add-favorite')
    expect(element.props['aria-pressed']).toBe(false)
  })

  it('활성 상태에서 찜 해제 라벨을 노출한다', () => {
    const element = FavoriteButton({ pressed: true })

    expect(element.props['aria-label']).toBe('remove-favorite')
    expect(element.props['aria-pressed']).toBe(true)
  })

  it('클릭 시 onClick 핸들러를 호출한다', () => {
    const handleClick = vi.fn()
    const element = FavoriteButton({ pressed: false, onClick: handleClick })

    element.props.onClick()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

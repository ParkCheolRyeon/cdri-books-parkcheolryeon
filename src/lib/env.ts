export function getKakaoRestApiKey() {
  return import.meta.env.VITE_KAKAO_REST_API_KEY?.trim() ?? ''
}

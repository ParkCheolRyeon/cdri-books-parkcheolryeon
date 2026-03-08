import { z } from "zod";
import { createBookId } from "@/lib/bookId";
import { getKakaoRestApiKey } from "@/lib/env";
import type {
  Book,
  BookSearchParams,
  BookSearchResult,
  KakaoApiError,
  SearchTarget,
} from "@/types/book";

const kakaoBookSchema = z.object({
  title: z.string(),
  contents: z.string().default(""),
  url: z.string(),
  isbn: z.string().default(""),
  datetime: z.string().optional(),
  authors: z.array(z.string()).default([]),
  publisher: z.string().default(""),
  translators: z.array(z.string()).default([]),
  price: z.number().default(0),
  sale_price: z.number().default(-1),
  thumbnail: z.string().default(""),
  status: z.string().default(""),
});

const kakaoBookResponseSchema = z.object({
  meta: z.object({
    total_count: z.number(),
    pageable_count: z.number(),
    is_end: z.boolean(),
  }),
  documents: z.array(kakaoBookSchema),
});

type KakaoBookResponse = z.infer<typeof kakaoBookResponseSchema>;

export function mapKakaoError(input: {
  code?: number;
  status?: number;
  message?: string;
}) {
  const kindMap = new Map<number, KakaoApiError["kind"]>([
    [-1, "retryable"],
    [-7, "retryable"],
    [-603, "retryable"],
    [-9798, "retryable"],
    [-3, "auth-config"],
    [-5, "auth-config"],
    [-8, "auth-config"],
    [-401, "auth-config"],
    [-903, "auth-config"],
    [-10, "quota"],
    [-11, "quota"],
    [-2, "invalid-request"],
    [-6, "invalid-request"],
    [-9, "invalid-request"],
  ]);

  const kind = input.code ? (kindMap.get(input.code) ?? "unknown") : "unknown";
  const retryable = kind === "retryable";
  const error = new Error(
    input.message ?? "도서 정보를 불러오지 못했습니다.",
  ) as KakaoApiError;
  error.code = input.code;
  error.status = input.status;
  error.kind = kind;
  error.retryable = retryable;
  return error;
}

function normalizeBook(input: z.infer<typeof kakaoBookSchema>): Book {
  const book: Book = {
    id: "",
    isbn: input.isbn,
    title: input.title,
    authors: input.authors,
    publisher: input.publisher,
    contents: input.contents,
    salePrice: input.sale_price > -1 ? input.sale_price : null,
    price: input.price,
    thumbnail: input.thumbnail,
    url: input.url,
    status: input.status,
  };

  return {
    ...book,
    id: createBookId(book),
  };
}

function mapTargetToKakaoTarget(target: SearchTarget) {
  if (target === "authors") {
    return "person";
  }

  return target;
}

function parseKakaoBookResponse(payload: unknown): KakaoBookResponse {
  const parsed = kakaoBookResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw mapKakaoError({
      message: "도서 응답 형식이 올바르지 않습니다.",
    });
  }

  return parsed.data;
}

export function parseBookSearchResponse(payload: unknown): BookSearchResult {
  const json = parseKakaoBookResponse(payload);
  return {
    documents: json.documents.map(normalizeBook),
    totalCount: json.meta.total_count,
    pageableCount: json.meta.pageable_count,
    isEnd: json.meta.is_end,
  };
}

async function parseError(response: Response) {
  try {
    const data = (await response.json()) as { code?: number; msg?: string };
    throw mapKakaoError({
      code: data.code,
      status: response.status,
      message: data.msg,
    });
  } catch (error) {
    if (error instanceof Error && "kind" in error) {
      throw error;
    }

    throw mapKakaoError({
      status: response.status,
      message: "도서 정보를 불러오지 못했습니다.",
    });
  }
}

export async function searchBooks(
  params: BookSearchParams,
): Promise<BookSearchResult> {
  const apiKey = getKakaoRestApiKey();
  if (!apiKey) {
    throw mapKakaoError({
      status: 401,
      code: -401,
      message: "VITE_KAKAO_REST_API_KEY가 설정되지 않았습니다.",
    });
  }

  const query = new URLSearchParams({
    query: params.query,
    page: String(params.page),
    size: String(params.size),
  });

  if (params.target) {
    query.set("target", mapTargetToKakaoTarget(params.target));
  }

  const response = await fetch(
    `https://dapi.kakao.com/v3/search/book?${query.toString()}`,
    {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    },
  );

  if (!response.ok) {
    await parseError(response);
  }

  const payload = (await response.json()) as unknown;
  return parseBookSearchResponse(payload);
}

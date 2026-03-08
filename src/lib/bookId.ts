import type { Book } from "@/types/book";

export function createBookId(
  input: Pick<Book, "isbn" | "title" | "authors" | "publisher">,
) {
  const normalizedIsbnTokens = Array.from(
    new Set(
      input.isbn
        .trim()
        .split(/\s+/)
        .map((value) => value.replace(/[^0-9xX]/g, "").toUpperCase())
        .filter((value) => value.length === 10 || value.length === 13),
    ),
  ).sort();

  if (normalizedIsbnTokens.length > 0) {
    return `isbn:${normalizedIsbnTokens.join("|")}`;
  }

  return ["meta", input.title, input.authors.join(","), input.publisher]
    .map((value) => value.trim())
    .join("::");
}

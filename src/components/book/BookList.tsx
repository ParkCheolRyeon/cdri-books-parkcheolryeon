import { memo } from "react";
import BookItem from "@/components/book/BookItem";
import { Book } from "@/types/book";
import styled from "@emotion/styled";

type BookListProps = {
  books: Book[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (book: Book) => void;
};

function BookList({
  books,
  isFavorite,
  onToggleFavorite,
}: BookListProps) {
  return (
    <Wrapper>
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          isFavorite={isFavorite(book.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </Wrapper>
  );
}

export default memo(BookList);

const Wrapper = styled.div({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

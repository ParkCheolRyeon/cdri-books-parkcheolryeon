import { memo } from "react";
import styled from "@emotion/styled";
import bookPlaceholderImage from "@/assets/icons/icon-fallback-book.png";
import arrowIconUrl from "@/assets/icons/icon-arrow.svg";
import { formatPrice } from "@/lib/format";
import { media } from "@/styles/breakpoints";
import type { Book } from "@/types/book";
import { FavoriteButton } from "./FavoriteButton";
import {
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
  AccordionRoot,
} from "@/components/ui/Accordion";

import { Button } from "@/components/ui/Button";

type BookItemProps = {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: (book: Book) => void;
};

export function BookItem({
  book,
  isFavorite,
  onToggleFavorite,
}: BookItemProps) {
  const authorName = book.authors.join(", ") || "저자 정보 없음";
  const detailValue = `detail-${book.id}`;
  const discountedPrice = formatPrice(book.salePrice ?? book.price);
  const originalPrice = formatPrice(book.price);

  return (
    <Root type="single" collapsible>
      <Item value={detailValue}>
        <Summary>
          <ThumbWrap>
            <ThumbImage
              src={book.thumbnail || bookPlaceholderImage}
              alt={book.title}
            />
            {isFavorite && (
              <FavoriteButton usedTo="list" pressed={isFavorite} />
            )}
          </ThumbWrap>

          <SummaryMeta>
            <TitleAuthor>
              <Title>{book.title}</Title>
              <Author>{authorName}</Author>
            </TitleAuthor>
            <SummaryPrice>{discountedPrice}원</SummaryPrice>
          </SummaryMeta>

          <ActionWrap>
            <DesktopPurchaseLink
              href={book.url}
              target="_blank"
              rel="noreferrer"
            >
              <DesktopPurchaseButton size="md">구매하기</DesktopPurchaseButton>
            </DesktopPurchaseLink>

            <AccordionHeader>
              <AccordionTrigger asChild>
                <DetailTrigger type="button">
                  <span>상세보기</span>
                  <ArrowIcon src={arrowIconUrl} alt="" />
                </DetailTrigger>
              </AccordionTrigger>
            </AccordionHeader>
          </ActionWrap>
        </Summary>

        <AccordionContent>
          <Detail>
            <DetailThumbWrap>
              <DetailThumb
                src={book.thumbnail || bookPlaceholderImage}
                alt={book.title}
              />

              <FavoriteButton
                usedTo="detail"
                pressed={isFavorite}
                onClick={() => onToggleFavorite(book)}
              />
            </DetailThumbWrap>

            <DetailMain>
              <DetailHeading>
                <DetailTitle>{book.title}</DetailTitle>
                <DetailAuthor>{authorName}</DetailAuthor>
              </DetailHeading>

              <DescriptionWrap>
                <DescriptionTitle>책 소개</DescriptionTitle>
                <DescriptionText>
                  {book.contents || "책 소개가 제공되지 않았습니다."}
                </DescriptionText>
              </DescriptionWrap>
            </DetailMain>

            <DetailAside>
              <PriceWrap>
                {book.salePrice ? (
                  <>
                    <PriceRow>
                      <PriceLabel>원가</PriceLabel>
                      <OriginalPrice style={{ fontWeight: 350 }}>
                        {originalPrice}원
                      </OriginalPrice>
                    </PriceRow>
                    <PriceRow>
                      <PriceLabel>할인가</PriceLabel>
                      <DiscountPrice>
                        {formatPrice(book.salePrice)}원
                      </DiscountPrice>
                    </PriceRow>
                  </>
                ) : (
                  <PriceRow>
                    <PriceLabel>가격</PriceLabel>
                    <DiscountPrice>{originalPrice}원</DiscountPrice>
                  </PriceRow>
                )}
              </PriceWrap>

              <DetailPurchaseLink
                href={book.url}
                target="_blank"
                rel="noreferrer"
              >
                <DetailPurchaseButton size="full">
                  구매하기
                </DetailPurchaseButton>
              </DetailPurchaseLink>
            </DetailAside>
          </Detail>
        </AccordionContent>
      </Item>
    </Root>
  );
}

export default memo(BookItem);

const Root = styled(AccordionRoot)({
  width: "100%",
  maxWidth: 960,
  marginInline: "auto",
});

const Item = styled(AccordionItem)(({ theme }) => ({
  position: "relative",
  borderBottom: `1px solid ${theme.color.border}`,
}));

const Summary = styled.div({
  width: "100%",
  minHeight: 100,
  display: "flex",
  alignItems: "center",
  padding: "16px 16px 16px 48px",

  [media.sm]: {
    padding: "8px",
    minHeight: "unset",
  },
});

const ThumbWrap = styled.div({
  width: 48,
  height: 68,
  flexShrink: 0,
  position: "relative",
});

const ThumbImage = styled.img({
  width: 48,
  height: 68,
  objectFit: "cover",
});

const SummaryMeta = styled.div({
  gap: 24,
  flex: 1,
  minWidth: 0,
  marginLeft: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  [media.md]: {
    gap: 8,
    marginLeft: 16,
    display: "flex",
  },
  [media.sm]: {
    gap: 4,
    marginLeft: 8,
    display: "block",
  },
});

const TitleAuthor = styled.div({
  gap: 16,
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",

  [media.xsm]: {
    gap: 2,
    whiteSpace: "normal",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

const Title = styled.h3(({ theme }) => ({
  overflow: "hidden",
  wordBreak: "keep-all",
  textOverflow: "ellipsis",
  color: theme.textColor.primary,
  fontSize: theme.typography.title3.size,
  fontWeight: theme.typography.title3.weight,
  lineHeight: theme.typography.title3.lineHeight,

  [media.sm]: {
    fontSize: theme.typography.caption.size,
    lineHeight: theme.typography.caption.lineHeight,
  },
  [media.xsm]: {
    fontSize: theme.typography.small.size,
    lineHeight: theme.typography.small.lineHeight,
  },
}));

const Author = styled.p(({ theme }) => ({
  overflow: "hidden",
  wordBreak: "keep-all",
  textOverflow: "ellipsis",
  color: theme.textColor.secondary,
  fontSize: theme.typography.body2.size,
  fontWeight: theme.typography.body2.weight,
  lineHeight: theme.typography.body2.lineHeight,

  [media.sm]: {
    fontSize: "12px",
    lineHeight: "12px",
  },

  [media.xsm]: {
    fontSize: theme.typography.small.size,
    lineHeight: theme.typography.small.lineHeight,
  },
}));

const SummaryPrice = styled.p(({ theme }) => ({
  flexShrink: 0,
  textAlign: "right",
  wordBreak: "keep-all",
  color: theme.textColor.primary,
  fontSize: theme.typography.title3.size,
  fontWeight: theme.typography.title3.weight,
  lineHeight: theme.typography.title3.lineHeight,

  [media.sm]: {
    fontSize: theme.typography.caption.size,
    lineHeight: theme.typography.caption.lineHeight,
  },

  [media.xsm]: {
    fontSize: theme.typography.small.size,
    lineHeight: theme.typography.small.lineHeight,
  },
}));

const ActionWrap = styled.div({
  gap: 24,
  flexShrink: 0,
  marginLeft: 56,
  display: "flex",
  alignItems: "center",

  [media.sm]: {
    gap: 8,
    marginLeft: 16,
  },
  [media.xsm]: {
    marginLeft: 8,
  },
});

const DesktopPurchaseLink = styled.a({
  display: "inline-flex",
  textDecoration: "none",

  [media.sm]: {
    display: "none",
  },
});

const DesktopPurchaseButton = styled(Button)(({ theme }) => ({
  width: 115,
  height: 48,
  lineHeight: "22px",
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,
  "[data-state='open'] &": {
    visibility: "hidden",
    pointerEvents: "none",
  },
}));

const DetailTrigger = styled.button(({ theme }) => ({
  gap: 6,
  width: 115,
  height: 48,
  border: "none",
  cursor: "pointer",
  lineHeight: "22px",
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "center",
  borderRadius: theme.radius.sm,
  color: theme.textColor.secondary,
  backgroundColor: theme.color.lightgray,
  fontSize: theme.typography.caption.size,
  transition: "background-color 200ms ease",
  fontWeight: theme.typography.caption.weight,

  [media.sm]: {
    width: 96,
    height: 36,
    fontSize: theme.typography.body2.size,
    lineHeight: theme.typography.body2.lineHeight,
  },

  [media.xsm]: {
    width: 68,
    height: 32,
    fontSize: theme.typography.small.size,
    lineHeight: theme.typography.small.lineHeight,
  },

  "&:hover": {
    backgroundColor: theme.color.gray,
  },

  '&[data-state="open"] img': {
    transform: "rotate(180deg)",
  },
}));

const ArrowIcon = styled.img({
  width: 14,
  height: 8,
  transition: "transform 200ms ease",
});

const Detail = styled.div(({}) => ({
  gap: 32,
  height: 344,
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  padding: "24px 16px 40px 54px",

  [media.sm]: {
    gap: 20,
    height: "auto",
    alignItems: "stretch",
    flexDirection: "column",
    padding: "16px 16px 40px",
  },

  [media.xsm]: {
    gap: 12,
    padding: "8px 8px 24px",
  },
}));

const DetailThumbWrap = styled.div({
  width: 210,
  height: 280,
  flexShrink: 0,
  position: "relative",
});

const DetailThumb = styled.img({
  width: 210,
  height: 280,
  objectFit: "cover",
});

const DetailMain = styled.div({
  gap: 16,
  flex: 1,
  minWidth: 0,
  maxWidth: 360,
  paddingTop: 20,
  display: "flex",
  flexDirection: "column",

  [media.md]: {
    gap: 12,
  },
  [media.sm]: {
    gap: 8,
    paddingTop: 0,
    maxWidth: "none",
  },
});

const DetailHeading = styled.div({
  gap: 16,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  [media.md]: {
    gap: 12,
  },
  [media.sm]: {
    gap: 8,
  },
});

const DetailTitle = styled.h3(({ theme }) => ({
  lineHeight: "26px",
  color: theme.textColor.primary,
  fontSize: theme.typography.title3.size,
  fontWeight: theme.typography.title3.weight,
}));

const DetailAuthor = styled.p(({ theme }) => ({
  lineHeight: "22px",
  color: theme.textColor.subtitle,
  fontSize: theme.typography.body2.size,
  fontWeight: theme.typography.body2.weight,
}));

const DescriptionWrap = styled.div({
  gap: 12,
  minHeight: 218,
  display: "flex",
  flexDirection: "column",

  [media.sm]: {
    minHeight: "auto",
  },
});

const DescriptionTitle = styled.p(({ theme }) => ({
  lineHeight: "26px",
  color: theme.textColor.primary,
  fontSize: theme.typography.body2Bold.size,
  fontWeight: theme.typography.body2Bold.weight,
}));

const DescriptionText = styled.p(({ theme }) => ({
  maxHeight: 176,
  lineHeight: "16px",
  overflow: "hidden",
  wordBreak: "keep-all",
  whiteSpace: "pre-wrap",
  color: theme.textColor.primary,
  fontSize: theme.typography.small.size,
  fontWeight: theme.typography.small.weight,

  [media.sm]: {
    maxHeight: "none",
  },
}));

const DetailAside = styled.div({
  gap: 20,
  width: 240,
  minHeight: 280,
  display: "flex",
  justifyContent: "end",
  alignItems: "flex-end",
  flexDirection: "column",

  [media.sm]: {
    width: "100%",
    minHeight: "auto",
    alignItems: "stretch",
  },
});

const PriceWrap = styled.div({
  gap: 8,
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const PriceRow = styled.div({
  gap: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",

  [media.sm]: {
    gap: 0,
    justifyContent: "space-between",
  },
});

const PriceLabel = styled.span(({ theme }) => ({
  lineHeight: "22px",
  color: theme.textColor.subtitle,
  fontSize: theme.typography.small.size,
  fontWeight: theme.typography.small.weight,
}));

const OriginalPrice = styled.span(({ theme }) => ({
  lineHeight: "26px",
  color: theme.textColor.primary,
  textDecoration: "line-through",
  fontSize: theme.typography.title3.size,
  fontWeight: theme.typography.title3.weight,
}));

const DiscountPrice = styled.span(({ theme }) => ({
  lineHeight: "26px",
  color: theme.textColor.primary,
  fontSize: theme.typography.title3.size,
  fontWeight: theme.typography.title3.weight,
}));

const DetailPurchaseLink = styled.a({
  width: "100%",
  textDecoration: "none",
  display: "inline-flex",
});

const DetailPurchaseButton = styled(Button)(({ theme }) => ({
  width: 240,
  height: 48,
  lineHeight: "24px",
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,

  [media.sm]: {
    width: "100%",
  },
}));

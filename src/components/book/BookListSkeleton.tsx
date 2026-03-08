import { Skeleton } from "@/components/ui/Skeleton";
import { media } from "@/styles/breakpoints";
import styled from "@emotion/styled";

const SKELETON_ITEM_COUNT = 3;

export default function BookListSkeleton() {
  return (
    <Wrapper data-testid="book-list-skeleton">
      {Array.from({ length: SKELETON_ITEM_COUNT }).map((_, index) => (
        <Card key={index}>
          <ThumbnailSkeleton />
          <MetaSection>
            <TitleSkeleton />
            <AuthorSkeleton />
            <PriceSkeleton />
            <ButtonSkeleton />
            <DescriptionSkeleton />
          </MetaSection>
        </Card>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div({
  gap: 20,
  width: "100%",
  display: "grid",
});

const Card = styled.div(({ theme }) => ({
  gap: 20,
  padding: 20,
  display: "grid",
  boxShadow: theme.shadow.card,
  borderRadius: theme.radius.xxl,
  backgroundColor: theme.color.white,
  gridTemplateColumns: "9rem minmax(0, 1fr)",

  [media.sm]: {
    gridTemplateColumns: "1fr",
  },
}));

const MetaSection = styled.div({
  gap: 16,
  minWidth: 0,
  display: "grid",
});

const ThumbnailSkeleton = styled(Skeleton)({
  width: 140,
  height: 180,
});

const TitleSkeleton = styled(Skeleton)({
  height: 24,
  width: "60%",
});

const AuthorSkeleton = styled(Skeleton)({
  height: 16,
  width: "40%",
});

const PriceSkeleton = styled(Skeleton)({
  height: 16,
  width: "25%",
});

const ButtonSkeleton = styled(Skeleton)({
  width: 112,
  height: 48,
});

const DescriptionSkeleton = styled(Skeleton)({
  height: 96,
  width: "100%",
});

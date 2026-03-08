import styled from "@emotion/styled";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <SkeletonBox className={className} />;
}

const SkeletonBox = styled.div(({ theme }) => ({
  borderRadius: theme.radius.lg,
  backgroundColor: theme.color.gray50,
  animation: "ui-skeleton-pulse 1.3s ease-in-out infinite",

  "@keyframes ui-skeleton-pulse": {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.4 },
  },
}));

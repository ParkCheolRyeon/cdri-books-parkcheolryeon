import type { ReactNode } from "react";
import styled from "@emotion/styled";
import FallbackUrl from "@/assets/icons/icon-fallback-book.png";

type FallbackProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function Fallback(props: FallbackProps) {
  const { title, description, action, className } = props;
  return (
    <Container className={className}>
      <FallbackImage src={FallbackUrl} alt="Fallback" />
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      {action}
    </Container>
  );
}

const Container = styled.div({
  flex: 1,
  gap: 16,
  display: "flex",
  padding: "80px 0",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
});

const FallbackImage = styled.img({
  width: 80,
  height: 80,
});

const Title = styled.h3(({ theme }) => ({
  color: theme.textColor.primary,
  fontSize: theme.typography.title3.size,
  fontWeight: theme.typography.title3.weight,
  lineHeight: theme.typography.title3.lineHeight,
}));

const Description = styled.p(({ theme }) => ({
  color: theme.textColor.secondary,
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,
  lineHeight: theme.typography.caption.lineHeight,
}));

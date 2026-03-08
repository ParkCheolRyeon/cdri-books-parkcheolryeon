import styled from "@emotion/styled";
import { Tabs } from "@/components/ui/Tabs";
import { media } from "@/styles/breakpoints";
import { useEffect, useEffectEvent, useState } from "react";
import { useLocation } from "react-router-dom";

export type TabItem = {
  label: string;
  value: string;
  href: string;
};

export const tabItems: TabItem[] = [
  { label: "도서 검색", value: "book-search", href: "/book-search" },
  { label: "내가 찜한 책", value: "favorites", href: "/favorites" },
];

export default function Header() {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const tabValue = pathname.startsWith("/favorites")
    ? "favorites"
    : "book-search";

  const syncScrolled = useEffectEvent(() => {
    setIsScrolled(window.scrollY > 0);
  });

  useEffect(() => {
    syncScrolled();

    window.addEventListener("scroll", syncScrolled, { passive: true });
    return () => {
      window.removeEventListener("scroll", syncScrolled);
    };
  }, [syncScrolled]);

  return (
    <HeaderContainer $isScrolled={isScrolled}>
      <HeaderContent>
        <Title>CERTICOS BOOKS</Title>
        <TabsWrapper>
          <Tabs value={tabValue} items={tabItems} />
        </TabsWrapper>
      </HeaderContent>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header<{ $isScrolled: boolean }>(
  ({ theme, $isScrolled }) => ({
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    width: "100%",
    position: "fixed",
    backdropFilter: $isScrolled ? "blur(40px)" : "none",
    boxShadow: $isScrolled ? theme.shadow.header : "none",
    backgroundColor: $isScrolled ? theme.color.whiteOverlay : theme.color.white,
    transition:
      "background-color 400ms ease, box-shadow 400ms ease, backdrop-filter 400ms ease",
  }),
);

const HeaderContent = styled.div({
  gap: 16,
  width: "100%",
  minHeight: 80,
  maxWidth: 1920,
  display: "flex",
  margin: "0 auto",
  position: "relative",
  alignItems: "center",
  padding: "16px 160px",
  flexDirection: "column",
  justifyContent: "center",
  [media.lg]: {
    paddingInline: 24,
  },
  [media.md]: {
    paddingInline: 16,
  },
  [media.xsm]: {
    paddingInline: 12,
  },
});

const Title = styled.h1(({ theme }) => ({
  left: 160,
  textAlign: "left",
  position: "absolute",
  color: theme.textColor.primary,
  fontSize: theme.typography.title1.size,
  fontWeight: theme.typography.title1.weight,
  lineHeight: theme.typography.title1.lineHeight,
  [media.lg]: {
    left: 24,
  },
  [media.md]: {
    left: "auto",
    position: "static",
    textAlign: "center",
  },
  [media.xsm]: {
    fontSize: "20px",
    lineHeight: "20px",
  },
}));

const TabsWrapper = styled.div({
  width: "100%",
  display: "flex",
  justifyContent: "center",
});

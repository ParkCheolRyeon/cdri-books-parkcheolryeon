import styled from "@emotion/styled";
import Header from "@/Layouts/Header";
import { Outlet } from "react-router-dom";

const HEADER_HEIGHT = 160;

export function RootLayout() {
  return (
    <Wrapper>
      <Header />

      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div({
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
});

const Main = styled.main({
  flex: 1,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  paddingTop: HEADER_HEIGHT,
});

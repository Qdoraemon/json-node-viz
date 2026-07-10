import React from "react";
import { Manrope } from "next/font/google";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "../../constants/theme";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const manrope = Manrope({
  subsets: ["latin-ext"],
});

const StyledLayoutWrapper = styled.div`
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.08), transparent 28%),
    radial-gradient(circle at top right, rgba(20, 184, 166, 0.08), transparent 24%),
    linear-gradient(180deg, #fbfdff 0%, #f7fbff 46%, #ffffff 100%);
  font-family: ${manrope.style.fontFamily};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const PageLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <StyledLayoutWrapper>
        <Navbar />
        <ContentWrapper>{children}</ContentWrapper>
        <Footer />
      </StyledLayoutWrapper>
    </ThemeProvider>
  );
};

export default PageLayout;

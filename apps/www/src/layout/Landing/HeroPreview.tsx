import React from "react";
import { Container, Image } from "@mantine/core";
import styled from "styled-components";

const StyledPreviewShell = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 252, 255, 0.98)),
    rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.08),
    0 2px 10px rgba(15, 23, 42, 0.04);

  img {
    border-radius: 18px;
    border: 1px solid rgba(15, 23, 42, 0.08);
  }
`;

export const HeroPreview = () => {
  return (
    <Container component="section" id="preview" fluid py="24" px="lg">
      <StyledPreviewShell>
        <Image src="./assets/editor.webp" loading="eager" maw={1036} mx="auto" alt="JsonViz editor preview" />
      </StyledPreviewShell>
    </Container>
  );
};

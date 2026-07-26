import React from "react";
import { Oxygen } from "next/font/google";
import { Button, Flex, Stack } from "@mantine/core";
import styled from "styled-components";
import { FaChevronRight } from "react-icons/fa6";

const oxygen = Oxygen({
  subsets: ["latin-ext"],
  weight: ["700"],
});

const StyledHeroSection = styled.main`
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.16), transparent 30%),
    radial-gradient(circle at 50% 100%, rgba(20, 184, 166, 0.1), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(245, 250, 255, 0.98));

  &:before {
    position: absolute;
    content: "";
    inset: 0;
    background-size: 36px 36px;
    background-image:
      linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
    image-rendering: pixelated;
    -webkit-mask-image: linear-gradient(to bottom, transparent, 0%, white 20%, white 84%, transparent);
    mask-image: linear-gradient(to bottom, transparent, 0%, white 20%, white 84%, transparent);
  }
`;

const StyledHeroSectionBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 16px 4rem;
  min-height: 58vh;
  text-align: center;
  gap: 18px;

  @media only screen and (min-width: 768px) {
    padding: 6.5rem 24px 5rem;
  }
`;

const StyledBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(15, 23, 42, 0.08);
  color: #155e75;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
`;

const StyledHeroTitle = styled.h1`
  margin: 0;
  color: #0f172a;
  line-height: 0.95;
  font-family: ${oxygen.style.fontFamily};
  font-size: clamp(3rem, 7vw, 5.6rem);
  max-width: 11ch;
  letter-spacing: -0.04em;
`;

const StyledHeroText = styled.p`
  margin: 0;
  max-width: 44rem;
  color: #4a5568;
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  line-height: 1.7;

  strong {
    font-weight: 700;
    color: #0284c7;
  }
`;

const HeroFacts = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
`;

const HeroFact = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(15, 23, 42, 0.08);
  color: #0f172a;
  font-size: 13px;
  font-weight: 600;
`;

export const HeroSection = () => {
  return (
    <StyledHeroSection>
      <StyledHeroSectionBody>
        <StyledBadge>Structured data editor for JSON, YAML, CSV, and XML</StyledBadge>
        <StyledHeroTitle>Turn raw JSON into a clean visual workspace</StyledHeroTitle>
        <StyledHeroText>
          A bright, browser-based editor to <strong>visualize</strong>, <strong>format</strong>, and{" "}
          <strong>explore</strong> structured data with less friction.
        </StyledHeroText>

        <Flex gap="xs" wrap="wrap" justify="center">
          <Button
            component="a"
            color="cyan"
            href="/editor"
            size="md"
            radius="md"
            variant="filled"
            rightSection={<FaChevronRight />}
            fw="500"
            mt="sm"
          >
            Go to Editor
          </Button>
        </Flex>

        <HeroFacts>
          <HeroFact>One editor</HeroFact>
          <HeroFact>Text + graph</HeroFact>
          <HeroFact>Local-first workflow</HeroFact>
        </HeroFacts>
      </StyledHeroSectionBody>
    </StyledHeroSection>
  );
};
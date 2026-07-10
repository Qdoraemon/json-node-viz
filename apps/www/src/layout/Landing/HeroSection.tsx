import React from "react";
import { Oxygen } from "next/font/google";
import Link from "next/link";
import { Stack, Flex, Button } from "@mantine/core";
import styled from "styled-components";
import { FaChevronRight, FaGithub, FaStar } from "react-icons/fa6";

const oxygen = Oxygen({
  subsets: ["latin-ext"],
  weight: ["700"],
});

const StyledHeroSection = styled.main`
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 12%, rgba(56, 189, 248, 0.18), transparent 24%),
    radial-gradient(circle at 85% 20%, rgba(20, 184, 166, 0.16), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(245, 250, 255, 0.96));

  &:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-size: 40px 40px;
    background-image:
      linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
    image-rendering: pixelated;
    -webkit-mask-image: linear-gradient(to bottom, transparent, 0%, white, 98%, transparent);
    mask-image: linear-gradient(to bottom, transparent, 0%, white, 98%, transparent);
  }

  @media only screen and (max-width: 1240px) {
    flex-direction: column;
  }
`;

const StyledHeroSectionBody = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 5.5rem 10% 4.5rem;
  overflow: hidden;
  text-align: center;
  gap: 60px;
  min-height: 52vh;

  @media only screen and (max-width: 768px) {
    padding: 6em 16px;
    padding-top: 10vh;
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
  position: relative;
  font-size: 2.45rem;
  font-weight: 800;
  display: inline;
  color: #0f172a;
  width: fit-content;
  line-height: 1.15;
  max-width: 30rem;
  font-family: ${oxygen.style.fontFamily};

  @media only screen and (min-width: 576px) {
    font-size: 3.4rem;
    max-width: 34rem;
  }

  @media only screen and (min-width: 992px) {
    font-size: 3.8rem;
    max-width: 40rem;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 4.2rem;
    max-width: 50rem;
  }
`;

const StyledHeroText = styled.h2`
  font-size: 14px;
  color: #4a5568;
  font-weight: 400;
  max-width: 75%;
  margin-top: 1rem;
  text-align: center;

  strong {
    font-weight: 700;
    color: #0284c7;
  }

  @media only screen and (min-width: 576px) {
    font-size: 18px;
    max-width: 80%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 18px;
    max-width: 60%;
  }
`;

export const HeroSection = ({ stars = 0 }) => {
  return (
    <StyledHeroSection>
      <StyledHeroSectionBody>
        <Stack flex="1" miw={250} mx="auto" align="center">
          <StyledBadge>Structured data editor for JSON, YAML, CSV, and XML</StyledBadge>
          <Link href="https://github.com/jsonviz-dev/jsonviz" target="_blank" rel="noopener">
            <Button
              variant="light"
              color="cyan"
              radius="xl"
              ta="left"
              leftSection={<FaGithub size="18" />}
              rightSection={
                <Flex ml="sm" c="cyan.8" align="center" gap="4">
                  <FaStar />
                  {stars.toLocaleString("en-US")}
                </Flex>
              }
            >
              GitHub
            </Button>
          </Link>

          <StyledHeroTitle>Turn raw JSON into a clean visual workspace</StyledHeroTitle>
          <StyledHeroText>
            A bright, browser-based editor to <strong>visualize</strong>, <strong>format</strong>, and{" "}
            <strong>explore</strong> structured data with less friction.
          </StyledHeroText>

          <Flex gap="xs" wrap="wrap" justify="center" hiddenFrom="xs">
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
          <Flex gap="lg" wrap="wrap" justify="center" visibleFrom="xs">
            <Button
              component="a"
              color="cyan"
              href="/editor"
              size="xl"
              radius="md"
              variant="filled"
              rightSection={<FaChevronRight />}
              mt="sm"
            >
              Go to Editor
            </Button>
          </Flex>
        </Stack>
      </StyledHeroSectionBody>
    </StyledHeroSection>
  );
};

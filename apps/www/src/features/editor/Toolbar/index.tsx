import Link from "next/link";
import { Flex, Group } from "@mantine/core";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaGithub } from "react-icons/fa6";
import { JSONCrackLogo } from "../../../layout/JSONCrackBrandLogo";
import { FileMenu } from "./FileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { ToolsMenu } from "./ToolsMenu";
import { ViewMenu } from "./ViewMenu";
import { StyledToolElement } from "./styles";

const StyledTools = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 52px;
  padding: 8px 12px;
  background: ${({ theme }) =>
    theme.BACKGROUND_SECONDARY === "#f2f3f5"
      ? "rgba(255, 255, 255, 0.76)"
      : theme.TOOLBAR_BG};
  color: ${({ theme }) => theme.SILVER};
  z-index: 36;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5" ? "rgba(15, 23, 42, 0.08)" : theme.SILVER_DARK};
  backdrop-filter: ${({ theme }) =>
    theme.BACKGROUND_SECONDARY === "#f2f3f5" ? "blur(12px)" : "none"};
  -webkit-backdrop-filter: ${({ theme }) =>
    theme.BACKGROUND_SECONDARY === "#f2f3f5" ? "blur(12px)" : "none"};

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

function fullscreenBrowser() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      toast.error("Unable to enter fullscreen mode.");
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

export const Toolbar = () => {
  return (
    <StyledTools>
      <Group gap="xs" justify="left" w="100%" style={{ flexWrap: "nowrap" }}>
        <StyledToolElement title="JsonViz">
          <Flex gap="xs" align="center" justify="center">
            <JSONCrackLogo fontSize="14px" hideLogo />
          </Flex>
        </StyledToolElement>
        <FileMenu />
        <ViewMenu />
        <ToolsMenu />
      </Group>
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        <ThemeToggle />
        <Link href="https://github.com" rel="noopener" target="_blank">
          <StyledToolElement title="GitHub">
            <FaGithub size="20" />
          </StyledToolElement>
        </Link>
        <StyledToolElement title="Fullscreen" onClick={fullscreenBrowser}>
          <AiOutlineFullscreen size="20" />
        </StyledToolElement>
      </Group>
    </StyledTools>
  );
};

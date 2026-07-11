import styled from "styled-components";

export const StyledToolElement = styled.button<{ $hide?: boolean; $highlight?: boolean }>`
  display: ${({ $hide }) => ($hide ? "none" : "flex")};
  align-items: center;
  gap: 4px;
  place-content: center;
  font-size: 13px;
  font-weight: 600;
  background: ${({ theme, $highlight }) => {
    if (theme.BACKGROUND_SECONDARY !== "#f2f3f5") {
      return $highlight ? "linear-gradient(rgba(0, 0, 0, 0.1) 0 0)" : "none";
    }
    return $highlight ? "rgba(2, 132, 199, 0.12)" : "transparent";
  }};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5"
        ? "rgba(2, 132, 199, 0.1)"
        : "linear-gradient(rgba(0, 0, 0, 0.1) 0 0)"};
    border-color: ${({ theme }) =>
      theme.BACKGROUND_SECONDARY === "#f2f3f5" ? "rgba(2, 132, 199, 0.22)" : "transparent"};
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
    opacity: 1;
    box-shadow: none;
  }
`;

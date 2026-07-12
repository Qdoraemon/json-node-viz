import React from "react";
import Link from "next/link";
import { Anchor, Container, Divider, Flex, Stack, Text } from "@mantine/core";
import { JSONCrackLogo } from "../JSONCrackBrandLogo";

export const Footer = () => {
  return (
    <Container w="100%" mt={60} px={60} pb="xl" bg="black" fluid>
      <Divider color="gray.3" mb="xl" mx={-60} />
      <Flex justify="space-between">
        <Stack gap={4} visibleFrom="sm">
          <JSONCrackLogo />
          <Anchor href="mailto:hello@jsonviz.dev" fz="xs" c="dimmed">
            hello@jsonviz.dev
          </Anchor>
        </Stack>
        <Flex gap={60} visibleFrom="sm">
          <Stack gap="xs">
            <Text fz="sm" c="white">
              Product
            </Text>
            <Anchor component={Link} prefetch={false} fz="sm" c="gray.5" href="/editor">
              Editor
            </Anchor>
            <Anchor component={Link} prefetch={false} fz="sm" c="gray.5" href="/docs">
              Docs
            </Anchor>
            <Anchor component={Link} prefetch={false} fz="sm" c="gray.5" href="/legal/privacy">
              Privacy
            </Anchor>
          </Stack>
          <Stack gap="xs">
            <Text fz="sm" c="white">
              Resources
            </Text>
            <Anchor component={Link} prefetch={false} fz="sm" c="gray.5" href="/#faq">
              FAQ
            </Anchor>
            <Anchor component={Link} prefetch={false} fz="sm" c="gray.5" href="/docs">
              Docs
            </Anchor>
          </Stack>
          <Stack gap="xs">
            <Text fz="sm" c="white">
              Contact
            </Text>
            <Anchor href="mailto:hello@jsonviz.dev" fz="sm" c="gray.5">
              hello@jsonviz.dev
            </Anchor>
          </Stack>
        </Flex>
      </Flex>
      <Flex gap="xl">
        <Text fz="sm" c="dimmed">
          © {new Date().getFullYear()} JsonViz. Built on open-source foundations.
        </Text>
        <Anchor component={Link} prefetch={false} fz="sm" c="dimmed" href="/legal/terms">
          <Text fz="sm" c="dimmed">
            Terms
          </Text>
        </Anchor>
        <Anchor component={Link} prefetch={false} fz="sm" c="dimmed" href="/legal/privacy">
          <Text fz="sm" c="dimmed">
            Privacy
          </Text>
        </Anchor>
      </Flex>
    </Container>
  );
};

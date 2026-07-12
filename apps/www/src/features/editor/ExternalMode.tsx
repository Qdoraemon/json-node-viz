import React from "react";
import { Accordion, Anchor, Code, Flex, FocusTrap, Group, Modal, Text } from "@mantine/core";

const ExternalMode = () => {
  const [isExternal, setExternal] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname.includes("widget")) return setExternal(false);
      if (window.location.host !== "jsonviz.dev") return setExternal(true);
      return setExternal(false);
    }
  }, []);

  if (!isExternal) return null;

  return (
    <Modal
      title="Thanks for using JsonViz"
      opened={isExternal}
      onClose={() => setExternal(false)}
      centered
      size="lg"
    >
      <FocusTrap.InitialFocus />
      <Group>
        <Accordion variant="separated" w="100%">
          <Accordion.Item value="1">
            <Accordion.Control>How can I change the file size limit?</Accordion.Control>
            <Accordion.Panel>
              The main reason for the file size limit is to prevent performance issues. You can
              increase the limit by setting{" "}
              <Code>NEXT_PUBLIC_NODE_LIMIT</Code> in your <Code>.env</Code> file.
              <br />
              <br />
              For larger datasets, use a lower-detail view or split the input before rendering.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="2">
            <Accordion.Control>How can I stop this dialog from appearing?</Accordion.Control>
            <Accordion.Panel>
              You can disable this dialog by setting <Code>NEXT_PUBLIC_DISABLE_EXTERNAL_MODE</Code>{" "}
              to <Code>true</Code> in your <Code>.env.development</Code> file.
              <br />
              <br />
              If you want to re-enable it, simply remove or set the value to <Code>false</Code>.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="3">
            <Accordion.Control>What are the license terms?</Accordion.Control>
            <Accordion.Panel>
              Read the full license terms on{" "}
              <Anchor href="/legal/terms" rel="noopener" target="_self">
                Terms
              </Anchor>
              .
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="4">
            <Accordion.Control>How do I report a bug or request a feature?</Accordion.Control>
            <Accordion.Panel>
              You can report bugs or request features through the support email.
              <br />
              <br />
              Please provide as much detail as possible to help us address your feedback quickly.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="5">
            <Accordion.Control>How do I contribute to the project?</Accordion.Control>
            <Accordion.Panel>
              We welcome contributions. Please reach out by email with a short description of the
              improvement you want to make.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="6">
            <Accordion.Control>
              What is the difference between JsonViz and the original project?
            </Accordion.Control>
            <Accordion.Panel>
              JsonViz is a rebranded open-source fork focused on the core visualization workflow.
              This version keeps the editor centered on local data inspection and transformation.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Group>
      <Flex justify="center" align="center" gap="sm" mt="md">
        <Anchor href="/legal/privacy" rel="noopener" target="self" fz="sm">
          Privacy
        </Anchor>
        <Text c="dimmed">•</Text>
        <Anchor href="https://x.com" rel="noopener" target="blank" fz="sm">
          X
        </Anchor>
      </Flex>
    </Modal>
  );
};

export default ExternalMode;

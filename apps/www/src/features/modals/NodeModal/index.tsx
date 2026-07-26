// Modified 2026-07-13, based on JSON Crack Apache 2.0
import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "jsoncrack-react";
import { toast } from "react-hot-toast";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";

const getValueAtPath = (obj: any, path: (string | number)[]): any => {
  let current = obj;
  for (const key of path) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
};

const setValueAtPath = (obj: any, path: (string | number)[], value: any): any => {
  if (path.length === 0) return value;
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  let current: any = newObj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = typeof path[i + 1] === "number" ? [] : {};
    } else {
      current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
  return newObj;
};

const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const getJson = useJson(state => state.getJson);
  const setJson = useJson(state => state.setJson);

  const currentValue = React.useMemo(() => {
    if (!nodeData?.path) return "";
    try {
      const json = JSON.parse(getJson());
      const val = getValueAtPath(json, nodeData.path);
      return JSON.stringify(val, null, 2);
    } catch {
      return "";
    }
  }, [nodeData, getJson]);

  const [editValue, setEditValue] = React.useState("");

  React.useEffect(() => {
    if (opened) setEditValue(currentValue);
  }, [opened, currentValue]);

  const onSave = () => {
    try {
      const parsed = JSON.parse(editValue);
      const json = JSON.parse(getJson());
      const updated = setValueAtPath(json, nodeData!.path!, parsed);
      const updatedStr = JSON.stringify(updated, null, 2);
      setJson(updatedStr);
      useFile.setState({ contents: updatedStr, hasChanges: true });
      toast.success("Node updated");
      onClose();
    } catch {
      toast.error("Invalid JSON");
    }
  };

  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Edit node value
            </Text>
            <CloseButton onClick={onClose} />
          </Flex>
          <ScrollArea.Autosize mah={300} maw={600}>
            <Textarea
              value={editValue}
              onChange={e => setEditValue(e.currentTarget.value)}
              minRows={4}
              maxRows={14}
              autosize
              styles={{
                input: {
                  fontFamily: "monospace",
                  fontSize: 12,
                  lineHeight: 1.6,
                },
              }}
            />
          </ScrollArea.Autosize>
          <Flex justify="flex-end" gap="sm">
            <Button variant="subtle" color="gray" size="xs" onClick={onClose}>
              Cancel
            </Button>
            <Button size="xs" onClick={onSave}>
              Save
            </Button>
          </Flex>
        </Stack>
        <Text fz="xs" fw={500}>
          JSON Path
        </Text>
        <ScrollArea.Autosize maw={600}>
          <CodeHighlight
            code={jsonPathToString(nodeData?.path)}
            miw={350}
            mah={250}
            language="json"
            copyLabel="Copy to clipboard"
            copiedLabel="Copied to clipboard"
            withCopyButton
          />
        </ScrollArea.Autosize>
      </Stack>
    </Modal>
  );
};

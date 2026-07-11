import React from "react";
import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import toast from "react-hot-toast";
import { VscCircleSlash, VscFiles } from "react-icons/vsc";
import { FileFormat } from "../../enums/file.enum";
import useFile from "../../store/useFile";

const UploadPrompt = ({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) => (
  <Paper
    radius="xl"
    px={{ base: "xl", sm: 44 }}
    py={{ base: "xl", sm: 36 }}
    shadow="md"
    style={{
      border: "1px solid rgba(15, 23, 42, 0.1)",
      background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,250,255,0.96))",
    }}
  >
    <Stack align="center" gap="sm">
      {icon}
      <Badge variant="light" color="cyan" radius="xl" tt="none" fw={700}>
        Drop file to open
      </Badge>
      <Text fz="h2" fw={700} c="gray.9" ta="center">
        {title}
      </Text>
      <Text fz="md" c="gray.6" ta="center">
        {subtitle}
      </Text>
    </Stack>
  </Paper>
);

export const FullscreenDropzone = () => {
  const setContents = useFile(state => state.setContents);

  return (
    <Dropzone.FullScreen
      maxFiles={1}
      accept={["application/json", "application/x-yaml", "text/csv", "application/xml"]}
      onReject={files => toast.error(`Unable to load file ${files[0].file.name}`)}
      onDrop={async e => {
        try {
          const fileContent = await e[0].text();
          let fileExtension = e[0].name.split(".").pop() as FileFormat | undefined;
          if (!fileExtension) fileExtension = FileFormat.JSON;
          setContents({ contents: fileContent, format: fileExtension, hasChanges: false });
        } catch (err) {
          toast.error("An error occurred while reading the file.");
          console.error(err);
        }
      }}
    >
      <Group
        justify="center"
        ta="center"
        align="center"
        gap="xl"
        h="100vh"
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <UploadPrompt
            icon={<VscFiles size={92} color="#0891b2" />}
            title="Upload to JsonViz"
            subtitle="JSON, YAML, CSV, XML • max 300 KB"
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <UploadPrompt
            icon={<VscCircleSlash size={92} color="#dc2626" />}
            title="Invalid file"
            subtitle="Allowed formats: JSON, YAML, CSV, XML"
          />
        </Dropzone.Reject>
      </Group>
    </Dropzone.FullScreen>
  );
};

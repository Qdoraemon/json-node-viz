// Modified 2026-07-12, based on JSON Crack Apache 2.0

import React, { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMantineColorScheme } from "@mantine/core";
import "@mantine/dropzone/styles.css";
import { generateNextSeo } from "next-seo/pages";
import { event as gaEvent } from "nextjs-google-analytics";
import { ThemeProvider } from "styled-components";
import { ControlPanel } from "../../components/control-panel";
import { GraphCanvas, type GraphCanvasHandle, type GraphSettings } from "../../components/graph-canvas";
import { StorageDrawer, type StoredFile } from "../../components/storage-drawer";
import { TopNav } from "../../components/top-nav";
import { SUPPORTED_LIMIT } from "../constants/graph";
import { SEO } from "../constants/seo";
import { darkTheme, lightTheme } from "../constants/theme";
import { FileFormat, formats } from "../enums/file.enum";
import { FullscreenDropzone } from "../features/editor/FullscreenDropzone";
import { NotSupported } from "../features/editor/views/GraphView/NotSupported";
import useConfig from "../store/useConfig";
import useFile from "../store/useFile";
import useJson from "../store/useJson";
import { useModal } from "../store/useModal";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";

const ModalController = dynamic(() => import("../features/modals/ModalController"));
const ExternalMode = dynamic(() => import("../features/editor/ExternalMode"));
const TextEditor = dynamic(() => import("../features/editor/TextEditor"), {
  ssr: false,
});

const SAVED_FILES_KEY = "jsonviz:saved-files";
const DEFAULT_NODE_LIMIT = 1500;

function countNodes(value: unknown): number {
  if (value === null || typeof value !== "object") return 1;
  if (Array.isArray(value)) {
    return 1 + value.reduce((sum, item) => sum + countNodes(item), 0);
  }
  const record = value as Record<string, unknown>;
  return 1 + Object.values(record).reduce<number>((sum, item) => sum + countNodes(item), 0);
}

function kbSize(content: string): number {
  return new Blob([content]).size;
}

const EditorPage = () => {
  const { query, isReady } = useRouter();
  const { setColorScheme } = useMantineColorScheme();

  const checkEditorSession = useFile(state => state.checkEditorSession);
  const setContents = useFile(state => state.setContents);
  const clearContents = useFile(state => state.clear);
  const contents = useFile(state => state.contents);
  const format = useFile(state => state.format);
  const setFormat = useFile(state => state.setFormat);
  const error = useFile(state => state.error);

  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const liveTransformEnabled = useConfig(state => state.liveTransformEnabled);
  const toggleLiveTransform = useConfig(state => state.toggleLiveTransform);

  const graphJson = useJson(state => state.json);
  const setVisible = useModal(state => state.setVisible);

  const graphRef = React.useRef<GraphCanvasHandle | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [savedFiles, setSavedFiles] = React.useState<StoredFile[]>([]);
  const [activeSavedId, setActiveSavedId] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({ nodes: 0, edges: 0 });
  const [settings, setSettings] = React.useState<GraphSettings>({
    direction: "horizontal",
    spacingX: 48,
    spacingY: 28,
    showEdgeLabels: true,
    curved: true,
  });

  useEffect(() => {
    if (isReady) checkEditorSession(query?.json);
  }, [checkEditorSession, isReady, query]);

  useEffect(() => {
    setColorScheme(darkmodeEnabled ? "dark" : "light");
  }, [darkmodeEnabled, setColorScheme]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_FILES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredFile[];
      if (Array.isArray(parsed)) setSavedFiles(parsed);
    } catch {
      // ignore malformed snapshots
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_FILES_KEY, JSON.stringify(savedFiles));
    } catch {
      // ignore quota errors
    }
  }, [savedFiles]);

  const parsedData = useMemo(() => {
    try {
      return JSON.parse(graphJson || "{}");
    } catch {
      return {};
    }
  }, [graphJson]);

  const nodeLimit = Number.isFinite(SUPPORTED_LIMIT) && SUPPORTED_LIMIT > 0 ? SUPPORTED_LIMIT : DEFAULT_NODE_LIMIT;
  const nodeCount = useMemo(() => countNodes(parsedData), [parsedData]);
  const overLimit = nodeCount > nodeLimit;

  const lineCount = useMemo(() => contents.split("\n").length, [contents]);

  const onUpload = React.useCallback(
    (name: string, content: string) => {
      const ext = name.split(".").pop()?.toLowerCase() as FileFormat | undefined;
      setContents({
        contents: content,
        format: ext && Object.values(FileFormat).includes(ext) ? ext : FileFormat.JSON,
      });
      gaEvent("upload_file", { label: ext ?? "json" });
    },
    [setContents]
  );

  const onPaste = React.useCallback(async () => {
    const text = await navigator.clipboard.readText();
    if (!text) return;
    setContents({ contents: text });
    gaEvent("paste_json");
  }, [setContents]);

  const onFormat = React.useCallback(() => {
    try {
      setContents({ contents: JSON.stringify(JSON.parse(contents), null, 2) });
    } catch {
      // keep invalid input untouched
    }
  }, [contents, setContents]);

  const onMinify = React.useCallback(() => {
    try {
      setContents({ contents: JSON.stringify(JSON.parse(contents)) });
    } catch {
      // keep invalid input untouched
    }
  }, [contents, setContents]);

  const onCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(contents);
    gaEvent("copy_json");
  }, [contents]);

  const onDownload = React.useCallback(() => {
    setVisible("DownloadModal", true);
  }, [setVisible]);

  const onClear = React.useCallback(() => {
    clearContents();
  }, [clearContents]);

  const onSaveCurrent = React.useCallback(() => {
    const ts = Date.now();
    const record: StoredFile = {
      id: `local-${ts}`,
      name: `snapshot-${new Date(ts).toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`,
      size: kbSize(contents),
      updatedAt: ts,
      content: contents,
    };
    setSavedFiles(current => [record, ...current].slice(0, 120));
    setActiveSavedId(record.id);
    gaEvent("save_snapshot");
  }, [contents]);

  const onOpenFile = React.useCallback(
    (file: StoredFile) => {
      setContents({ contents: file.content, format: FileFormat.JSON, hasChanges: false });
      setActiveSavedId(file.id);
      setDrawerOpen(false);
    },
    [setContents]
  );

  const onDeleteFile = React.useCallback((id: string) => {
    setSavedFiles(current => current.filter(file => file.id !== id));
    setActiveSavedId(current => (current === id ? null : current));
  }, []);

  return (
    <>
      <Head>
        {generateNextSeo({
          ...SEO,
          title: "Editor | JsonViz",
          description:
            "JsonViz editor for parsing, schema validation, image export, and local data visualization using a D3 graph canvas.",
          canonical: "https://jsonviz.dev/editor",
        })}
      </Head>

      <ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
        <div className={darkmodeEnabled ? "dark" : ""}>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <ExternalMode />
            <ModalController />

            <TopNav
              onOpenStorage={() => setDrawerOpen(true)}
              fileCount={savedFiles.length}
              onUpload={onUpload}
              onPaste={onPaste}
              onFormat={onFormat}
              onMinify={onMinify}
              onCopy={onCopy}
              onDownload={onDownload}
              onClear={onClear}
            />

            <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2">
              <select
                aria-label="Data format"
                className="h-8 rounded-xl border border-border bg-background px-2 text-xs"
                value={format}
                onChange={e => setFormat(e.currentTarget.value as FileFormat)}
              >
                {formats.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                onClick={() => toggleLiveTransform(!liveTransformEnabled)}
              >
                Live Transform: {liveTransformEnabled ? "On" : "Off"}
              </button>

              {!liveTransformEnabled && (
                <button
                  type="button"
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  onClick={() => setContents({})}
                >
                  Apply Transform
                </button>
              )}

              <button
                type="button"
                className="ml-auto rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                onClick={() => setVisible("SchemaModal", true)}
              >
                Schema
              </button>
              <button
                type="button"
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                onClick={() => setVisible("TypeModal", true)}
              >
                Types
              </button>
              <button
                type="button"
                className="rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                onClick={() => setVisible("DownloadModal", true)}
              >
                Export
              </button>
            </div>

            <main className="grid flex-1 grid-cols-[3fr_7fr] gap-3 p-3 min-h-0">
              <section className="min-h-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <TextEditor />
              </section>

              <section className="relative min-h-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                {overLimit ? (
                  <div className="relative h-full">
                    <NotSupported />
                  </div>
                ) : (
                  <GraphCanvas
                    ref={graphRef}
                    data={parsedData}
                    settings={settings}
                    onStats={setStats}
                    onNodeClick={(path) => {
                      useGraph.getState().setSelectedNode({ path } as any);
                      setVisible("NodeModal", true);
                    }}
                  />
                )}

                <div className="pointer-events-none absolute right-4 top-4 z-20">
                  <ControlPanel
                    settings={settings}
                    onChange={setSettings}
                    onZoomIn={() => graphRef.current?.zoomIn()}
                    onZoomOut={() => graphRef.current?.zoomOut()}
                    onFit={() => graphRef.current?.fit()}
                    onReset={() => graphRef.current?.reset()}
                    stats={stats}
                  />
                </div>

                <div className="absolute bottom-3 left-3 rounded-xl border border-border bg-card/90 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                  {lineCount} lines · {nodeCount} nodes {overLimit ? `· limit ${nodeLimit}` : ""}
                </div>
              </section>
            </main>

            <footer className="border-t border-border bg-card px-4 py-2 text-center text-xs text-muted-foreground">
              Built from open-source foundations. Licensed under Apache 2.0; attribution preserved from
              JSON Crack.
            </footer>

            <StorageDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              files={savedFiles}
              activeId={activeSavedId}
              onOpenFile={onOpenFile}
              onDeleteFile={onDeleteFile}
              onSaveCurrent={onSaveCurrent}
            />

            <FullscreenDropzone />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default EditorPage;

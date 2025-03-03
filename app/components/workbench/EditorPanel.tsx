import { useStore } from '@nanostores/react';
import { memo, useMemo, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import {
  CodeMirrorEditor,
  type EditorDocument,
  type EditorSettings,
  type OnChangeCallback as OnEditorChange,
  type OnSaveCallback as OnEditorSave,
  type OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/CodeMirrorEditor';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import type { FileMap } from '~/lib/stores/files';
import { themeStore } from '~/lib/stores/theme';
import { WORK_DIR } from '~/utils/constants';
import { renderLogger } from '~/utils/logger';
import { isMobile } from '~/utils/mobile';
import { FileBreadcrumb } from './FileBreadcrumb';
import { FileTree } from './FileTree';
import { DEFAULT_TERMINAL_SIZE, TerminalTabs } from './terminal/TerminalTabs';
import { workbenchStore } from '~/lib/stores/workbench';

interface EditorPanelProps {
  files?: FileMap;
  unsavedFiles?: Set<string>;
  editorDocument?: EditorDocument;
  selectedFile?: string | undefined;
  isStreaming?: boolean;
  onEditorChange?: OnEditorChange;
  onEditorScroll?: OnEditorScroll;
  onFileSelect?: (value?: string) => void;
  onFileSave?: OnEditorSave;
  onFileReset?: () => void;
}

const DEFAULT_EDITOR_SIZE = 100 - DEFAULT_TERMINAL_SIZE;

const editorSettings: EditorSettings = { tabSize: 2 };

export const EditorPanel = memo(
  ({
    files,
    unsavedFiles,
    editorDocument,
    selectedFile,
    isStreaming,
    onFileSelect,
    onEditorChange,
    onEditorScroll,
    onFileSave,
    onFileReset,
  }: EditorPanelProps) => {
    renderLogger.trace('EditorPanel');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    const theme = useStore(themeStore);
    const showTerminal = useStore(workbenchStore.showTerminal);

    const activeFileSegments = useMemo(() => {
      if (!editorDocument) {
        return undefined;
      }

      return editorDocument.filePath.split('/');
    }, [editorDocument]);

    const activeFileUnsaved = useMemo(() => {
      return editorDocument !== undefined && unsavedFiles?.has(editorDocument.filePath);
    }, [editorDocument, unsavedFiles]);

    // Filter files based on search query
    const filteredFiles = useMemo(() => {
      if (!searchQuery.trim() || !files) return files;
      
      const result: FileMap = {};
      const query = searchQuery.toLowerCase();
      
      for (const [path, file] of Object.entries(files)) {
        const fileName = path.split('/').pop()?.toLowerCase() || '';
        if (fileName.includes(query)) {
          result[path] = file;
        }
      }
      
      return result;
    }, [files, searchQuery]);

    return (
      <PanelGroup direction="vertical">
        <Panel defaultSize={showTerminal ? DEFAULT_EDITOR_SIZE : 100} minSize={20}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={10} collapsible>
              <div className="flex flex-col border-r border-bolt-elements-borderColor h-full">
                <PanelHeader className="flex items-center">
                  <div className="relative w-full">
                    <div className={`relative flex items-center transition-all duration-200 ${searchFocused ? 'scale-105' : ''}`}>
                      <div className={`absolute left-2.5 transition-all duration-200 ${searchFocused ? 'text-bolt-elements-focus' : 'text-bolt-elements-textSecondary'}`}>
                        <div className="i-ph:magnifying-glass text-sm" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search files..."
                        className="w-full py-2 pl-9 pr-3 text-xs bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus focus:border-transparent shadow-lg transition-all duration-200"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                      />
                    </div>
                  </div>
                </PanelHeader>
                <FileTree
                  className="h-full"
                  files={filteredFiles}
                  hideRoot
                  unsavedFiles={unsavedFiles}
                  rootFolder={WORK_DIR}
                  selectedFile={selectedFile}
                  onFileSelect={onFileSelect}
                />
              </div>
            </Panel>
            <PanelResizeHandle className="group relative h-1 cursor-row-resize hover:bg-bolt-elements-focus active:bg-bolt-elements-focus">
              <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 group-hover:bg-bolt-elements-focus group-active:bg-bolt-elements-focus" />
            </PanelResizeHandle>
            <Panel className="flex flex-col" defaultSize={80} minSize={20}>
              <PanelHeader className="overflow-x-auto">
                {activeFileSegments?.length && (
                  <div className="flex items-center flex-1 text-sm">
                    <FileBreadcrumb pathSegments={activeFileSegments} files={files} onFileSelect={onFileSelect} />
                    {activeFileUnsaved && (
                      <div className="flex gap-1 ml-auto -mr-1.5">
                        <PanelHeaderButton onClick={onFileSave}>
                          <div className="i-ph:floppy-disk-duotone" />
                          Save
                        </PanelHeaderButton>
                        <PanelHeaderButton onClick={onFileReset}>
                          <div className="i-ph:clock-counter-clockwise-duotone" />
                          Reset
                        </PanelHeaderButton>
                      </div>
                    )}
                  </div>
                )}
              </PanelHeader>
              <div className="h-full flex-1 overflow-hidden">
                <CodeMirrorEditor
                  theme={theme}
                  editable={!isStreaming && editorDocument !== undefined}
                  settings={editorSettings}
                  doc={editorDocument}
                  autoFocusOnDocumentChange={!isMobile()}
                  onScroll={onEditorScroll}
                  onChange={onEditorChange}
                  onSave={onFileSave}
                />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <TerminalTabs />
      </PanelGroup>
    );
  }
);

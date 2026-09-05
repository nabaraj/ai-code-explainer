"use client";
import { Header } from "@/app/components/header";
import { SplitPan } from "@/app/components/split-pan/split-pan";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Editor } from "@monaco-editor/react";

export default function SharedPage() {
  const [content, setContent] = useState<{
    codeContent: string;
    explainedCode: string;
  } | null>(null);
  const { sharedid } = useParams();
  useEffect(() => {
    const getPageContent = async () => {
      try {
        const res = await fetch(`/api/share-code/${sharedid}`);
        const data = await res.json();
        setContent(data?.content);
      } catch (err) {
        console.log(err);
        setContent(null);
      }
    };

    if (sharedid) getPageContent();
  }, [sharedid]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="mx-auto px-6 py-6">
          {!content && (
            <p className="text-zinc-400">Loading or no data found...</p>
          )}

          {content && (
            <SplitPan
              orientation="horizontal"
              leftTitle={
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    Code
                  </h3>
                </div>
              }
              rightTitle={
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    Explanation
                  </h3>
                </div>
              }
              leftTopContent={
                <Editor
                  height="70vh"
                  language="typescript"
                  defaultValue={content.codeContent}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    readOnly: true,
                    domReadOnly: true,
                    cursorStyle: "block",
                  }}
                  beforeMount={(monaco) => {
                    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                      {
                        noSemanticValidation: true,
                        noSyntaxValidation: true,
                      },
                    );
                  }}
                  onChange={() => {
                    return;
                  }}
                />
              }
              rightBottomContent={
                <div className="h-full overflow-y-auto">
                  <div className="p-4 explain-out">
                    <ReactMarkdown>{content.explainedCode}</ReactMarkdown>
                  </div>
                </div>
              }
            />
          )}
        </main>
      </div>
    </>
  );
}

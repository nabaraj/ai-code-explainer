"use client";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { Header } from "./components/header";
import { OutputCard } from "./components/output-card";
import { OutputMode } from "./types/type";
import type { editor as MonacoEditor } from "monaco-editor";
import { encodingForModel } from "js-tiktoken";
import { isLikelyCode, normalize } from "./utils/utils";
import { useRouter } from "next/navigation";

const enc = encodingForModel("gpt-4o");
const CHARACTER_LIMIT = 10000;

export default function Home() {
  let timeout: any;
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const [mode, setMode] = useState<OutputMode>("fast");
  const [explainedCode, setExplainedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  function handleEditorDidMount(editor: MonacoEditor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  const handleSubmit = async () => {
    const codeContent = editorRef?.current?.getValue();

    if (!codeContent) {
      setErrorText("Please enter code");
      return;
    }

    if (!isLikelyCode(codeContent)) {
      setErrorText("Please enter valid code");
      return;
    }

    const cleanedCode = normalize(codeContent);

    if (cleanedCode.length > CHARACTER_LIMIT) {
      setErrorText("Limit Exceeded");
      return;
    }
    setErrorText("");
    setLoading(true);
    setExplainedCode("");

    try {
      const response = await fetch("/api/explain-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codeContent: cleanedCode, mode }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunkValue = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });

        setExplainedCode((prev) => prev + chunkValue);
      }
    } catch (err: any) {
      setErrorText(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleShare = async () => {
    const codeContent = editorRef?.current?.getValue();

    if (!codeContent) {
      setErrorText("Please enter code");
      return;
    }

    if (!isLikelyCode(codeContent)) {
      setErrorText("Please enter valid code");
      return;
    }

    const cleanedCode = normalize(codeContent);

    try {
      const response = await fetch("/api/share-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codeContent: cleanedCode, mode, explainedCode }),
      });
      const result = await response.json();
      router.push(`/shared/${result.id}`);
    } catch (err) {
      console.log(err);
    }
  };
  const handleEditorChange = (value: string | undefined) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      if (!value || value.length < 100) {
        setToken("");
        return;
      }

      setToken(enc.encode(value).length.toString());
    }, 500);
  };
  return (
    <>
      <Header handleShare={handleShare} />
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="mx-auto px-6 py-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
              Code Explainer
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`bg-white dark:bg-zinc-900 border ${errorText ? "border-red-500" : "border-zinc-300"} rounded-xl shadow-sm flex flex-col`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  Code Input
                </h3>
                <button
                  disabled={loading}
                  onClick={handleSubmit}
                  className="bg-[#1b1b1b] text-[#c1ff72] border border-[#2a2a2a] hover:bg-[#111111] disabled:opacity-50 text-xs px-3 py-1.5 rounded-md transition"
                >
                  {loading ? "Analyzing..." : "Explain"}
                </button>
              </div>
              {errorText && (
                <p className="text-xs text-red-500 px-4 pb-2">{errorText}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <p className="text-xs text-zinc-500 mb-2 w-full px-4 pt-3 font-bold text-[#27272a]">
                    Mode
                  </p>
                  <div className="flex rounded-md w-fit px-4">
                    <button
                      onClick={() => setMode("fast")}
                      className={`px-3 py-1 text-xs rounded-md border ${
                        mode === "fast"
                          ? "bg-[#1b1b1b] text-[#c1ff72] border-[#2a2a2a]"
                          : "text-zinc-500 border-transparent hover:border-zinc-300"
                      }`}
                    >
                      Fast
                    </button>

                    <button
                      onClick={() => setMode("detailed")}
                      className={`px-3 py-1 text-xs rounded-md ${
                        mode === "detailed"
                          ? "bg-[#1b1b1b] text-[#c1ff72]"
                          : "text-zinc-500"
                      }`}
                    >
                      Detailed
                    </button>
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <p className="text-xs text-zinc-500 mb-2 w-full px-4 pt-3 font-bold text-[#27272a]">
                    Token estimate
                  </p>
                  <span className="px-4 font-bold">{token}</span>
                </div>
              </div>
              <div className="p-3">
                <Editor
                  height="70vh"
                  language="typescript"
                  defaultValue="// Paste your typescript code here..."
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                  }}
                  beforeMount={(monaco) => {
                    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                      {
                        noSemanticValidation: true,
                        noSyntaxValidation: true,
                      },
                    );
                  }}
                  onChange={handleEditorChange}
                />
              </div>
            </div>
            <OutputCard loading={loading} explainedCode={explainedCode} />
          </div>

          {/* Error */}
          {errorText && (
            <p className="mt-4 text-sm text-red-500">{errorText}</p>
          )}
        </main>
      </div>
    </>
  );
}

import ReactMarkdown from "react-markdown";
import { CopyButton } from "./copy-button";
type OutputCardProp = {
  loading: boolean;
  explainedCode: string;
};
export const OutputCard: React.FC<OutputCardProp> = ({
  loading,
  explainedCode,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
          Explanation
        </h3>
        <CopyButton text={explainedCode} loading={loading} />
      </div>

      <div className="p-4 text-[14px] leading-7 break-words overflow-y-auto h-[70vh] text-zinc-700 dark:text-zinc-300">
        {loading && !explainedCode && (
          <p className="text-zinc-400 animate-pulse">Analyzing your code...</p>
        )}

        {/* Empty */}
        {!loading && !explainedCode && (
          <p className="text-zinc-400">Paste your code and click "Explain"</p>
        )}

        {/* Result */}
        {explainedCode && (
          <div className="explain-out prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{explainedCode}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

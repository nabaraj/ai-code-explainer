import { useState } from "react";
type CopyButtonProps = {
  text: string;
  loading: boolean;
};

export const CopyButton: React.FC<CopyButtonProps> = ({ text, loading }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopied = async () => {
    try {
      //   const plainText = text.replace(/[#*`>-]/g, "").replace(/\n{2,}/g, "\n");
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1200);
    } catch {
      console.error("Copy failed");
    }
  };

  return (
    <button
      disabled={loading || !text || isCopied}
      onClick={handleCopied}
      className={`text-xs px-3 py-1.5 border rounded-md transition-all duration-200 flex items-center gap-1
        ${
          isCopied
            ? "bg-green-100 text-green-600 border-green-300 scale-105"
            : "border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        }`}
    >
      {isCopied ? (
        <>
          ✔ <span className="animate-fadeIn">Copied</span>
        </>
      ) : (
        "Copy"
      )}
    </button>
  );
};

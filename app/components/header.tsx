import Image from "next/image";

type HeaderProps = {
  handleShare?: () => void;
};
export const Header: React.FC<HeaderProps> = ({ handleShare }) => {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-[#1b1b1b] backdrop-blur sticky top-0 z-50">
      <nav className="mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-zinc-800 dark:text-white tracking-tight flex justify-center items-center gap-2">
            {/* <img src="./logo-neon.jpg" width="40px" height="40px" alt="" /> */}
            <Image
              src="/logo-neon.jpg"
              width={40}
              height={40}
              alt="Code Explainer"
            />
            <span className="text-[#c1ff72]">AI Code Explainer</span>
          </span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md">
            Beta
          </span>
        </div>

        <div className="hidden sm:block">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {handleShare && (
              <button
                onClick={handleShare}
                className="px-3 py-1.5  border-[#c1ff72] border-width-[1px] text-[#c1ff72] cursor-pointer border rounded-md mx-2 hover:text-[#1b1b1b] hover:bg-[#c1ff72]"
              >
                Share
              </button>
            )}
            Explain code in seconds
          </p>
        </div>
      </nav>
    </header>
  );
};

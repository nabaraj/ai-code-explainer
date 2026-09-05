export const isLikelyCode = (value: string) => {
  return (
    value.includes("{") ||
    value.includes("function") ||
    value.includes("=>") ||
    value.includes("import")
  );
};

export const normalize = (codeContent: string) =>
  codeContent
    .split("\n")
    .map((line: string) => line.trim())
    .filter(Boolean)
    .join("\n");

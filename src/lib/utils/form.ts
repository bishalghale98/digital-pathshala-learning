export const getInputClass = (hasError: boolean, extraClasses?: string) => {
  const base =
    "w-full px-3 py-2 border rounded focus:ring-1 focus:outline-none transition-colors";
  const error = "border-red-300 focus:border-red-500 focus:ring-red-500";
  const normal = "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return `${base} ${hasError ? error : normal} ${extraClasses ?? ""}`;
};

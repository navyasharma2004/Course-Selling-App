export default function Banner({ type = "error", message }) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "border-red-800/30 text-red-900 bg-red-50"
      : "border-green-800/30 text-green-900 bg-green-50";

  return (
    <div className={`border px-4 py-3 text-sm font-sans mb-6 ${styles}`}>
      {message}
    </div>
  );
}

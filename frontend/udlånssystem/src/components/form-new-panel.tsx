import "@/styles/controlPanel.css";

export default function FormNewPanel({
  handleCreate = () => {},
  handleCancel = () => {},
}) {
  return (
    <div className="control-panel relative flex w-[max(35%,400px)] flex-col items-center gap-8 rounded-[10px] p-4">
      <div className="flex w-full justify-between gap-2">
        <button onClick={handleCancel}>Tilbage</button>
        <button onClick={handleCreate}>Opret</button>
      </div>
    </div>
  );
}

import "@/styles/controlPanel.css";

interface FormEditPanelProps {
  editMode?: boolean;
  setEditMode?: (mode: boolean) => void;
  disableDelete?: boolean;
  handleReset?: () => void;
  handleUpdate?: () => void;
  handleDelete?: () => void;
  handleCancel?: () => void;
  editPanelSlot?: JSX.Element;
  formSlot?: JSX.Element;
  children?: JSX.Element;
}

export default function FormEditPanel({
  editMode = false,
  setEditMode = () => {},
  disableDelete = false,
  handleReset = () => {},
  handleUpdate = () => {},
  handleDelete = () => {},
  handleCancel = () => {},
  children = <></>,
}: FormEditPanelProps) {
  return (
    <div className="control-panel">
      <div className="buttons">
        {editMode ? (
          <>
            <button disabled={!editMode} onClick={handleReset}>
              Annuller
            </button>
            <button onClick={handleUpdate}>Gem</button>
          </>
        ) : (
          <>
            <button onClick={handleCancel}>Tilbage</button>
            <button
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              Rediger
            </button>
          </>
        )}
      </div>
      {editMode && (
        <button
          className="text-[#f85a40dd] text-white"
          onClick={handleDelete}
          disabled={disableDelete}
        >
          Slet
        </button>
      )}
      {children}
    </div>
  );
}

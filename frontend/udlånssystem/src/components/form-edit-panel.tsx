import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="control-panel">
      <div className="buttons">
        {editMode ? (
          <>
            <button disabled={!editMode} onClick={handleReset}>
              {t("Cancel")}
            </button>
            <button onClick={handleUpdate}>{t("Save")}</button>
          </>
        ) : (
          <>
            <button onClick={handleCancel}>{t("Back")}</button>
            <button
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              {t("Edit")}
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
          {t("Delete")}
        </button>
      )}
      {children}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import FormEditPanel from "@/components/form-edit-panel";

import { deleteItem, getData, updateItem } from "@/data/index";
import { autoGenZodSchema } from "@/services/autoGen";
import doesObjectsMatch from "@/services/doesObjectsMatch.js";
import { getPrevPage } from "@/services/pathFormatter";

import { toast } from "sonner";
import type { z } from "zod";

import FormPage from "./components/FormPage";
import { getSelectOptions } from "./helpers/getSelectOptions";
import { getDefaultFields } from "./util";

interface EditLayoutProps {
  table: string;
  fields?: Field[];
  zodSchema?: z.ZodObject<any>;
  panelSlot?: React.ReactElement;
  formSlot?: React.ReactElement;
}

export default function EditLayout({
  table,
  fields = getDefaultFields(),
  zodSchema = autoGenZodSchema(fields),
  panelSlot = <></>,
  formSlot = <></>,
}: EditLayoutProps) {
  const { id } = useParams() as { id: string };

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);

  const [importData, setImportData] = useState<any>();
  const [exportData, setExportData] = useState<any>();

  const [fields2, setFields] = useState(fields);

  useEffect(() => {
    importDataFromDB();
  }, []);

  useEffect(() => {
    getSelectOptions(fields, setFields);
  }, [fields2]);

  async function importDataFromDB() {
    const data = await getData<any>(table, id);

    if (!data?.id) {
      toast.error(t("Could not find data"));
      navigate(getPrevPage());
      return;
    }

    setExportData({ ...data });
    setImportData({ ...data });

    await getSelectOptions(fields, setFields);
  }

  function handleReset() {
    setExportData({ ...importData });
    setEditMode(false);
  }

  function isDeleteDisabled(): boolean {
    if (!importData?._count) return false;

    const { _count } = importData as { _count: { [key: string]: number } };

    for (let value of Object.values(_count)) {
      if (value > 0) return true;
    }

    return false;
  }

  async function handleUpdate() {
    if (doesObjectsMatch(importData, exportData)) {
      setEditMode(false);
      return;
    }

    const { data, error } = zodSchema.safeParse(exportData);

    if (error) {
      error.errors.reverse().map((e) =>
        toast.warning(e.message, {
          id: e.code + "-" + e.path.join("-"),
        }),
      );
      return;
    }

    await updateItem(table, id, data);

    importDataFromDB();
    setEditMode(false);
  }

  function handleDelete() {
    const name = importData?.name || "#" + id;

    toast(`${t("promtToastDelete", name)}`, {
      id: "promptDelete",
      position: "top-center",
      action: {
        label: t("Delete"),
        onClick: async () => {
          await deleteItem(table, id);

          navigate(getPrevPage());
        },
      },
      cancel: {
        label: t("Cancel"),
        onClick: () => toast.dismiss("promptDelete"),
      },
    });
  }

  if (!importData) return <div>{t("Loading") + "..."}</div>;

  return (
    <div className="box-border flex h-full gap-4 p-8">
      <FormEditPanel
        handleReset={handleReset}
        handleCancel={() => {
          navigate(getPrevPage());
        }}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        editMode={editMode}
        setEditMode={setEditMode}
        disableDelete={isDeleteDisabled()}
      >
        {panelSlot}
      </FormEditPanel>
      <FormPage
        fields={fields2}
        editMode={editMode}
        exportData={exportData}
        setExportData={setExportData}
        formSlot={formSlot}
      />
    </div>
  );
}

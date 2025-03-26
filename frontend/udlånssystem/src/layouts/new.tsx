import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FormNewPanel from "@/components/form-new-panel";

import { createItem, getData } from "@/data/index";
import { autoGenZodSchema } from "@/services/autoGen";
import { getPrevPage } from "@/services/pathFormatter";

import { toast } from "sonner";
import type { z } from "zod";

import FormPage from "./components/FormPage";

const defaultFields: Field[] = [{ label: "Navn", binding: "name" }];

interface NewLayoutProps {
  table: string;
  fields?: Field[];
  zodSchema?: z.ZodObject<any>;
  panelSlot?: React.ReactElement;
  formSlot?: React.ReactElement;
  redirectOnCreate?: boolean;
  initValues?: any;
}

export default function NewLayout({
  table,
  fields = defaultFields,
  zodSchema = autoGenZodSchema(fields),
  formSlot = <></>,
  redirectOnCreate = true,
  initValues = {},
}: NewLayoutProps) {
  const navigate = useNavigate();

  const [exportData, setExportData] = useState<any>(initValues);

  const [fields2, setFields] = useState(fields);

  async function fetchSelectOptions() {
    for (const field of fields) {
      if (field.type == "select") {
        if (typeof field.options != "string") continue;

        field.options = await getData<any>(field.options);
        setFields((prev) => [...prev]);
      }
    }

    setFields(fields);
  }

  useEffect(() => {
    fetchSelectOptions();
  }, [fields2]);

  async function handleCreate() {
    const { data, error } = zodSchema.safeParse(exportData);

    if (error) {
      error.errors.reverse().map((e) =>
        toast.warning(e.message, {
          id: e.code + "-" + e.path.join("-"),
        }),
      );
      return;
    }

    const {
      data: { id },
    } = await createItem(table, data);

    if (redirectOnCreate) navigate(`${getPrevPage()}/${id}`);
  }

  return (
    <div className="box-border flex h-full gap-4 p-8">
      <FormNewPanel
        handleCancel={() => {
          navigate(getPrevPage());
        }}
        handleCreate={handleCreate}
      />
      <FormPage
        fields={fields}
        exportData={exportData}
        setExportData={setExportData}
        formSlot={formSlot}
      />
    </div>
  );
}

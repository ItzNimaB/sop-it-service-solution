import { useParams } from "react-router-dom";

import useData from "@/hooks/useData";

import NewLayout from "@/layouts/new";

import { getFields, zodSchema } from "../util";

export default function New() {
  const { id } = useParams();

  const [item] = useData("items", id);

  if (!item) return null;

  return (
    <NewLayout
      table="items"
      fields={getFields()}
      zodSchema={zodSchema}
      redirectOnCreate={false}
      initValues={item}
    />
  );
}

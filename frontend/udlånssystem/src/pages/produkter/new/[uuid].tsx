import { useParams } from "react-router-dom";

import useData from "@hooks/useData";

import NewLayout from "@layouts/new";

import { fields, zodSchema } from "../util";

export default function New() {
  const { uuid } = useParams();

  const [item] = useData("items", undefined, uuid);

  if (!item) return null;

  return (
    <NewLayout
      table="items"
      fields={fields}
      zodSchema={zodSchema}
      redirectOnCreate={false}
      initValues={item}
    />
  );
}

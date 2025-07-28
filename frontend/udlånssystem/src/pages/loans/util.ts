import { type NavigateFunction } from "react-router-dom";

import type { loans } from "@prisma";
import { t } from "i18next";

export const getFields = (): Field<loans>[] => [
  {
    label: t("Loan time (days)"),
    binding: "loan_length",
    type: "number",
  },
  {
    label: t("Loaner id"),
    binding: "user_id",
    type: "text",
    disabled: true,
  },
  {
    label: t("Personnel id"),
    binding: "helpdesk_personel_id",
    type: "text",
    disabled: true,
  },
];

export function handleReturn(id: string | number, navigate?: NavigateFunction) {
  if (navigate) navigate(`/udlaan/${id}/returner`);
}

function btn(e: MouseEvent, contextMenuItemId: number) {
  console.log(contextMenuItemId);
}

export const contextMenuItems: ContextMenuItem[] = [
  {
    name: "return",
    onClick: (_e, id) => handleReturn(id!, null as any),
    displayText: t("Return"),
    class: "fa-solid fa-rotate-left",
  },
  // {
  //   name: "printPDF",
  //   onClick: btn,
  //   displayText: "Print PDF",
  //   class: "fa-solid fa-print",
  // },
  {
    name: "hr",
  },
  {
    name: "items",
    displayText: undefined,
  },
];

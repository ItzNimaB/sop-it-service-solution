import { type NavigateFunction } from "react-router-dom";

export const fields: Field<loanModel>[] = [
  {
    label: "Lånetid (dage)",
    binding: "loan_length",
    type: "number",
  },
  {
    label: "Låner UUID",
    binding: "user_id",
    type: "number",
    disabled: true,
  },
  {
    label: "Personel UUID",
    binding: "helpdesk_personel_id",
    type: "number",
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
    displayText: "Returner",
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

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { dateToReadable } from "@/helpers/dateHelpers";
import useData from "@/hooks/useData";

import EditLayout from "@/layouts/edit";
import type { Loan } from "@prisma";
import html2pdf from "html2pdf.js";

import { getFields, handleReturn } from "../util";
import LoanProducts from "./components/loanProducts";
import Pdf from "./components/pdf";

export default function Edit() {
  const { id } = useParams();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const pdfRef = useRef<HTMLDivElement>(null);

  const [loan] = useData<Loan>("loans", id);

  async function printPDF() {
    const pdfElement = pdfRef.current;

    html2pdf(pdfElement, {
      filename: `udlaan_${id}.pdf`,
      image: { type: "png", quality: 1 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    });
  }

  function handleDelete() {
    handleReturn(id!, navigate);
  }

  if (!loan) return null;

  return (
    <>
      <div className="hidden">
        <Pdf loan={loan} ref={pdfRef} />
      </div>
      <EditLayout
        table="loans"
        fields={getFields()}
        panelSlot={
          <>
            {!loan?.date_of_return ? (
              <button onClick={handleDelete}>{t("Return Item")}</button>
            ) : (
              <>
                <p>{t("Returned")} ✅</p>
                <div>
                  <p>
                    {t("From")}: {dateToReadable(loan?.created_at)}
                  </p>
                  <p>
                    {t("To")}: {dateToReadable(loan?.date_of_return)}
                  </p>
                </div>
                <button onClick={handleDelete}>{t("Details")}</button>
              </>
            )}
            <div className="flex flex-col gap-10 self-start">
              <LoanProducts />
            </div>
            <button onClick={printPDF} className="mt-auto">
              {t("Download PDF")}
            </button>
          </>
        }
      />
    </>
  );
}

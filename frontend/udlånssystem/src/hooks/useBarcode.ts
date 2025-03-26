import { useEffect, useRef, useState } from "react";

import { handleBarcodeScan } from "@/helpers/barcode";

export default function useBarcode(callback: (barcode: string) => void) {
  const [barcode, setBarcode] = useState<string>("");

  const handleBarcodeScanRef = useRef<Function>();

  function handleKeyDown(e: any) {
    if (handleBarcodeScanRef.current) handleBarcodeScanRef.current(e);
  }

  useEffect(() => {
    handleBarcodeScanRef.current = (e: any) => {
      handleBarcodeScan(e, (barcode) => {
        if (barcode.length < 7) return;
        callback(barcode);
        setBarcode(barcode);
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return barcode;
}

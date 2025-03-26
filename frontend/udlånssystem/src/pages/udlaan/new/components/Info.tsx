import LocationSelector from "@/components/LocationSelector";
import DatePicker from "@/components/datePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { loanTypes } from "..";

interface NewLoanInfoProps {
  selectedProducts: itemsView[];
  setReturnDate: (returnDate: Date | null) => void;
  returnDate: Date | null;
  setLoanType: (loanType: (typeof loanTypes)[number]["id"]) => void;
  building: buildingModel | undefined;
  setBuilding: (building: buildingModel | undefined) => void;
  locationOfUse: zoneModel | undefined;
  setLocationOfUse: React.Dispatch<React.SetStateAction<zoneModel | undefined>>;
}

export default function NewLoanInfo({
  selectedProducts,
  setReturnDate,
  returnDate,
  setLoanType,
  building,
  setBuilding,
  locationOfUse,
  setLocationOfUse,
}: NewLoanInfoProps) {
  let minDate = new Date();
  let maxDate = new Date();
  maxDate.setMonth(minDate.getMonth() + 6);

  function isMaxDate(date: Date | null) {
    if (!date) return "";

    const date1 = date?.setHours(0, 0, 0, 0);
    const date2 = maxDate.setHours(0, 0, 0, 0);

    if (date1 === date2) return "is-max";

    return "";
  }

  return (
    <div className="grid">
      <div className="grid-item g1">
        <h4>Retur dato</h4>
        <Separator className="hr" />
        <div className="btn-group">
          <DatePicker
            onChange={setReturnDate}
            selected={returnDate}
            maxDate={maxDate}
            dateFormat={"dd-MM-yyy"}
            minDate={minDate}
            disabled={returnDate === null}
            className="bg-base-200 text-foreground p-[4px_6px]"
          />
          <button
            onClick={() => {
              setReturnDate(maxDate);
            }}
            className={"max-time-btn " + isMaxDate(returnDate)}
            disabled={returnDate === null}
          >
            Max
          </button>
          <button
            className={"max-time-btn" + (returnDate === null ? " is-max" : "")}
            onClick={() => {
              if (returnDate) setReturnDate(null);
              else setReturnDate(new Date());
            }}
          >
            Uendeligt
          </button>
        </div>
      </div>
      <div className="grid-item g2">
        <h4>Låner type</h4>
        <Separator className="hr" />
        <select
          onChange={(e) => {
            setLoanType(parseInt(e.target.value));
          }}
        >
          {loanTypes.map((type, i) => (
            <option key={i} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid-item g3">
        <h4>Lokalitet</h4>
        <Separator className="hr" />
        <LocationSelector
          building={building}
          setBuilding={setBuilding}
          setZone={setLocationOfUse}
          zone={locationOfUse}
        />
      </div>
      {selectedProducts.some((p) => p.Kategori_Gruppe == "Laptop") && (
        <table className="grid-item g4 w-2/3">
          <thead>
            <tr className="">
              <th className="w-3/4 text-left">
                <h4>Ekstra info</h4>
              </th>
              <th>
                <h4>Taske</h4>
              </th>
              <th>
                <h4>Lås</h4>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <hr />
              </td>
            </tr>
          </tbody>

          <tbody>
            {selectedProducts
              .filter((p) => p.Kategori_Gruppe == "Laptop")
              .map((laptop, i) => (
                <tr key={i}>
                  <td>
                    <p>
                      {laptop.Navn} [#{laptop.UUID}]
                    </p>
                  </td>

                  <td>
                    <Checkbox
                      id="taske"
                      // bind:checked={laptop.withBag}
                    />
                  </td>
                  <td>
                    <Checkbox
                      id="laas"
                      // bind:checked={laptop.withLock}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

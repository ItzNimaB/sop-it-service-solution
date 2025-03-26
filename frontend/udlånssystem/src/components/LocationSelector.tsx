import useData from "@/hooks/useData";

import { Combobox } from "./Combobox";

interface LocationSelectorProps {
  building: buildingModel | undefined;
  setBuilding: (building: buildingModel | undefined) => void;
  zone: zoneModel | undefined;
  setZone: (zone: zoneModel | undefined) => void;
}

export default function LocationSelector({
  zone,
  setZone = () => {},
  building,
  setBuilding,
}: LocationSelectorProps) {
  const [locations] = useData<any>("locations");

  return (
    <div className="flex gap-3">
      <Combobox
        label="Bygning"
        showLabel={false}
        setValue={(building) => {
          setBuilding(building);
          setZone(undefined);
        }}
        match={building ? { ...building } : undefined}
        options={locations}
      />
      {building && (
        <Combobox
          label="Zone"
          showLabel={false}
          setValue={setZone}
          match={zone ? { ...zone } : undefined}
          options={building.zones}
        />
      )}
    </div>
  );
}

import { useTranslation } from "react-i18next";

import useData from "@/hooks/useData";

import type { buildings, zones } from "@prisma";

import { Combobox } from "./combobox";

type buildingWithZones = buildings & {
  zones: zones[];
};

interface LocationSelectorProps {
  building: buildingWithZones | undefined;
  setBuilding: (building: buildingWithZones | undefined) => void;
  zone: zones | undefined;
  setZone: (zone: zones | undefined) => void;
}

export default function LocationSelector({
  zone,
  setZone = () => {},
  building,
  setBuilding,
}: LocationSelectorProps) {
  const { t } = useTranslation();

  const [locations] = useData<any>("locations");

  return (
    <div className="flex gap-3">
      <Combobox
        label={t("Building")}
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
          label={t("Zone")}
          showLabel={false}
          setValue={setZone}
          match={zone ? { ...zone } : undefined}
          options={building.zones}
        />
      )}
    </div>
  );
}

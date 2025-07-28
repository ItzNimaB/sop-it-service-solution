import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
  onChange?: (date: Date | undefined | null) => void;
  selected?: Date | null;
  maxDate?: Date;
  minDate?: Date;
  dateFormat?: string;
  disabled?: boolean;
  className?: string;
}

export default function DatePicker({
  onChange = () => {},
  selected,
  maxDate,
  minDate,
  dateFormat = "PPP",
  disabled = false,
  className,
}: DatePickerProps) {
  const { t } = useTranslation();
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled} className={className}>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selected && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            format(selected, dateFormat)
          ) : (
            <span>{t("Choose a return date")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected || undefined}
          onSelect={onChange}
          initialFocus
          fromDate={minDate}
          toDate={maxDate}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface DefaultModel {
  id: string | number | null;
  name: string;
}

interface ComboboxProps {
  editMode?: boolean;
  label: string;
  showLabel?: boolean;
  setValue?: (value: any) => void;
  resetValue?: () => void;
  match?: DefaultModel | undefined;
  options?: DefaultModel[];
  popoverWidth?: string;
  required?: boolean;
  disabled?: boolean;
}

export function Combobox({
  editMode = true,
  label,
  showLabel = true,
  setValue = () => {},
  match,
  options,
  popoverWidth = "w-auto",
  required = true,
  disabled = false,
}: ComboboxProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(match);

  if (!options) return null;

  return (
    <div className="question">
      {showLabel && (
        <label htmlFor="trigger">
          {label}
          {required && editMode && !disabled && (
            <span className="required-tag">*</span>
          )}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={!editMode} id="trigger">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between gap-4 rounded-xl"
          >
            {selected ? (
              <p>{selected.name}</p>
            ) : (
              <p className="italic opacity-70">{label}</p>
            )}
            <div className="flex items-center justify-center *:opacity-50">
              <i
                className="fas fa-xmark hover:opacity-80"
                onClick={(e) => {
                  setSelected(undefined);
                  setValue({ id: null, name: "" });
                  e.preventDefault();
                }}
              />
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-[${popoverWidth}] p-0 backdrop-blur-lg`}>
          <Command>
            <CommandInput placeholder={`${t("Search for")} ${label}...`} />
            <CommandList>
              <CommandEmpty>{t("No data found")}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    onSelect={() => {
                      setValue(option);
                      setSelected(option);

                      if (selected?.id === option.id) {
                        setSelected(undefined);
                        setValue({ id: null, name: "" });
                      }

                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected?.id == option.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

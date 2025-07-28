import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import createItem from "@/data/create";

import EditLayout from "@/layouts/edit";

import { getFields, zodSchema } from "./util";

export default function Edit() {
  const { id } = useParams();

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(1);

  async function handleCreateNewProduct(product_id?: number | string) {
    if (!product_id || isNaN(Number(product_id))) return;

    await createItem("items", { product_id, amount });

    setOpen(false);
  }

  return (
    <EditLayout
      table="products"
      fields={getFields()}
      zodSchema={zodSchema}
      formSlot={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="text-foreground h-8 w-full min-w-8 rounded-[10px] border-[1px] border-solid bg-transparent">
              {t("Add product from product type")}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("Add product")}</DialogTitle>
            </DialogHeader>
            <div>
              <Label htmlFor="amount">{t("Amount")}</Label>
              <Input
                name="amount"
                type="number"
                defaultValue={1}
                required
                min="1"
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                }}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" variant="outline">
                  {t("Cancel")}
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={() => {
                  handleCreateNewProduct(id);
                }}
              >
                {t("Create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    />
  );
}

import { useState } from "react";
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

import { fields, zodSchema } from "./util";

export default function Edit() {
  const { id } = useParams();

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
      fields={fields}
      zodSchema={zodSchema}
      formSlot={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="text-foreground h-8 w-full min-w-8 rounded-[10px] border-[1px] border-solid bg-transparent">
              Tilføj nyt produkt ud fra produkttype
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tilføj produkt</DialogTitle>
            </DialogHeader>
            <div>
              <Label htmlFor="amount">Antal</Label>
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
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={() => {
                  handleCreateNewProduct(id);
                }}
              >
                Opret
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    />
  );
}

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import createItem from "@/data/create";

import { toast } from "sonner";

export default function Feedback() {
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const { value: title } = form.feedbackTitle;
    const { value: description } = form.description;

    if (!title.trim()) return toast.error(t("Please fill in the title."));
    if (!description.trim())
      return toast.error(t("Please fill in the description."));

    await createItem("feedback", { title, description });

    form.reset();
  }

  return (
    <div className="flex h-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-5"
      >
        <Input
          name="feedbackTitle"
          placeholder={t("Title")}
          className="placeholder:opacity-65"
        />
        <Textarea
          name="description"
          placeholder={t("Write your feedback here") + "..."}
          className="flex h-[15rem] w-[30rem] resize-none placeholder:opacity-65"
        />
        <Button className="w-8/12 transition-all duration-150 hover:opacity-90">
          {t("Submit feedback")}
        </Button>
      </form>
    </div>
  );
}

import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';

import createItem from '@data/create';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FeedbackProps {}

export default function Feedback({}: FeedbackProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const { value: title } = form.feedbackTitle;
    const { value: description } = form.description;

    if (!title.trim()) return toast.error('Udfyld venligst titlen.');
    if (!description.trim())
      return toast.error('Udfyld venligst beskrivelsen.');

    const createPromise = createItem('feedback', { title, description });

    toast.promise(createPromise, {
      loading: 'Indsender feedback...',
      success: () => {
        form.reset();
        return 'Feedback indsendt!';
      },
    });
  }

  return (
    <div className="flex h-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-5"
      >
        <Input
          name="feedbackTitle"
          placeholder="Titel"
          className="placeholder:opacity-65"
        />
        <Textarea
          name="description"
          placeholder="Skriv dit feedback her..."
          className="flex h-[15rem] w-[30rem] resize-none placeholder:opacity-65"
        />
        <Button className="w-8/12 transition-all duration-150 hover:opacity-90">
          Indsend
        </Button>
      </form>
    </div>
  );
}

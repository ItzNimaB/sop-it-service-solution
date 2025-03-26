interface ContextMenuItem {
  name: string;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    itemId?: number,
  ) => void;
  displayText?: string;
  class?: string;
}

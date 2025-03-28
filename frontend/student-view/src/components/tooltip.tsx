import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolTipProps {
  display: string | React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function ToolTip({
  display,
  className,
  children,
}: ToolTipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={className}>{children}</TooltipTrigger>
        <TooltipContent className="backdrop-blur-md">
          <div>{display}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

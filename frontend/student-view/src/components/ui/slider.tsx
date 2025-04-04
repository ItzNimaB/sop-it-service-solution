import * as React from "react";

import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";

import "@/styles/slider.css";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "sliderRoot relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="sliderTrack bg-base-200 relative h-2 w-full grow overflow-hidden rounded-full">
      <SliderPrimitive.Range className="sliderRange bg-foreground absolute h-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="sliderThumb bg-foreground ring-offset-background focus-visible:ring-ring block h-5 w-5 rounded-full opacity-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    {/* <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 bg-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" /> */}
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

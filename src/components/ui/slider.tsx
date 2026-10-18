"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const values = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(defaultValue)) return defaultValue;
    return [min];
  }, [value, defaultValue, min]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-pine/15">
        <SliderPrimitive.Range className="absolute h-full bg-lagoon" />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-5 rounded-full border border-pine/30 bg-foam shadow-sm focus-visible:ring-4 focus-visible:ring-lagoon/40 focus-visible:outline-none"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };

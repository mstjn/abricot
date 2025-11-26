"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface propsDate {
  dateUpdate?: string;
}

export function Calendar28({ dateUpdate }: propsDate) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  React.useEffect(() => {
    if (dateUpdate) {
      const parsed = new Date(dateUpdate);
      setDate(parsed);
      setMonth(parsed);
      setValue(formatDate(parsed));
    }
  }, [dateUpdate]);

  const dateHidden = date ? date.toISOString() : "";

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          readOnly
          className="
    border border-[#E5E7EB]
    rounded
    h-12
    pl-2
    text-[#6B7280]
    text-xs
    bg-background
    pr-10
    shadow-none
    focus:outline-none
    focus-visible:ring-0
    focus-visible:ring-offset-0
    focus:border-[#E5E7EB]
    focus-visible:border-[#E5E7EB]
    focus-within:border-[#E5E7EB]
    cursor-pointer
  "
          onClick={() => setOpen(true)}
        />

        <input type="hidden" name="dueDate" value={dateHidden} />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id="date-picker" variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                setValue(formatDate(date));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

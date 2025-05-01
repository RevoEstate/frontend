"use client"

import { useState } from "react"
import { format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DateRangePicker() {
  const [date, setDate] = useState<{
    from: Date
    to: Date
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const [preset, setPreset] = useState("last30Days")

  const handlePresetChange = (value: string) => {
    setPreset(value)
    const today = new Date()

    switch (value) {
      case "last7Days":
        setDate({
          from: subDays(today, 7),
          to: today,
        })
        break
      case "last30Days":
        setDate({
          from: subDays(today, 30),
          to: today,
        })
        break
      case "last90Days":
        setDate({
          from: subDays(today, 90),
          to: today,
        })
        break
      case "thisYear":
        setDate({
          from: new Date(today.getFullYear(), 0, 1),
          to: today,
        })
        break
      default:
        break
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last7Days">Last 7 days</SelectItem>
          <SelectItem value="last30Days">Last 30 days</SelectItem>
          <SelectItem value="last90Days">Last 90 days</SelectItem>
          <SelectItem value="thisYear">This year</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                if (range?.from && range?.to) {
                  setDate({ from: range.from, to: range.to })
                }
                setPreset("custom")
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

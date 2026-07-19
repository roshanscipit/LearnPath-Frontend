import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

function Calendar({ className, selected, onSelect, disabled, mode = "single", showOutsideDays = true, ...props }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = React.useState(() => {
    const d = selected ? new Date(selected) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = ["January","February","March","April","May","June",
                      "July","August","September","October","November","December"];
  const dayNames = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  // Build grid: days in month + padding
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  // Previous month padding
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), outside: true });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), outside: false });
  }
  // Next month padding to complete last row
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ date: new Date(year, month + 1, d), outside: true });
    }
  }

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSelected = (date) => {
    if (!selected) return false;
    const s = new Date(selected);
    return date.getFullYear() === s.getFullYear() &&
           date.getMonth() === s.getMonth() &&
           date.getDate() === s.getDate();
  };

  const isToday = (date) => {
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const isDisabled = (date) => {
    if (disabled) return disabled(date);
    return false;
  };

  const handleClick = (date) => {
    if (isDisabled(date)) return;
    onSelect && onSelect(date);
  };

  return (
    <div className={cn("p-3 select-none", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="h-7 w-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 transition-colors"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="h-7 w-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 transition-colors"
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map(({ date, outside }, ci) => {
            const sel = isSelected(date);
            const tod = isToday(date);
            const dis = isDisabled(date) || (outside && !showOutsideDays);
            const hide = outside && !showOutsideDays;

            return (
              <div key={ci} className="flex items-center justify-center py-0.5">
                {hide ? (
                  <span className="h-8 w-8" />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClick(date)}
                    disabled={dis}
                    className={cn(
                      "h-8 w-8 rounded-full text-sm font-normal transition-colors flex items-center justify-center",
                      outside && "text-gray-300",
                      !outside && !sel && !tod && !dis && "hover:bg-gray-100 text-gray-800",
                      tod && !sel && "bg-gray-100 font-semibold text-gray-900",
                      sel && "bg-black text-white hover:bg-gray-800 font-semibold",
                      dis && !outside && "text-gray-300 cursor-not-allowed"
                    )}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

Calendar.displayName = "Calendar";
export { Calendar };

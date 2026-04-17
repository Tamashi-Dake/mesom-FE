type DateMode = "full" | "post" | "user";

const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat("en-gb", {
  style: "short",
  numeric: "auto",
});

const UNITS: Record<string, number> = {
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
};

export const formatPostDate = (date: Date): string => {
  const currentDate = new Date();

  const timeDifferenceInSeconds = Math.floor(
    (currentDate.getTime() - date.getTime()) / 1000,
  );
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
  const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

  if (timeDifferenceInDays > 1) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } else if (timeDifferenceInDays === 1) {
    return "1d";
  } else if (timeDifferenceInHours >= 1) {
    return `${timeDifferenceInHours}h`;
  } else if (timeDifferenceInMinutes >= 1) {
    return `${timeDifferenceInMinutes}m`;
  } else {
    return "Just now";
  }
};

export const formatDate = (
  targetDate: string | Date,
  mode?: DateMode,
): string => {
  const date = new Date(targetDate);

  if (mode === "full") return getFullTime(date);
  if (mode === "post") return formatPostDate(date);
  if (mode === "user") return getJoinedTime(date);

  return getShortTime(date);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat("en-GB", {
    notation: number > 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(number);
};

const getFullTime = (date: Date): string => {
  const fullDate = new Intl.DateTimeFormat("en-gb", {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  const splittedDate = fullDate.split(", ");

  const formattedDate =
    splittedDate.length === 2
      ? [...splittedDate].reverse().join(" · ")
      : [splittedDate.slice(0, 2).join(", "), splittedDate.slice(-1)]
          .reverse()
          .join(" · ");

  return formattedDate;
};

const getJoinedTime = (date: Date): string => {
  return new Intl.DateTimeFormat("en-gb", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const getShortTime = (date: Date): string => {
  const isNear = isToday(date)
    ? "today"
    : isYesterday(date)
      ? "yesterday"
      : null;

  return isNear
    ? `${isNear === "today" ? "Today" : "Yesterday"} at ${date
        .toLocaleTimeString("en-gb")
        .slice(0, -3)}`
    : getFullTime(date);
};

const calculateRelativeTime = (date: Date): string => {
  const elapsed = +date - +new Date();

  if (elapsed > 0) return "now";

  const unitsItems = Object.entries(UNITS);

  for (const [unit, millis] of unitsItems)
    if (Math.abs(elapsed) > millis)
      return RELATIVE_TIME_FORMATTER.format(
        Math.round(elapsed / millis),
        unit as Intl.RelativeTimeFormatUnit,
      );

  return RELATIVE_TIME_FORMATTER.format(Math.round(elapsed / 1000), "second");
};

const isToday = (date: Date): boolean => {
  return new Date().toDateString() === date.toDateString();
};

const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toDateString() === date.toDateString();
};

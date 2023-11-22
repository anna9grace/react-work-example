import { formatTimeFromSeconds } from "@/helpers/formatTimeFromSeconds";
import { computeSecondsFromTime } from "@/helpers/computeSecondsFromTime";
import { IFormChapter, IChapter } from "@/services/types/chapters";

export const isUnordered = (arr) => {
  const values = arr.map((el) => computeSecondsFromTime(el.start ?? "00:00"));
  const index = values.findIndex((val, i, a) => val < a[i - 1]);
  return index >= 0 && index;
};

export const isInvalidDuration = (arr, liveDuration) => {
  const values = arr.map((el) => computeSecondsFromTime(el.start ?? "00:00"));
  const index = values.findIndex(
    (val, i, a) =>
      val - a[i - 1] < 10 || (liveDuration > val && liveDuration - val < 10)
  );
  return index >= 0 && index;
};

export const getChaptersToTimeFormat = (
  chapters: IChapter[],
  shouldDisplayHours = false
) =>
  chapters.map((chapter) => ({
    ...chapter,
    start: formatTimeFromSeconds(chapter.start, shouldDisplayHours),
  }));

export const getChaptersToSecondsFormat = (chapters: IFormChapter[]) =>
  chapters.map((chapter) => ({
    ...chapter,
    start: computeSecondsFromTime(chapter.start) || 0,
  }));

export const hasHours = (duration: number) =>
  duration ? Math.floor(duration) > 3600 : false;

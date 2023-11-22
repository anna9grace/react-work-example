import * as yup from "yup";

import { ILive } from "@/services/types/live";
import { IChapter } from "@/services/types/chapters";
import { formatTimeIntoSeconds } from "@/helpers/formatTimeIntoSeconds";
import { isEmpty } from "@/helpers/isEmpty";

import { EMPTY_CHAPTER } from "./Chapters.constants";
import { isUnordered, isInvalidDuration } from "./Chapters.helpers";
import { getChaptersToTimeFormat } from "./Chapters.helpers";

export interface IChaptersForm {
  isActive: boolean;
  chapters: IChapter[];
}

const chapterSchema = yup.object({
  start: yup
    .string()
    .required("chapters/error/time")
    .test(
      "beforeStartTime",
      "chapters/error/invalidTime",
      function (value, context) {
        const videoStartTime = context.options.context?.replayStartTime;

        if (value === undefined) return false;
        return formatTimeIntoSeconds(value)! >= videoStartTime;
      }
    )
    .test(
      "afterEndTime",
      "chapters/error/invalidTime",
      function (value, context) {
        const videoDuration = context.options.context?.duration;

        if (value === undefined || !videoDuration) return false;
        return formatTimeIntoSeconds(value)! < videoDuration;
      }
    ),
  title: yup
    .string()
    .required("chapters/error/title")
    .max(40, "chapters/error/maxChar")
    .test("hasOnlySpaces", "chapters/error/title", function (value) {
      return value !== undefined ? !isEmpty(value) : false;
    }),
});

export const chaptersSchema = yup.object().shape({
  isActive: yup.boolean(),
  chapters: yup
    .array()
    .of(chapterSchema)
    .min(2, "chapters/error/min")
    .test(
      "isUnordered",
      "chapters/error/invalidOrder",
      function (value, context) {
        if (value === undefined) return false;
        const invalidIndex = isUnordered(value);

        return invalidIndex
          ? context.createError({ path: `chapters.${invalidIndex}.start` })
          : true;
      }
    )
    .test(
      "isTooShort",
      "chapters/error/invalidTime",
      function (value, context) {
        const videoDuration = context.options.context?.duration;

        if (value === undefined || !videoDuration) return false;
        const invalidIndex = isInvalidDuration(value, videoDuration);

        return invalidIndex
          ? context.createError({ path: `chapters.${invalidIndex}.start` })
          : true;
      }
    ),
});

export const createFormDefaultValues = (
  duration: number,
  live: ILive
): IChaptersForm => {
  const chaptersData = live.liveChapters;

  return {
    isActive: chaptersData?.isActive ?? false,
    chapters: chaptersData?.chapters
      ? getChaptersToTimeFormat(
          chaptersData.chapters,
          !!duration && duration > 3600
        )
      : [EMPTY_CHAPTER],
  };
};

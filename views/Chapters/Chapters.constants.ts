import { IChapter } from "@/services/types/chapters";

export enum TimeFormats {
  WITHOUT_HOURS = "WITHOUT_HOURS",
  WITH_HOURS = "WITH_HOURS",
}

export const TimeMasks = {
  [TimeFormats.WITH_HOURS]: {
    placeholder: "00:00:00",
    mask: [/[0-9]/, /[0-9]/, ":", /[0-9]/, /[0-9]/, ":", /[0-5]/, /[0-9]/],
  },
  [TimeFormats.WITHOUT_HOURS]: {
    placeholder: "00:00",
    mask: [/[0-9]/, /[0-9]/, ":", /[0-5]/, /[0-9]/],
  },
};

export const EMPTY_CHAPTER: IChapter = {
  start: "00:00",
  title: "",
};

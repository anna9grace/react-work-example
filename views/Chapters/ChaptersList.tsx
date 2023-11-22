import React, { FC } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AddButton } from "@/ui/AddButton/AddButton";
import { IChapter } from "@/services/types/chapters";

import { ChapterInput } from "./ChapterInput";
import { EMPTY_CHAPTER } from "./Chapters.constants";
import { IChaptersForm } from "./chapters.forms";

interface IChaptersListProps {
  shouldDisplayHours: boolean;
}

export const ChaptersList: FC<IChaptersListProps> = ({
  shouldDisplayHours,
}) => {
  const { t } = useTranslation();
  const { control } = useFormContext<IChaptersForm>();

  const { fields, append, remove } = useFieldArray({
    name: "chapters",
    control,
  });

  const handleAdd = () => append(EMPTY_CHAPTER);

  return (
    <>
      {fields.map((field: IChapter, index: number) => (
        <ChapterInput
          key={field.id}
          id={field.id}
          index={index}
          shouldDisplayHours={shouldDisplayHours}
          onDelete={remove}
        />
      ))}

      <AddButton onClick={handleAdd}>{t("chapters/addBtn")}</AddButton>
    </>
  );
};

import React, { FC, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { Input } from "@/ui/Input/Input";
import { IconButton } from "@/ui/IconButton/IconButton";
import { TimeFormats, TimeMasks } from "./Chapters.constants";
import { IChaptersForm } from "./chapters.forms";

interface IChapterInputProps {
  shouldDisplayHours: boolean;
  id: string;
  index: number;
  onDelete: (index: number) => void;
}

export const useStyles = makeStyles((theme: Theme) => {
  const { spacing } = theme;

  return {
    inputWrapper: {
      display: "flex",
      gap: spacing(2),
      marginBottom: spacing(2),
      alignItems: "flex-start",
    },
    time: {
      width: "7.3rem",
      flexShrink: 0,
    },
    deleteBtn: {
      width: "4rem",
      height: "4rem",
      flexShrink: 0,
    },
  };
});

export const ChapterInput: FC<IChapterInputProps> = ({
  shouldDisplayHours,
  id,
  index,
  onDelete,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { control } = useFormContext<IChaptersForm>();

  const inputFormat = useMemo(() => {
    const type = shouldDisplayHours
      ? TimeFormats.WITH_HOURS
      : TimeFormats.WITHOUT_HOURS;

    return {
      maskPlaceholder: TimeMasks[type].placeholder,
      format: TimeMasks[type].mask,
    };
  }, [shouldDisplayHours]);

  return (
    <div key={id} className={classes.inputWrapper}>
      <Controller
        name={`chapters.${index}.start`}
        control={control}
        render={({
          field: { ref: _ref, name, ...rest },
          fieldState: { error },
        }) => (
          <Input
            {...rest}
            className={classes.time}
            data-testid={`chapterStartInput${index}`}
            id={`create-${name}`}
            name={`create-${name}`}
            mask={inputFormat}
            errorMessage={t(error?.message || "")}
          />
        )}
      />

      <Controller
        name={`chapters.${index}.title`}
        control={control}
        render={({
          field: { ref: _ref, name, ...rest },
          fieldState: { error },
        }) => (
          <Input
            {...rest}
            data-testid={`chapterTitleInput${index}`}
            id={`create-${name}`}
            name={`create-${name}`}
            placeholder={t("chapters/descriptionInput/placeholder")}
            errorMessage={t(error?.message || "")}
          />
        )}
      />

      {index !== 0 && (
        <IconButton
          className={classes.deleteBtn}
          iconName="close"
          data-testid="deleteBtn"
          onClick={() => onDelete(index)}
        />
      )}
    </div>
  );
};

import { yupResolver } from "@hookform/resolvers/yup";
import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import React, { FC, useContext } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { showToaster } from "@/helpers/toaster";
import { createLiveChapters, updateLiveChapters } from "@/services/chapters";
import { updateChapters } from "@/context/live/actions";
import { LiveContext } from "@/context/live/provider";

import { Button } from "@/ui/Button/Button";
import { Panel } from "@/ui/Panel/Panel";
import { Switch } from "@/ui/Switch/Switch";
import { ChaptersList } from "./ChaptersList";
import { getChaptersToSecondsFormat, hasHours } from "./Chapters.helpers";
import {
  chaptersSchema,
  createFormDefaultValues,
  IChaptersForm,
} from "./chapters.forms";

interface IChaptersPanelProps {
  duration: number;
}

export const useStyles = makeStyles((theme: Theme) => {
  const { spacing } = theme;

  return {
    formWrapper: {
      padding: spacing(4),
      overflowY: "auto",
    },
    switch: {
      marginBottom: spacing(4),
    },
  };
});

export const ChaptersPanel: FC<IChaptersPanelProps> = ({ duration }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { store, dispatch } = useContext(LiveContext);

  const formHandler = useForm<IChaptersForm>({
    mode: "onSubmit",
    resolver: yupResolver(chaptersSchema),
    defaultValues: createFormDefaultValues(duration, store.live),
    context: {
      duration,
      replayStartTime: store.live?.startTime ?? 0,
    },
  });

  const { watch, handleSubmit, control } = formHandler;
  const isActive = watch("isActive");

  const handleOnSubmit = () => {
    handleSubmit(async (values: IChaptersForm) => {
      if (!store.live?.id) return;

      const { isActive, chapters } = values;

      const newChapters = {
        id: store.live.id,
        chapters: getChaptersToSecondsFormat(chapters),
        isActive,
      };

      try {
        !store.liveChapters
          ? await createLiveChapters(newChapters)
          : await updateLiveChapters(newChapters);

        showToaster({
          status: "success",
          title: t("chapters/success/title"),
          description: t("chapters/success/description"),
        });
        dispatch(updateChapters(newChapters));
      } catch (error) {
        showToaster({
          status: "error",
          title: t("chapters/error/title"),
          description: t("chapters/error/description"),
        });
      }
    })();
  };

  return (
    <FormProvider {...formHandler}>
      <Panel
        title={t("chapters/title")}
        optionalClasses={{
          content: classes.formWrapper,
        }}
      >
        <Controller
          name="isActive"
          control={control}
          render={({ field: { ref: _ref, name, onChange, ...rest } }) => (
            <Switch
              {...rest}
              className={classes.switch}
              data-testid="chaptersSwitch"
              id={`chapters-${name}`}
              name={`chapters-${name}`}
              labelDescription={t("chapters/description")}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChange(event.target.checked);
              }}
            />
          )}
        />

        {isActive && <ChaptersList shouldDisplayHours={hasHours(duration)} />}

        <Button
          isDisabled={!formHandler.formState.isDirty}
          onClick={handleOnSubmit}
        >
          {t("common/save")}
        </Button>
      </Panel>
    </FormProvider>
  );
};

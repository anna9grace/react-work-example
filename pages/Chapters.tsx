import React, { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { withAuth } from "@/hoc/withAuth";
import { LiveContext } from "@/context/live/provider";
import { ProductProvider } from "@/context/product/provider";
import { updateChapters } from "@/context/product/actions";
import { getChapters } from "@/services/chapters";

import { DefaultLayout } from "@/layout/DefaultLayout";
import { Player } from "@/views/Player/Player";
import { ChaptersPanel } from "@/views/Chapters/ChaptersPanel";

export const useStyles = makeStyles((theme: Theme) => {
  const { spacing } = theme;

  const pagePadding = spacing(6);
  const widthPercentage = 0.66;

  return {
    root: {
      position: "relative",
      display: "flex",
      flexGrow: "1",
      gap: spacing(4),
      padding: pagePadding,
      overflow: "hidden",
    },
    videoWrapper: {
      width: `calc((100vw - ${pagePadding * 2})*${widthPercentage})`,
      gap: spacing(4),
    },
    videoPlayer: {
      position: "relative",
      width: "50%",
      height: "100%",
    },
  };
});

const Chapters: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { store, dispatch } = useContext(LiveContext);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (store.live && ["ongoing"].includes(store.live.state)) {
      navigate("/");
    }
  }, [store.live]);

  useEffect(() => {
    const fetchData = async () => {
      if (store.live) {
        const chaptersData = await getChapters(store.live.id);
        dispatch(updateChapters(chaptersData));
      }
    };
    fetchData();
  }, []);

  const handleOnLoad = (duration: number) => {
    setDuration(duration);
  };

  return (
    <ProductProvider>
      <DefaultLayout>
        <div className={classes.root}>
          <ChaptersPanel duration={duration ?? 0} />

          <div className={classes.videoWrapper}>
            {store.live && (
              <div className={classes.videoPlayer} data-testid="chaptersPlayer">
                <Player live={store.live} onLoad={handleOnLoad} />
              </div>
            )}
          </div>
        </div>
      </DefaultLayout>
    </ProductProvider>
  );
};

export default withAuth(Chapters);

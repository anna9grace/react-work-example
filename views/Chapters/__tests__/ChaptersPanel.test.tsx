import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";
import { waitFor } from "@testing-library/react";

import { renderWithProviders } from "@/utils/renderWithProviders";
import { getChaptersMock } from "@/helpers/__mocks__/chapters";
import * as chaptersServices from "@/services/chapters";
import { ChaptersPanel } from "../ChaptersPanel";

const mockUpdate = jest.fn();

describe("#ChaptersPanel", () => {
  const defaultProps = {
    duration: 115,
  };

  it("Should render component with props", () => {
    renderWithProviders(<ChaptersPanel {...defaultProps} />);

    expect(screen.getByText("chapters/title")).toBeInTheDocument();
    expect(screen.getByText("chapters/description")).toBeInTheDocument();
    expect(screen.getByText("save")).toBeInTheDocument();
  });

  it("Should render component correctly if  Chapters is activated", () => {
    renderWithProviders(<ChaptersPanel {...defaultProps} />);

    const chaptersSwitch = screen
      .getByTestId("chaptersSwitch")
      .querySelector("input");

    expect(screen.queryByText("chapters/addBtn")).not.toBeInTheDocument();
    chaptersSwitch && userEvent.click(chaptersSwitch);
    expect(screen.queryByText("chapters/addBtn")).toBeInTheDocument();
    expect(screen.queryByTestId("chapterTitleInput0")).toBeInTheDocument();
  });

  it("Should update chapters when form is validated and submitted", async () => {
    jest
      .spyOn(chaptersServices, "updateChapters")
      .mockImplementation(mockUpdate);

    renderWithProviders(<ChaptersPanel {...defaultProps} />);

    const chaptersSwitch = screen
      .getByTestId("chaptersSwitch")
      .querySelector("input");
    chaptersSwitch && userEvent.click(chaptersSwitch);
    const saveBtn = screen.getByText("save");
    userEvent.click(saveBtn);

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        ...getChaptersMock(),
        isActive: true,
      })
    );
  });
});

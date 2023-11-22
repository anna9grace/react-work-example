import { screen } from "@testing-library/react";

import { renderWithProviders } from "@/utils/renderWithProviders";
import * as chaptersService from "@/services/chapters";
import { getChaptersMock } from "@/helpers/__mocks__/chapters";
import { getLiveMock } from "@/helpers/__mocks__/live";
import Chapters from "../Chapters";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockNavigate,
}));

describe("#Chapters Page", () => {
  it("should display default page", async () => {
    jest
      .spyOn(chaptersService, "getChapters")
      .mockResolvedValue(getChaptersMock());
    renderWithProviders(<Chapters />);

    expect(screen.queryByText("chapters/title")).toBeInTheDocument();
    expect(screen.queryByText("chapters/addBtn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("chaptersPlayer")).toBeInTheDocument();
  });

  it("should redirect to the root page if live is ongoing", () => {
    jest
      .spyOn(chaptersService, "getChapters")
      .mockResolvedValue(getChaptersMock());

    renderWithProviders(<Chapters />, {
      live: { ...getLiveMock({ state: "ongoing" }) },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

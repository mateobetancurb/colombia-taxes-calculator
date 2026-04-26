import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves a simulation in local history and restores it", async () => {
    render(<App />);

    const saveNameInput = screen.getByLabelText("Nombre del escenario");
    fireEvent.change(saveNameInput, { target: { value: "Plan QA 2026" } });

    const saveButton = screen.getAllByText("Guardar en historial")[0];
    fireEvent.click(saveButton);

    expect(await screen.findByText("Plan QA 2026")).toBeInTheDocument();

    const restoreButton = screen.getByRole("button", { name: "Restaurar" });
    fireEvent.click(restoreButton);

    expect(screen.getByLabelText("Nombre del escenario")).toHaveValue("Plan QA 2026");
  });

  it("exports results as json", () => {
    const objectUrlSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const revokeSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Descargar JSON" }));

    expect(objectUrlSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeSpy).toHaveBeenCalledWith("blob:mock-url");

    objectUrlSpy.mockRestore();
    revokeSpy.mockRestore();
    clickSpy.mockRestore();
  });
});

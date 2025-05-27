import { screen, fireEvent, within } from "@testing-library/react";

export const clickMultiSelect = async (name, values) => {
  const element = screen.getByRole("button", {
    name,
  });
  fireEvent.mouseDown(element);

  const menu = screen.getByRole("listbox");
  values.forEach((value) => {
    const option = within(menu).getByRole("option", { name: value });
    fireEvent.click(option);
  });

  fireEvent.mouseDown(element.parentElement);
};

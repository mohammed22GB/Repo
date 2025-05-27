import { screen, fireEvent, within } from "@testing-library/react";

export const clickSelect = async (element, value) => {
  fireEvent.mouseDown(element);

  const menu = screen.getByRole("listbox");
  const option = within(menu).getByRole("option", { name: value });

  fireEvent.click(option);
};

export const clickSelectInput = async (name, value) => {
  const element = screen.getByRole("button", {
    name,
  });
  fireEvent.mouseDown(element);

  const menu = screen.getByRole("listbox");
  const option = within(menu).getByRole("option", { name: value });
  fireEvent.click(option);

  fireEvent.mouseDown(element.parentElement);
};

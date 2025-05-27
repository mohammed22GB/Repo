import { screen, fireEvent } from "@testing-library/react";

export const clickOutside = () => {
  const body = screen.getByRole("presentation").firstChild;
  fireEvent.click(body);
};

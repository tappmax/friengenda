import { variables } from "styles/common.styles";

export const getTableRowBackgroundColor = (i: number) => {
  return i % 2 === 0
    ? variables.solidColors.white
    : variables.alphaColors.frenGreen20;
};


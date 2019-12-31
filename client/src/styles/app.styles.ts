import { variables } from "./common.styles";

export const appStaticStyles = {
  contentSection: {
    padding: "1rem",
    minHeight: "calc(100vh - 180px)",
    minWidth: "50em"
  },
  formControl: {
    marginBottom: "1rem",
    paddingRight: "1rem",
    maxWidth: 670,
    width: "100%"
  },
  table: {
    header: {
      backgroundColor: variables.brandColors.frenPrimary,
      textAlign: "left" as any,
      color: variables.solidColors.white,
      icon: {
        color: variables.solidColors.white
      }
    },
    body: {
      padding: "0 1rem"
    }
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute" as any,
    color: variables.solidColors.white,
    top: 20,
    width: 1
  }
};

import React from "react";
import { sections } from "data/navigation.data";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { NavLink } from "models/nav.models";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { variables } from "styles/common.styles";

interface Props {
  username: string;
}

export const UserMenu = ({ username }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let links: NavLink[] = [];
  const accountNavSection = sections
    .filter(x => x.enabled && x.nav==="top")
    .find(x => x.name === "account");
  if (accountNavSection) {
    links = accountNavSection.links.filter(x => x.enabled);
  }

  if (!links.length) {
    return <div style={{ fontSize: "1rem", padding: "1rem" }}>{username}</div>;
  } else {
    return (
      <>
        <Button
          aria-controls="account-menu"
          aria-haspopup="true"
          style={{ color: "white", padding: "1rem" }}
          onClick={handleClick}
        >
          {username}{" "}
          <ExpandMoreIcon style={{ paddingBottom: 2, marginLeft: 5 }} />
        </Button>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {links.map(link => (
            <a
              key={`toolbar-user-menu-${link.path}`}
              href={link.path}
              style={{
                color: variables.brandColors.frenPrimary,
                textDecoration: "none"
              }}
            >
              <MenuItem onClick={handleClose}>{link.text}</MenuItem>
            </a>
          ))}
        </Menu>
      </>
    );
  }
};

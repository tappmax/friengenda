import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  CssBaseline,
  Container,
  Grid,
  makeStyles
} from "@material-ui/core";
import { variables } from "styles/common.styles";
import * as logo from "assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { LoginCredentials, CommonState, AppUser } from "models";
import { login } from "actions/auth.actions";
import { urlGetQueryParameter } from "helpers/url.helpers";
import { UserConstants } from "constants/user.constants";
import { ReduxState } from "redux/orchestrator";
import { FrenErrorPanel } from "components/shared/common";
import AuthService from "common/auth";

const useStyles = makeStyles(theme => ({
  root: {
    width: 350,
    padding: 20,
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#333333",
    boxShadow: "0 4 8 rgba(0, 0, 0, 0.2)",
    backgroundColor: variables.solidColors.white,
    borderRadius: variables.common.boxBorderRadius
  },
  gridItem: {
    width: "100%",
    marginTop: theme.spacing(2)
  },

  buttonGridItem: {
    width: "100%",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  },

  logoGridItem: {
    width: "100%",
    marginTop: theme.spacing(2),
    "& img": {
      width: 200
    }
  }
}));

type Props = {
  match: any;
  location: any;
}

export const Login = (props: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [credentials, setCredentials]: [
    LoginCredentials,
    React.Dispatch<React.SetStateAction<LoginCredentials>>
  ] = useState(UserConstants.defaults.loginCredentials);
  const user = useSelector<ReduxState,CommonState<AppUser>>(state => state.user);

  useEffect(() => {
    AuthService.clearToken();
  }, [] );

  const handleLogin = () => {
    dispatch(
      login(
        {...credentials, redirect: urlGetQueryParameter(props.location.search, 'redirect')
      })
    )
  }

  const handleLoginButton = (e: any) => {
    e.preventDefault();
    handleLogin();
  }

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <div className={classes.root}>          
          <Grid
            className={classes.logoGridItem}
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <img src={logo.default.toString()} alt="fren-logo" />
            </Grid>
            {user.error && (<Grid item><FrenErrorPanel error={user.error}/></Grid>)}
            <Grid item xs className={classes.gridItem}>
              <TextField
                label="Username"
                color="secondary"
                style={{ width: "100%" }}
                value={credentials.username}
                onKeyPress={handleKeyPress}                                
                onChange={e => {
                  e.preventDefault();
                  const newValue = e.target.value;
                  setCredentials({...credentials, username: newValue});
                }}
              />
            </Grid>
            <Grid item xs className={classes.gridItem}>
              <TextField
                label="Password"
                color="secondary"
                type="password"
                value={credentials.password}
                style={{ width: "100%" }}
                onKeyPress={handleKeyPress}
                onChange={e => {
                  e.preventDefault();
                  const newValue = e.target.value;
                  setCredentials({...credentials, password: newValue});
                }}
              />
            </Grid>
            <Grid item xs className={classes.buttonGridItem}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLoginButton}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

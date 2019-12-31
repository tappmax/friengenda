import { connect } from "react-redux";
import { Alerts } from "./alert.component";
import { ReduxState } from "redux/orchestrator";

const mapStateToProps = (state: ReduxState) => ({
    router: state.router
})

export const AlertContainer = connect(mapStateToProps, null)(Alerts);

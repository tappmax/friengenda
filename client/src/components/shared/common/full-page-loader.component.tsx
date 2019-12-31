import React, { Component } from "react";
import { CircularProgress } from "@material-ui/core";
import { variables } from "styles/common.styles";
interface Props {
  /** Delay showing loading prompt. In Milliseconds. */
  wait?: number;
}
interface State {
  hidden: boolean;
}
export class FrenFullPageLoader extends Component<Props, State> {
  private _timeout: any;
  constructor(props: Props) {
    super(props);
    this.state = { hidden: true };
  }
  componentDidMount() {
    this._timeout = setTimeout(() => {
      this.setState({ hidden: false });
    }, this.props.wait);
  }
  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  render() {
    if (this.state.hidden) return null;
    return (
      <>
        <div
          style={{
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: variables.alphaColors.black10,
            width: "100%",
            height: "100%",
            zIndex: 9999
          }}
        >
          <CircularProgress
            style={{
              position: "absolute",
              top: "40%",
              left: "50%"
            }}
          />
        </div>
      </>
    );
  }
}

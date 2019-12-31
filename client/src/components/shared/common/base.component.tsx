import { Component } from "react";
export class FrenBaseClassComponent<P, S> extends Component<P, S> {
  private _isMounted: boolean;
  constructor(props: P) {
    super(props);
    this._isMounted = false;
    const originalSetState = this.setState.bind(this);
    this.setState = (newState: any, cb?: () => void) => {
      if (this._isMounted) {
        originalSetState(newState, cb);
      }
    };
    const originalComponentDidMount = this.componentDidMount;
    this.componentDidMount = (...args) => {
      this._isMounted = true;
      if (originalComponentDidMount) {
        originalComponentDidMount.apply(this, args);
      }
    };
    const originalComponentWillUnmount = this.componentWillUnmount;
    this.componentWillUnmount = (...args) => {
      this._isMounted = false;
      if (originalComponentWillUnmount) {
        originalComponentWillUnmount.apply(this, args);
      }
    };
  }
}

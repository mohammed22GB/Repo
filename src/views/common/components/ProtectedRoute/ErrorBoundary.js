import React, { Component } from "react";
import GeneralError from "./components/GeneralError";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      description: "",
      subject: "",
      info: null,
      error: null,
      loading: false,
    };
  }
  componentDidCatch(err, info) {
    this.setState({ hasError: true, info: info.componentStack, error: err });
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  render() {
    // //console.log(this.props)
    if (this.state.hasError && this.props.render) {
      return this.props.render(this.state.error, this.state.info);
    }
    if (this.state.hasError) {
      return <GeneralError />;
    }
    return this.props.children;
  }
}

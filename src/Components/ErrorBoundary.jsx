import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = {error:null, info:null}; }
  static getDerivedStateFromError(error){ return {error}; }
  componentDidCatch(error, info){ console.error("ErrorBoundary:", error, info); this.setState({ info }); }
  render(){
    if (this.state.error) {
      return (
        <div style={{padding:20}}>
          <h2 style={{color:"#b00020"}}>App crashed</h2>
          <pre style={{whiteSpace:"pre-wrap"}}>{String(this.state.error)}{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

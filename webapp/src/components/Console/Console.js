import React from 'react'
// import withStyles from '@material-ui/core/styles/withStyles';
// import Grid from '@material-ui/core/Grid';

// const ContainerStyled = withStyles({
//   root: {
//     backgroundColor: "#1f4068",
//     fontFamily: "monospace",
//     flexBasis: "50%",
//     overflow: "auto",
//     flexWrap: "nowrap"
//   }
// })(Grid);

const style = {
  console: {
    backgroundColor: "#1f4068",
    fontFamily: "monospace",
    flexBasis: "50%",
    overflow: "auto",
    flexWrap: "nowrap",
    color: "white"
  }
}

class Console extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      children: ["DeepDream Maker ready..."]
    }
  }

  componentDidUpdate() {
    //scroll textarea into view
    this.ref.current.scrollTop = this.ref.current.scrollHeight;
  }


  add(msg, timeStamp = true) {
    let log = this.state.children.length > 100 ? [] : this.state.children;
    const newMessage = (timeStamp ? new Date().toLocaleTimeString() + "|" + msg : msg);
    log.push(newMessage)
    this.setState({ children: log });
  }

  render() {
    return (
      // <ContainerStyled direction="column" container item data-testid="console">
      //   {  this.state.children.map((msg, idx) => <div key={idx}>{msg}</div>) }
      // </ContainerStyled>
      <textarea style={style.console} rows="16" value={this.state.children.join("\n")} readOnly ref={this.ref}/>
    );
  }
}
export default Console;
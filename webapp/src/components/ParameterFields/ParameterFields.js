import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme) => ({
  //const styles = theme => ({
  smallHeading: {
    color: "orange",
    fontWeight: 600,
  },
  smallButton: {
    minWidth: 0
  },
  inputField: {
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    },
    appearance: "textfield",
    width: 40,
    margin: 0,
    textAlign: "center"
  }
}));

//small buttons next to input field to increase/decrease value
function SmallButton({ facing, onClick, label }) {
  const { smallButton } = useStyles();
  const ariaLabel = `${label}-${facing}`
  return <Button
    onClick={onClick}
    color="primary"
    size="small"
    aria-label={ariaLabel}
    className={smallButton}
  >
    {facing === "up" ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
  </Button>
}

//input[number] element for parameters input
function InputBox({ label, step, min, value, onChange }) {
  const { inputField } = useStyles();

  const inputProps = {
    step: step,
    min: min,
    className: inputField,
    "aria-label": label
  }
  return <TextField
    type="number"
    inputProps={inputProps}
    value={value}
    name={label}
    onChange={onChange}
    required
  />
}

function ParameterField({ label, step, value, callBacks }) {

  //increment parameter number based on step size
  const handleDecrement = (e) => {
    e.preventDefault();
    const id = label.toLowerCase().replace(/ /g, '');
    let offSet = step === 1 ? 1 : 0.1;
    offSet = value - offSet;
    offSet = Math.round(offSet * 10) / 10;
    offSet = offSet > 0 ? offSet : step;
    //update state in parent component
    callBacks.onButtonChange(id, offSet);
  }

  //decrement parameter number based on step size
  const handleIncrement = (e) => {
    e.preventDefault();
    const id = label.toLowerCase().replace(/ /g, '');
    let offSet = step === 1 ? 1 : 0.1;
    offSet = value + offSet;
    offSet = Math.round(offSet * 10) / 10;
    //update state in parent component
    callBacks.onButtonChange(id, offSet);
  }

  //make label lowercase and no spaces
  const id = label.toLowerCase().replace(/ /g, '');
  return (
    <Grid item>
      <label htmlFor={id}>{label}</label>
      <span style={{ display: "flex" }}>
        <SmallButton onClick={handleDecrement} facing="down" label={id} />
        <InputBox
          label={id}
          step={step}
          min={step}
          value={value}
          onChange={callBacks.onInputChange}
        />
        <SmallButton onClick={handleIncrement} facing="up" label={id} />
      </span>
    </Grid>
  );

}

function ParameterFields({ data }) {
  const classes = useStyles();
  const { iterations, octaves, octavescale, jitter, stepsize } = data.state;
  return (
    <Grid container item>
      <div className={classes.smallHeading} >DeepDream parameters:</div>
      <Grid container justify="space-evenly">
        <ParameterField label="Iterations" step={1} value={iterations} callBacks={data.callBacks} />
        <ParameterField label="Octaves" step={1} value={octaves} callBacks={data.callBacks} />
        <ParameterField label="Octave Scale" step={0.1} value={octavescale} callBacks={data.callBacks} />
        <ParameterField label="Jitter" step={1} value={jitter} callBacks={data.callBacks} />
        <ParameterField label="Step Size" step={0.1} value={stepsize} callBacks={data.callBacks} />
      </Grid>
    </Grid>
  );
}

export default ParameterFields;
//export default withStyles(styles)(ParameterFields);
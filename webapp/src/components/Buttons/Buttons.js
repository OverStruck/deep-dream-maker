import React from 'react';
import styles from './Buttons.module.css';

class Button extends React.Component {

    render() {
        //make name lowercase with underline between words
        const name = this.props.text.toLowerCase().replace(/ /g, '_');
        return (
            <button
                className={styles.button}
                type={this.props.type}
                name={name}
                {...(this.props.onClick ? { onClick: this.props.onClick } : {})}

            >
                {this.props.text}
            </button>
        );
    }
}

function Buttons(props) {
    return (
        <div className={styles.buttons}>
            <Button text="Make it Dream" type="submit" />
            <Button text="Stop Dream" type="button" onClick={props.stopDream} />
            <Button text="Download Dream" type="button" onClick={props.downloadDream} />
        </div>
    );
}

export default Buttons;
import React from 'react';
import ParameterFields from '../ParameterFields/ParameterFields';

class MyForm extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.onFormSubmit}>
                <ParameterFields />
            </form>
        );
    }
}

export default MyForm;
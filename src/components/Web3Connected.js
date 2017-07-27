import React, { Component } from 'react'
import Typography from 'material-ui/Typography';

class Web3Connected extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        if(this.props.web3) {
            return (
                <div>
                    <Typography color="inherit" type="subheading">
                        Web3 Enabled
                    </Typography>
                </div>
            )
        }
        else {
            return (
                <Typography color="accent" type="subheading">
                    Web3 Disabled
                </Typography>
            )
        }
    }

}

export default Web3Connected
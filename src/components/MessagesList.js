import React, { Component } from 'react'
import Typography from 'material-ui/Typography';
import List, {ListItem, ListItemText} from 'material-ui/List';
import Moment from 'react-moment';

class MessagesList extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        if(!this.props.messages || this.props.messages.length === 0) {
            return <Typography>No messages found. </Typography>;
        }
        else {
            return (
                <List>
                    {this.props.messages.sort((a,b)=> new Date(a.date) - new Date(b.date)).reverse().map( (o, i) =>
                        <ListItem key={i}>
                            <ListItemText
                             primary={o.message}
                             secondary={<span><Moment fromNow date={o.date} /> from {o.from}</span>}
                            />
                        </ListItem>        
                    )}
                </List>
            );
        }
    }

}

export default MessagesList
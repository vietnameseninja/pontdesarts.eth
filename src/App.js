import React, { Component } from 'react'
import InternetWall from '../build/contracts/InternetWall.json'
import getWeb3 from './utils/getWeb3'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  // Redirect,
  // withRouter
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';


import Grid from 'material-ui/Grid';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';



// import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation';
// import RestoreIcon from 'material-ui-icons/Restore';
// import FavoriteIcon from 'material-ui-icons/Favorite';
// import HomeIcon from 'material-ui-icons/Home';
// import LocationOnIcon from 'material-ui-icons/LocationOn';

import Web3Connected from './components/Web3Connected';
import MessagesList from './components/MessagesList';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';


import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      message: null,
      date: null,
      messages: [],
      web3: {},
      tab: 0,
      redirect: false
    }
    this.history = createBrowserHistory();
    this.history.listen((location, action) => {
      console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
      console.log(`The last navigation action was ${action}`)
    })

    this.addMessageClick = this.addMessageClick.bind(this);
    // this.handleBottomNavigation = this.handleBottomNavigation.bind(this);
    // this.updateState = this.updateState.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        this.instantiateContract()
      })
      .catch((err) => {
        console.log('Error finding web3.', err)
      })
  }

  instantiateContract() {

    const contract = require('truffle-contract')
    const internetWall = contract(InternetWall);
    internetWall.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts((error, accounts) => {
      this.accounts = accounts
      internetWall.at("0x38e8883685b3db20edd619edfd2f162f9d2c3356").then((instance) => {
        this.internetWallInstance = instance

        this.internetWallInstance.NewMessage({ nonce: 1 }, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch((error, resp) => {
          if(error) return console.error(error);
          console.debug(resp);
          console.debug("New Message: " + resp.args.newMsg + " at " + (new Date(resp.args.timestamp.c[0] * 1000)).toUTCString());
          this.setState({
            message: resp.args.newMsg,
            date: new Date(resp.args.timestamp * 1000),
            messages: this.state.messages.concat({
              message: resp.args.newMsg,
              date: new Date(resp.args.timestamp * 1000),
              from: resp.args[""]
            })
          });
        });
      })
    });
  }

  addMessageClick() {
    var msg = document.getElementById("newMsg").value;
    document.getElementById("newMsg").value = '';
    console.debug(msg);
    this.internetWallInstance
      .addMessage(msg, {
        from: this.accounts[0]
      })
      .then((tx) => {
        console.debug(tx);
      })
      .catch(error => console.error(error));
  }

  // handleBottomNavigation = (event, val) => {
  //   this.setState({
  //     tab: val
  //   });
  //   console.log(val)
  //   switch (val) {
  //     case 0:
  //       // this.setState({
  //       //   redirect:true,
  //       //   redirectTo: "/"
  //       // });
  //       this.history.push("/");
  //       break;
  //     case 1:
  //       // this.setState({
  //       //   redirect:true,
  //       //   redirectTo: "/write"
  //       // });
  //       this.history.push("/write");
  //       break;
  //     case 2:
  //       // this.setState({
  //       //     redirect:true,
  //       //     redirectTo: "/recents"
  //       //   });
  //       this.history.push("/recents");
  //       break;
  //     default:
  //       // this.setState({
  //       //   redirect:true,
  //       //   redirectTo: "/not-found"
  //       // });
  //       this.history.push("/not-found");
  //       break;
  //   }
  // }


  render() {
    // const {
    //   redirect
    // } = this.state;

    // if(redirect) {
    //   // return 
    //     // <Redirect to={this.state.redirectTo} />
    //     return this.props.history.push(this.state.redirectTo);

    // }

    const Home = () => (
        <Grid item xs={12} md={8} lg={6} xl={6}>
          <Paper elevation={4} style={classes.paper}>
            <Typography type="headline" gutterBottom={true} component="h3">
              Immutable Locks on the Ethereum Blockchain
            </Typography>
            <Typography type="body2" component="div">
              Forever lasting love thanks to the Ethereum Blockchain Immutability.
            </Typography>
          </Paper>
        </Grid>
    )
    const Write = () => (
      <Grid item xs={12} md={8} lg={6} xl={6}>
        <Paper elevation={4} style={classes.paper}>
          <Typography type="headline" gutterBottom={true} component="h3">
            Add your message
          </Typography>
          <Typography type="body2" component="div">
            {mainApp}            
          </Typography>
        </Paper>
      </Grid>
    )
    const Recents = () => (
      <Grid item xs={12} md={8} lg={6} xl={6}>
        <Paper elevation={4} style={classes.paper}>
          <Typography type="headline" gutterBottom={true} component="h3">
            Last Messages
          </Typography>
          <Typography type="body2" component="div">
            <MessagesList messages={this.state.messages}></MessagesList>
          </Typography>
        </Paper>
      </Grid>
    )


    const NotFound = ({ location }) => (
      <Grid item xs={12} md={8} lg={6} xl={6}>
        <Paper elevation={4} style={classes.paper}>
          <Typography type="headline" gutterBottom={true} component="h3">
            Page not found
          </Typography>
          <Typography type="body2" component="div">
            Sorry but the page {location.pathname} is not correct.
          </Typography>
        </Paper>
      </Grid>
    )

    var mainApp = [];

    if (this.state.web3) {
      mainApp =
        (<div>
          <TextField
            required
            id="newMsg"
            label="Message"
            margin="normal"
            fullWidth
          />
          <Button raised color="primary" type="submit" onClick={this.addMessageClick}>Send</Button>
        </div>);
    } else {
      mainApp =
        (<div>Web3 is not connected to the Ethereum Blockchain. Please use a Web3 Browser or install Metamask.</div>);
    }


    const classes = {
      App: {
        // flexGrow:1,
      },
      MainContent: {
      },
      paper: {
        margin: 16,
        padding: 16,
        textAlign: 'center'
      },
      link: {
        textDecoration: 'none',
        color: 'inherit'
      },
      flex: {
        flex: 1,
      }
    }

    return (
      <Router >
        <MuiThemeProvider>
          <div className={classes.App}>

            <div>
              <AppBar position="static">
                <Toolbar>
                  <Typography type="title" color="inherit" style={classes.flex}>
                    <Link to="/" style={classes.link}>dPont Des Arts</Link>
                  </Typography>
                  <Web3Connected web3={this.state.web3} />
                </Toolbar>
              </AppBar>
              <div style={{margin:'auto'}}>
              <Grid container direction="row" align="center" justify="center">
                <Home/>
              </Grid>
              
                {/* //FIXME: fix router then remove */}
              <Grid container direction="row" align="center" justify="center">
                <Write />
              </Grid>
              <Grid container direction="row" align="center" justify="center">
                {this.state.web3 ? <Recents /> : null}
              </Grid>
              </div>

               {/* <BottomNavigation className="footer" value={this.state.tab} onChange={this.handleBottomNavigation}>
                <BottomNavigationButton label="Home" icon={<HomeIcon />} />
                <BottomNavigationButton label="Recents" icon={<RestoreIcon />} />
                <BottomNavigationButton label="Favorites" icon={<FavoriteIcon />} />
              </BottomNavigation>  */}
              {/* <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/write" component={Write} />
                <Route path="/recents" component={Recents} />
                <Route component={NotFound} />
              </Switch> */}
            </div>
          </div>
        </MuiThemeProvider>
      </Router>

    );
  }
}

export default App

import * as React          from 'react';
import service             from '../../../../../services/service';
import TextField           from '@material-ui/core/TextField';
import { withStyles }      from '@material-ui/core/styles';
import Button              from '@material-ui/core/Button';
import Box                 from '@material-ui/core/Box';
import clsx                from 'clsx';
import OutlinedInput       from '@material-ui/core/OutlinedInput';
import InputLabel          from '@material-ui/core/InputLabel';
import InputAdornment      from '@material-ui/core/InputAdornment';
import Switch              from '@material-ui/core/Switch';
import FormControlLabel    from '@material-ui/core/FormControlLabel';
import FormControl         from '@material-ui/core/FormControl';
import Visibility          from '@material-ui/icons/Visibility';
import VisibilityOff       from '@material-ui/icons/VisibilityOff';
import IconButton          from '@material-ui/core/IconButton';
import MenuItem            from '@material-ui/core/MenuItem';
import LinearProgress      from '@material-ui/core/LinearProgress';
import Select              from '@material-ui/core/Select';
import Paper               from '@material-ui/core/Paper';

const useStyles = theme => ({

  keyButton: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },

  textfield: {
    margin: theme.spacing(1),
  },

  progressLabel:{
    marginLeft: theme.spacing(3),
    //marginTop: theme.spacing(1),
    backgroundColor: "white",
  },

  paper:{
    margin: theme.spacing(1),
    width: '60ch',
    padding: theme.spacing(3),
  },

  keyField: {
    margin: theme.spacing(1),
    width: '60ch',
  },


  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class GitHubPagesForm extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      showPassword: false,
      setGitHubActionsSwitchEnable: false,
      pubData:{
        type: 'github',
        username:'',
        email:'',
        repository:'',
        branch:'main',
        deployPrivateKey:'',
        deployPublicKey:'xxxx',
        publishScope:'build',
        setGitHubActions: false,
        keyPairBusy: true,
        overrideBaseURLSwitch: false,
        overrideBaseURL: '',
      }
    }
  }

  getKeyPair(){
    this.setState({
      keyPairBusy: true
    });

    let promise = service.api.createKeyPairGithub();

    promise.then((resp)=>{
      this.updatePubData({deployPrivateKey: resp.keyPair[0], deployPublicKey: resp.keyPair[1] },
        ()=>{
          this.setState({ keyPairBusy: false })
          //service.api.logToConsole(this.state.pubData, "keypair2")
        }
      );

    }, (e)=>{
          service.api.logToConsole(e, "ERRR")
      this.setState({
        keyPairBusy: false
      });
    })
  }

  componentDidMount(){
    if(this.props.publishConf){
      this.setState({pubData: this.props.publishConf.config});
      if(this.props.publishConf.config.publishScope !== "build"){
        this.setState({
          setGitHubActionsSwitchEnable:true
        });
      }

    }
    else{
      this.getKeyPair();
    }
  }

  updatePubData(newData, callback=null){
    let pubData = {...this.state.pubData, ...newData};
    this.setState({pubData: pubData}, ()=>{
      this.props.setData(pubData);

      if(pubData.username !== '' && pubData.repository !=='' && pubData.branch !== '' && pubData.email !== ''){
        this.props.setSaveEnabled(true);
      }
      else{
        this.props.setSaveEnabled(false);
      }
      typeof callback === 'function' && callback();
    });

  }

  render(){
    let { classes } = this.props;

    return (
      <React.Fragment>
        <Box my={2}>
          <TextField
            id="username-organization"
            label="Username / Organization"
            helperText="GitHub username or organization containing the target repository"
            variant="outlined"
            className={classes.textfield}
            value={this.state.pubData.username}
            onChange={(e)=>{
              this.updatePubData({username: e.target.value });
            }}
          />
          <TextField
            id="email"
            label="E-mail"
            helperText="E-mail address to use for commit messsages"
            variant="outlined"
            className={classes.textfield}
            value={this.state.pubData.email}
            onChange={(e)=>{
              this.updatePubData({email: e.target.value });
            }}
          />
        </Box>
        <Box my={2}>
          <TextField
            id="repository"
            label="Repository"
            helperText="Target Repository"
            variant="outlined"
            className={classes.textfield}
            value={this.state.pubData.repository}
            onChange={(e)=>{
              this.updatePubData({repository: e.target.value });
            }}
          />
          <TextField
            id="branch"
            label="Branch"
            onChange={(e)=>{
              this.updatePubData({branch: e.target.value });
            }}
            value={this.state.pubData.branch}
            helperText="Target Branch"
            variant="outlined"
            className={classes.textfield}
          />
        </Box>

        <Box my={2}>

          {(this.state.keyPairBusy ?
            <FormControl className={classes.margin}>
              <InputLabel shrink htmlFor="progress" className={classes.progressLabel}>
                Deploy Public Key
              </InputLabel>
              <Paper variant="outlined" id="progress" elevation={1} className={classes.paper}>
                <LinearProgress   />
              </Paper>
            </FormControl>
            :

          <React.Fragment>
          <FormControl className={clsx(classes.margin, classes.keyField)} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Deploy Public Key</InputLabel>

            <OutlinedInput
              id="outlined-adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.pubData.deployPublicKey}
              onChange={(e)=>{
                //this.updatePubData({deployPublicKey: e.target.value });
              }}

              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle deploy key visibility"
                    onClick={()=>{
                      this.setState({ showPassword: !this.state.showPassword });

                    }}
                    onMouseDown={(event)=>{
                      event.preventDefault();
                    }}
                    edge="end"
                  >
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={140}
            />
          </FormControl>
          </React.Fragment>
          )}
          <Button className={classes.keyButton} disabled={this.state.keyPairBusy} onClick={()=>{

            const {clipboard} = window.require('electron')
            clipboard.writeText(this.state.pubData.deployPublicKey)
            //service.api.logToConsole(this.state.pubData.deployPublicKey);

          }} variant="contained">Copy</Button>
          <Button className={classes.keyButton} onClick={()=>{this.getKeyPair()}} disabled={this.state.keyPairBusy} color="secondary" variant="contained">Re-generate</Button>

        </Box>

        <Box my={2}>
                      <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Publish Source and Build</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={this.state.pubData.publishScope}
                onChange={(e)=>{
                  if(e.target.value === "build"){
                    this.updatePubData({
                      publishScope: e.target.value,
                      setGitHubActions: false,
                    });
                    this.setState({
                      setGitHubActionsSwitchEnable: false
                    });
                  }
                  else{
                    this.updatePubData({
                      publishScope: e.target.value,
                    });
                    this.setState({
                      setGitHubActionsSwitchEnable:true
                    });
                  }
                }}
                label="Publish Source and Build"
              >
                <MenuItem value="build">Publish only build files</MenuItem>
                <MenuItem value="source">Publish only source files</MenuItem>
                <MenuItem value="build_and_source">Publish source and build files</MenuItem>
              </Select>
            </FormControl>


          <FormControlLabel className={classes.keyButton}
              control={
                <Switch
                  checked={this.state.pubData.setGitHubActions}
                  disabled={!this.state.setGitHubActionsSwitchEnable}
                  onChange={(e)=>{
                    this.updatePubData({setGitHubActions: e.target.checked });
                  }}

                  name="configureActions"
                  color="primary"
                />
              }
              label="Configure GitHub Actions"
            />
        </Box>

        <Box my={2}>

            <FormControlLabel className={classes.keyButton}
              control={
                <Switch
                  checked={this.state.pubData.overrideBaseURLSwitch}
                  onChange={(e)=>{
                    if(this.state.pubData.overrideBaseURLSwitch){
                      this.updatePubData({
                        overrideBaseURLSwitch: e.target.checked,
                        overrideBaseURL: "",
                      });
                    }
                    else{
                      this.updatePubData({
                        overrideBaseURLSwitch: e.target.checked,
                      });
                    }
                  }}

                  name="overrideBaseURLSwitch"
                  color="primary"
                />
              }
              label="Override BaseURL"
            />

          <TextField
            id="baseUrl"
            label="BaseURL"
            disabled={!this.state.pubData.overrideBaseURLSwitch}
            onChange={(e)=>{
              this.updatePubData({overrideBaseURL: e.target.value });
            }}
            value={this.state.pubData.overrideBaseURL}
            helperText="Override Hugo Configuration with new baseURL"
            variant="outlined"
            className={classes.textfield}
          />

        </Box>

      </React.Fragment>
    )
  }
}

export default withStyles(useStyles)(GitHubPagesForm);


import * as React from 'react';
import Spinner from './../../../components/Spinner'
import service from './../../../services/service';
import { Dialog, FlatButton, TextField } from 'material-ui';
//import type { SiteConfig, WorkspaceHeader, WorkspaceConfig } from './../../../types';
//import { Accordion, AccordionItem } from './../../../components/Accordion';
//import IconNavigationCheck from 'material-ui/svg-icons/navigation/check';
import IconHttps from 'material-ui/svg-icons/action/https';
import Paper from 'material-ui/Paper';
//import FormData, {getHeaders} from 'form-data';
//import FormData from 'form-data';
let net = window.require('electron').remote.net;

export default class DisconnectDomainDialog extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            pogoCustomDomain: "",
            pogoCustomDomain_err: "",
            email_err: "",
            failure: false,
            busy: false,
            username: this.props.username,
            fingerprint: this.props.fingerprint
         }
    }
    componentDidMount(){
        service.getConfigurations().then((c)=>{
            var stateUpdate  = {};
            stateUpdate.pogoboardConn = c.global.pogoboardConn;
            this.setState(stateUpdate);
        })
    }

    handleCancelClick = () => {
        this.props.onCancelClick();
    }

    handleDisconnectDomainClick = async (context) => {

        this.setState({
            busy: true
        });

        this.disconnectDomain(this.props.sitePath, this.props.username, this.props.fingerprint, this.props.pogoCustomDomain);
    }

    disconnectDomain(sitePath, username, fingerprint, disconnectDomainString){
        if(username===""){
            this.setState({
                failure: true
            });

            this.setState({ busy: false });
            return
        }
        var postData = JSON.stringify({sitePath : sitePath, username: username, fingerprint: fingerprint, disconnectDomainString: disconnectDomainString});

        let data='';
        let request = net.request({
            method: 'POST',
            protocol: this.state.pogoboardConn.protocol,
            hostname: this.state.pogoboardConn.host,
            port: this.state.pogoboardConn.port,
            path: '/site/disconnect-domain',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        })

        request.on('response', (response) => {

            response.on('end', () => {
                let obj = JSON.parse(data);
                service.api.logToConsole(obj);
                if(obj === true){
                    this.props.onDisconnectDomainClick();
                }
                else{
                    this.setState({
                        failure: true
                    });
                }

                this.setState({ busy: false });
            });

            response.on("data", chunk => {
                data += chunk;
            });

        })
        request.write(postData)
        request.end()

    }

    handlepogoCustomDomainChange(e){

        let value = e.target.value;

        if(value!==''){

            let url = this.state.pogoboardConn.protocol+"//"+this.state.pogoboardConn.host+":"+this.state.pogoboardConn.port+"/stat/custom-domain/"+value;
            let data='';
            const request = net.request(url);
            request.on('response', (response) => {

                response.on('end', () => {
                    let obj = JSON.parse(data);

                    if(obj.status !== "free"){
                        this.setState({
                            pogoCustomDomain_err: "pogoCustomDomain is "+obj.status
                        });
                    }
                    else{
                        this.setState({
                            pogoCustomDomain_err: ""
                        });
                    }

                });
                response.on("data", chunk => {
                    data += chunk;
                });
            })
            request.end()
        }

        this.setState({
            pogoCustomDomain: value,
        });

    }

    handleTryAgain(){
        this.setState({
            pogoCustomDomain: "",
            busy: false,
            failure: false,
        });

    }


    renderForm(){
        let busy = this.state.busy;
        let previewUrl = this.props.pogoCustomDomain;
        return (
            <div>
                <Paper style={{margin:10,padding:"0 7px 7px 7px"}}>
                    <IconHttps viewBox="-5 0 35 10" color="#666" /><span>https://</span><span style={{color:"green"}}>{previewUrl}</span><span></span>
                </Paper>
            </div>
        )

    }

    renderFailure(){
        return (
                <div>
                    Something went wrong. Please <button className="reglink" onClick={()=>this.handleTryAgain()}>try again.</button>
                </div>
        )
    }

    render(){
        let { open } = this.props;
        let busy = this.state.busy;
        let failure = this.state.failure;

        const actions = [
            <FlatButton
                label="Cancel"
                primary={false}
                onClick={this.handleCancelClick.bind(this)}
            />,
            <FlatButton
                label="disconnect custom domain"
                primary={true}
                onClick={this.handleDisconnectDomainClick}
            />,
        ];

        return (
            <Dialog
                title="Confirm removal of custom domain?"
                open={open}
                actions={actions}>

                { failure? this.renderFailure() : this.renderForm() }
                { busy? <Spinner /> : undefined }
            </Dialog>
        );
    }

}

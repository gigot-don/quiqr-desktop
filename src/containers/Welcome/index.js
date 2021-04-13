import React from 'react';
import { Route } from 'react-router-dom';
import service from './../../services/service';

import { RaisedButton } from 'material-ui-02/';

const styles = {
    container:{
        padding: '20px',
        height: '100%'
    },
}

class Welcome extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    handleLinkThemeGallery = ()=>{
        window.require('electron').shell.openExternal("https://router.poppygo.app/theme-gallery");
    }

    handleLinkPoppyWebsite = ()=>{
        window.require('electron').shell.openExternal("https://poppygo.io/documentation/");
    }

    handleImportClick = ()=>{
        service.api.importSite();
    }

    handleNewSiteClick = ()=>{
        this.history.push('/');
    }

    handleCloseClick = ()=>{
        this.history.push('/');
    }

    handleShowWelcomeCheck = ()=>{
        if(this.state.showWelcome){
            this.setState({showWelcome: false});
        }
        else{
            this.setState({showWelcome: true});
        }
    }

    render(){
        return(
            <Route render={({history})=>{

                this.history = history;
                return (
                    <div style={ styles.container }>
                        <div style={{ border: 'solid 0px green', marginLeft: 'auto', marginTop: 13 }}>
                            <RaisedButton primary={true} label="Close and continue" disabled={false} onClick={this.handleCloseClick} />
                        </div>
                        <h1>Congratulations: You installed PoppyGo, The app for Hugo</h1>
                        <h3>You now have a publishing platform and CMS for your websites</h3>
                        <p>
                            <ul>
                                <li>Manage your content</li>
                                <li>Preview your updates</li>
                                <li>Publish with a single click</li>
                                <li>All without setup</li>
                            </ul>
                            <button className="reglink" onClick={this.handleLinkPoppyWebsite} >PoppyGo Docs</button>
                        </p>
                        <br/>
                        <strong><p>Did you receive a pogosite file?</p></strong>
                        <p>
                            Then import the site that your developer has created for you.
                            Your developer didn’t send you a site yet? Check the example template to start playing around.
                        </p>
                        <p>
                            <RaisedButton primary={true} label="Import file" disabled={false} onClick={this.handleImportClick} />
                        </p>
                        <br/>
                        <strong><p>Are you developing a Hugo site on your local machine?</p></strong>
                        <p>
                            Then open your existing site folder in PoppyGo to start content management and publishing right away.
                        </p>
                        <p>
                            <RaisedButton primary={true} label="Open site" disabled={false} onClick={this.handleNewSiteClick} />
                        </p>
                        <br/>
                        <strong><p>Are you new to Hugo sites, and do you want to start with an existing template?</p></strong>
                        <p>
                            Then select a template below to start and experience PoppyGo right away.
                        </p>

                        <object data="https://poppygo.io/themes/iframe.html" width="100%" height="2000px" scroll="no" type="text/html">...</object>

                    </div>
                );
            }}/>
        );
    }
}

export default Welcome;

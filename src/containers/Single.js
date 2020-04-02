//@flow

import React from 'react';
import service from './../services/service'
import { snackMessageService } from './../services/ui-service'
//import { Redirect } from 'react-router-dom'
import { SukohForm } from './../components/SukohForm';
import Spinner from './../components/Spinner';
//import { FormBreadcumb } from './../components/Breadcumb'

//import type { Configurations, SiteConfig, WorkspaceHeader, WorkspaceConfig, SingleConfig } from './../types';
import type { WorkspaceConfig, SingleConfig } from './../types';

type SingleProps = {
    siteKey : string,
    workspaceKey: string,
    singleKey: string
}

type SingleState = {
    selectedWorkspaceDetails : ?WorkspaceConfig,
    single : ?SingleConfig,
    singleValues: any
}


class Single extends React.Component<SingleProps,SingleState>{
    constructor(props : SingleProps){
        super(props);
        this.state = {
            selectedWorkspaceDetails: null,
            single: null,
            singleValues: null
        };
    }
    componentWillMount(){
        service.registerListener(this);
    }

    componentDidMount(){
        var stateUpdate  = {};
        var { siteKey, workspaceKey, singleKey } = this.props;

        Promise.all([
            service.api.getSingle(siteKey, workspaceKey, singleKey).then((single)=>{
                stateUpdate.singleValues = single;
            }),
            service.api.getWorkspaceDetails(siteKey, workspaceKey).then((workspaceDetails)=>{
                stateUpdate.selectedWorkspaceDetails = workspaceDetails;
            })
        ]).then(()=>{
            this.setState(stateUpdate);
        }).catch((e)=>{

        });

    }

    componentWillUnmount(){
        service.unregisterListener(this);
    }

    handleSave(context : any){
        var { siteKey, workspaceKey, singleKey } = this.props;

        let promise = service.api.updateSingle(siteKey, workspaceKey, singleKey, context.data);
        promise.then(function(updatedValues){
            snackMessageService.addSnackMessage("Document saved successfully.")
            context.accept(updatedValues);
        }, function(){
            context.reject('Something went wrong.');
        });
    }

    render(){
        if(this.state.singleValues===undefined || this.state.selectedWorkspaceDetails==null){
            return <Spinner />;
        }
        let single = this.state.selectedWorkspaceDetails.singles.find(x => x.key === this.props.singleKey);
        if(single==null) return null;


        var { siteKey, workspaceKey, singleKey } = this.props;

        return(<SukohForm
            debug={false}
            rootName={single.title}
            fields={single.fields}
            values={this.state.singleValues}
            onSave={this.handleSave.bind(this)}
            plugins={{
                openBundleFileDialog: function({title, extensions, targetPath}, onFilesReady){
                    return service.api.openFileDialogForCollectionItem(siteKey,workspaceKey,"",singleKey, targetPath, {title, extensions});
                },
                getBundleThumbnailSrc: function(targetPath){
                    return service.api.getThumbnailForCollectionItemImage(siteKey,workspaceKey,"",singleKey, targetPath);
                }
            }}
            />
        );
    }
}

export default Single;

//@flow

import React from 'react';
import {List, ListItem } from 'material-ui-02/List';
import Subheader from 'material-ui-02/Subheader';
import Border from './../components/Border';

import darkBaseTheme from 'material-ui-02/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui-02/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui-02/styles/getMuiTheme';

const Fragment = React.Fragment;
const translucentColor = 'RGBA(255,255,255,1)';

let MenuBorder = ({ children }) => {
  return <Border style={{margin: '0 16px', borderRadius:3, padding: '1px', borderColor:translucentColor}}>
    {children}
  </Border>;
}

let WhiteSubHeader = ({children}) => {
  return <Subheader style={{color: translucentColor, fontWeight:300,}}>{children}</Subheader>
};


export type SidebarMenu = {
    title: string,
    key?: string,
    widget?: any,
    items?: Array<{
        active: bool,
        label: string,
        onClick: ()=>void
    }>
}

export type SidebarProps = {
    menus: Array<SidebarMenu>,
    //    menuIsLocked: bool,
    onLockMenuClicked: ()=> void,
    //onToggleItemVisibility: ()=> void,
    hideItems : bool
}

type SidebarState = {

}

export class Sidebar extends React.Component<SidebarProps,SidebarState>{

    constructor(props : SidebarProps){
        super(props);
        this.state = {
            site: null,
            workspace: null
        };
    }

    render(){

        let { hideItems, menus } = this.props;
        let menusNodes = menus.map((menu,i)=>{
        return (
            <Fragment key={i+menu.key||i+menu.title}>
                <WhiteSubHeader>{ menu.title }</WhiteSubHeader>
                { menu.widget ? (menu.widget) : (null) }
                { menu.items ? (<MenuBorder>
                    <List style={{padding: 0}}>
                        { menu.items.map((item, index)=>{
                            return (
                                <ListItem
                                    key={index}
                                    innerDivStyle={{paddingTop:12,paddingBottom:12 }}
                                    onClick={item.onClick}
                                    primaryText={item.label}
                                    //leftIcon={<IconActionList color={translucentColor} />}
                                />
                            );
                        }) }
                    </List >
                </MenuBorder>) : (null) }
            </Fragment>
        );
    });

    return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <React.Fragment>
                <div className={'slideFadeInRight animated'}  style={{position:'relative', opacity: 1}}>

                    <div style={ Object.assign({},
                        { width:'280px', transition: 'all .2s' },
                        hideItems? { opacity:0, pointerEvents:'none' } : { opacity:1 }
                    )}>

                    { menusNodes }

                        <br />
                    </div>
                </div>
            </React.Fragment>
        </MuiThemeProvider>
    );
  }
}

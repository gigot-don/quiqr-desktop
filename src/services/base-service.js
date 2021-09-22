class BaseService{

    constructor(){
        this._listeners = [];
    }

    _notifyChanges(){
        if(this._notifyChangesTimeout){
            clearTimeout(this._notifyChangesTimeout)
        }
        setTimeout(function(){
            //console.log('Model state has changed...', this);
            for(let i = 0; i < this._listeners.length; i++){
                this._listeners[i].forceUpdate();
            }
        }.bind(this), 10); //throttle
    }

    registerListener(component /* : component */){
        //console.log('registering listener');
        this._listeners.push(component);
    }

    unregisterListener(component /* : component */){
        //console.log('unregistering listener');
        let index = this._listeners.indexOf(component);
        if(index>=0)
            this._listeners.splice(index, 1);
    }
}

export { BaseService };

import React, {Component} from 'react';
import * as firebase from 'firebase';

/**********************************
* PestSelect
* Creates a dropdown which displays multiple lists from which can be selected from
***********************************/

export default class PestSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
            arthropodList: [], //List to match from
            diseaseList: [],
            weedList: [],
        }
    }
    
    componentWillReceiveProps(props) { //Get's the rootlists
        var refr;
        refr = "crops/" + props.crop.toLowerCase() + "/"
        firebase.database().ref(refr + "arthropod").once('value', snapshot => {
            if (!snapshot.exists()) return;
            var keys = Object.values(snapshot.val()).map(item => item.name)
            this.setState({arthropodList: keys})
        })
        firebase.database().ref(refr + "disease").once('value', snapshot => {
            if (!snapshot.exists()) return;
            var keys = Object.values(snapshot.val()).map(item => item.name)
            this.setState({diseaseList: keys})
        })
        firebase.database().ref(refr + "weed").once('value', snapshot => {
            if (!snapshot.exists()) return;
            var keys = Object.values(snapshot.val()).map(item => item.name)
            this.setState({weedList: keys})
        })
    }
    
    render() {
        var groups = {};
        if(this.state.arthropodList.length > 0) {
            groups['Arthropods'] = this.state.arthropodList.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ));
        }
        if (this.state.diseaseList.length > 0){
            groups['Disease'] = this.state.diseaseList.map((item, index) => (
                <option key={index} value={item}>{item}</option>
            ));
        }
        if (this.state.weedList.length > 0){
            groups['Weed'] = this.state.weedList.map((item, index) => (
                <option key={index} value={item}>{item}</option>
            ));
        }
        var options = [];
        for(var name in groups) {
            options.push(
                <optgroup label={name}>{groups[name]}</optgroup>
            );
        }
        return ( //Render the sugglist
            <select value={this.state.value} onChange={this.update}>
              {options}
            </select>
        );
    }
}
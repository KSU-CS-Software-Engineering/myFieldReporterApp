import React, {Component} from 'react';
import * as firebase from 'firebase';

/**********************************
* PestSelect
* Creates a dropdown with at most 3 subcategories: arthropod, disease, and weed.
* An Unknown option can be selected as well.
* THE PESTS SHOWN ARE SPECIFIC TO THE CROP.
***********************************/

export default class PestSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
            arthropodList: [], //List to match from
            diseaseList: [],
            weedList: [],
            value: props.value
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
        this.setState({value: props.value});
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
            options.push(<option>Unknown</option>);
        for(var name in groups) {
            options.push(
                <optgroup label={name}>{groups[name]}</optgroup>
            );
        }
        return ( //Render the sugglist
            <select value={this.state.value} onChange={(event)=>this.props.onChange(event.target.value)}>
              <option disabled value=''>Select a Pest</option>
              {options}
            </select>
        );
    }
}

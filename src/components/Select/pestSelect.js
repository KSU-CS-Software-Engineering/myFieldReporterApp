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
        }
    }

    componentWillReceiveProps(props) { //Get's the rootlists
/*
      var db = firebase.firestore();
        db.collection("crops").doc(props.crop).collection("arthropod").get().then(function(querySnapshot) {
            var data=[];
            querySnapshot.forEach(function(doc) {
                //console.log(doc.data().name);
                data.push(doc.data().name);
            });
            this.setState({arthropodList: data})
        }.bind(this));
        db.collection("crops").doc(props.crop).collection("disease").get().then(function(querySnapshot) {
            var data =[];
            querySnapshot.forEach(function(doc) {
                data.push(doc.data().name);
            });
            this.setState({diseaseList: data})
        }.bind(this));
        db.collection("crops").doc(props.crop).collection("weed").get().then(function(querySnapshot) {
            var data = [];
            querySnapshot.forEach(function(doc) {
                data.push(doc.data().name);
            });
            this.setState({weedList: data})
        }.bind(this));

        /*
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
        */
    }

    render() {
      console.log(this.props.crop)
      //return <div></div>;
        var groups = {};
        if(this.props.crops[this.props.crop.toLowerCase()]["arthropod"])
        if(Object.keys(this.props.crops[this.props.crop.toLowerCase()]["arthropod"]).length > 0) {
            groups['Arthropods'] = Object.values(this.props.crops[this.props.crop.toLowerCase()]["arthropod"]).map((item, index) => (
              <option key={index} value={JSON.stringify(item.name).split('"').join('')}>{JSON.stringify(item.name).split('"').join('')}</option>
            ));
        }
        if(this.props.crops[this.props.crop.toLowerCase()]["disease"])
        if (Object.keys(this.props.crops[this.props.crop.toLowerCase()]["disease"]).length.length> 0){
            groups['Disease'] = Object.values(this.props.crops[this.props.crop.toLowerCase()]["disease"]).map((item, index) => (
              <option key={index} value={JSON.stringify(item.name).split('"').join('')}>{JSON.stringify(item.name).split('"').join('')}</option>
            ));
        }
        if(this.props.crops[this.props.crop.toLowerCase()]["weed"])
        if (Object.keys(this.props.crops[this.props.crop.toLowerCase()]["weed"]).length > 0){
            groups['Weed'] = Object.values(this.props.crops[this.props.crop.toLowerCase()]["weed"]).map((item, index) => (
              <option key={index} value={JSON.stringify(item.name).split('"').join('')}>{JSON.stringify(item.name).split('"').join('')}</option>
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

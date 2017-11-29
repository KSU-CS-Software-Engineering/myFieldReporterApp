import React, {Component} from 'react';
import * as firebase from 'firebase';

/************************************
* SearchableList
* Creates a drop down list that a user can type into and get a list of possible suggestions.
* DO NOT USE WITH LARGE DATALISTS; This class checks the root list everytime it's called so it will not get faster as it gets more specific
* 
* Code side: Takes in a reference to a Firebase Database List.
*           Example: In the case of crops, called in reports.js. The SearchableList calls listref="crops/" to get the crops list
*   It takes a placeholder since it acts as an input box
*   It takes the value which is to be modified in the class calling it
*           Example: In reports.js, the value={this.state.crops} modifies reports.js's crop value. Suprising
*   It takes an onChange handler.
*
* Funtions: Enter Key will autoselect the top suggestions.
*   Clicking on a suggestions will switch to that.
* 
* Function to implements: Click out of the suggestion list and make it dissapear
*   Error handling for invalid input. Reminder this is intended to aid in narrowing a list, not to allow any input
*
*************************************/

export default class SearchableList extends Component {
    constructor(props){
        super(props);
        this.state = {
            rootList: [], //List to match from
            suggList: [], //List of suggestions. Duh
            err: '',
        }
        this.update = this.update.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.checkValid = this.checkValid.bind(this);
    }
    
    componentWillMount(){   //Gets the rootlist
        firebase.database().ref(this.props.listRef).once('value', snapshot => {
            var keys = Object.values(snapshot.val()).map(item => item.name)
            this.setState({rootList: keys})
        })
    }
    
    handleClick(term){ //Handle click and clear suggestions (we found what we need)
        this.props.onChange(term);
        this.setState({suggList: []});
    }
    
    checkValid(event){
        var searchFrom = this.state.rootList;
        var value = event.target.value;
        var l = searchFrom.length;
        for (var i = 0; i < l ; i++){
            if (searchFrom[i].toLowerCase() == value.toLowerCase()){ 
                this.setState({err: ''});
                return;
            }
        this.setState({err: "Invalid Option"});
        }
    }
    
    handleKeyPress(target){ //Handle enter key. Autoselect top suggestion and clear list (we found what we need)
        if (target.charCode == 13){
            var value = this.state.suggList[0];
            this.props.onChange(value);
            //this.checkValid();
            this.setState({suggList: []});
        }
    }
    
    update(event){  //Find the suggestions for the current value
        var value = event.target.value;
        this.props.onChange(value);
        var searchFrom = this.state.rootList;
        var matches = [];
        var l = searchFrom.length;
        for (var i = 0; i < l; i++){
            if (searchFrom[i].toLowerCase().includes(value.toLowerCase())){
                matches.push(searchFrom[i]);
            }
        }
        this.setState({suggList: matches});
        this.props.onChange(value);
    }
    
    render() {
        var suggList = this.state.suggList.map((item) => { //Create a list from the state array. Same names, sorry
            return <div key={item.name} className="search-item" onClick={()=>this.handleClick(item)}>{item}</div>
        })
        return ( //Render the sugglist
            <div>
            <input placeholder={this.props.placeholder} name="term" value={this.props.value} onChange={this.update} onKeyPress={this.handleKeyPress} onClick={this.update} required/>
                <div className="search-list">{suggList}</div>
                <div className="err">{this.state.err}</div>
            </div>
        );
    }
}
import React, {Component} from 'react';
import './reports.css';
import * as firebase from 'firebase';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';



export default class reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field: '',
            crop: '',
            location: '',
            view: 'current',
            crops: [],
            suggestions: []
        }
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //this.handleClick = this.handClick.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.updateSuggestions = this.updateSuggestions.bind(this);
        this.getReports();
        
    }
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        if(event.target.name == 'crop') this.updateSuggestions();
    }
    
    /*handleClick(event){
        if(event.currentTarget.name == 'suggestions') this.setState({crop: event.target.value});
    }*/
    
    handleCreate(){
        var fid = firebase.database().ref('reports/').push().key;
        var uid = firebase.auth().currentUser.uid;
        var updates = {}
        updates['reports/' + fid] = {
            field: this.state.field,
            crop: this.state.crop,
            location: this.state.location,
            owner: uid
          }
        updates['users/' + uid + /reports/ + fid] = true;
        firebase.database().ref().update(updates).catch(err => console.error(err));
            this.toggleView();
        
        
    }
    
    componentWillMount(){
        firebase.database().ref('crops').once('value', (snapshot) => {
           this.setState({crops: snapshot.val()}); 
        });
    }
    
    getReports(){
        
        console.log('Here');
        
        
    
        var info = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/reports/').key;
        console.log(info);
        
    }
        
    toggleView(){
        this.setState({view:(this.state.view== 'newReport')?'current':'newReport'})
    }
    
    updateSuggestions(){
        /*
        var term = this.state.term
        find matches
        return matches
        */
        /* var term = this.state.crop;
        this.setState({suggestions: []});
        var ind = 0;
        var croparrayLenth = this.state.crops.length;
        for (var i = 0; i < croparrayLenth; i++){
            if (this.state.crops[i].indexof(term) !== -1) suggestions[ind++] = this.state.crops[i]; 
        }
        
        this.setState({suggestions: ['red','blue','green']});
        */
        
        var term = this.state.crop;
        var matches = [];
        var toMatch = this.state.crops;
        var croparrayLenth = this.state.crops.length;
        for (var i = 0; i < croparrayLenth; i++){
            if (toMatch[i].indexof(term) !== -1) matches.concat(toMatch[i]); 
        }
        
        this.setState({suggestions: matches});
    }
    
    render() {
            /*var list = this.state.crops.map((crop) => {  //List of crops
                return <li key={crop.name}>{crop.name}</li>
            });*/
            var suggestions = this.state.suggestions.map((sug, i) => {
                return <div key={i} onClick={this.handleClick}>{sug}</div>
            })
            if(this.state.view == 'current'){
                return (
                    <div className="container">
            
                        <button onClick={this.toggleView}>Create Report</button>
                       
                        <h1>Your Reports</h1>
                        
                    <Link to="/">Dashboard</Link>
                    </div>
                );
            }
            else
                {
                    return(
                        <div className="container">
                            <h1>New Report</h1>
                            <input placeholder="Name of Field" name="field" value={this.state.field} onChange={this.handleChange} required />
                            <br/>
                        <div className="searchCrop">
                            <input placeholder="crop" name="crop" value={this.state.crop} onChange={this.handleChange}/>
                            <div>
                                {suggestions}
                            </div>
                        </div>
                            <input placeholder="Location" name="location" value={this.state.location} onChange={this.handleChange} required />
                            <br/>
                            
                            <button onClick={this.handleCreate}>Submit</button>
                            
                            <br/>
                            <br/>
                            {this.state.message}

                    <Link to="/">Dashboard</Link>
                        </div>

                    )
                }
    }
    
}
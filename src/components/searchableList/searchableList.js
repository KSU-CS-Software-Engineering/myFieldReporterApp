import React, {Component} from 'react';
import * as firebase from 'firebase';

export default class SearchableList extends Component {
    constructor(props){
        super(props);
        this.state = {
            term: '',
            rootList: [],
            suggList: []
        }
        this.update = this.update.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    componentWillMount(){
        firebase.database().ref(this.props.listRef).once('value', snapshot => {
            var keys = Object.keys(snapshot.val())
            this.setState({rootList: keys})
        })
    }
    
    handleClick(term){
        return;
        this.props.handleChange(this.state.term);
    }
    
    update(){
        var toSearch = this.state.term;
        var searchFrom = this.state.rootList;
        var matches = [];
        var l = searchFrom.length;
        console.log('BEFORE', toSearch, matches)
        for (var i = 0; i < l; i++){
            if (searchFrom[i].includes(toSearch)){
                matches.push(searchFrom[i]);
            }
        }
        console.log('AFTER', matches)
        this.setState({suggList: matches});
        
    }
    render() {
        var suggList = this.state.suggList.map((item) => {
            return <div onClick={()=>this.handleClick(item)}>{item}</div>
        })
        return (
            <div>
            <input placeholder={this.props.placeholder} name="term" value={this.term} onChange={this.update} required/>
                <div>{suggList}</div>
            </div>
        );
    }
}
import React, {Component} from 'react';
import * as firebase from 'firebase';

export default class SearchableList extends Component {
    constructor(props){
        super(props);
        this.state = {
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
    
    componentWillReceiveProps(props) {
        //this.setState({term: props.value});
    }
    
    handleClick(term){
        console.log("ERM", term, this.state.suggList)
        this.props.onChange(term);
        this.setState({suggList: []});
    }
    
    update(event){
        var value = event.target.value;
        this.props.onChange(value);
        var searchFrom = this.state.rootList;
        var matches = [];
        var l = searchFrom.length;
        for (var i = 0; i < l; i++){
            if (searchFrom[i].includes(value)){
                matches.push(searchFrom[i]);
            }
        }
        this.setState({suggList: matches});
        this.props.onChange(value);
    }
    render() {
        var suggList = this.state.suggList.map((item) => {
            console.log("item", item);
            return <div className="search-item" onClick={()=>this.handleClick(item)}>{item}</div>
        })
        return (
            <div>
            <input placeholder={this.props.placeholder} name="term" value={this.props.value} onChange={this.update} required/>
                <div className="search-list">{suggList}</div>
            </div>
        );
    }
}
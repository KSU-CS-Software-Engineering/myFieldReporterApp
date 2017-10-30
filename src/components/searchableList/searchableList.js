import React, {Component} from 'react';
import * as firebase from 'firebase';

export default class SearchableList extends Component {
    constructor(props){
        super(props);
        this.state = {
            rootList: [],
            suggList: [],
        }
        this.update = this.update.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    
    componentWillMount(){
        firebase.database().ref(this.props.listRef).once('value', snapshot => {
            var keys = Object.values(snapshot.val()).map(item => item.name)
            this.setState({rootList: keys})
        })
    }
    
    componentWillReceiveProps(props) {
        //this.setState({term: props.value});
    }
    
    handleClick(term){
        this.props.onChange(term);
        this.setState({suggList: []});
    }
    
    handleKeyPress(target){
        if (target.charCode == 13){
            var value = this.state.suggList[0];
            this.props.onChange(value);
            this.setState({suggList: []});
        }
    }
    
    update(event){
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
        var suggList = this.state.suggList.map((item) => {
            console.log("item", item);
            return <div key={item.name} className="search-item" onClick={()=>this.handleClick(item)}>{item}</div>
        })
        return (
            <div>
            <input placeholder={this.props.placeholder} name="term" value={this.props.value} onChange={this.update} onKeyPress={this.handleKeyPress} required/>
                <div className="search-list">{suggList}</div>
            </div>
        );
    }
}
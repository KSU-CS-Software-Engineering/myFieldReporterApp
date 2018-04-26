import React, {Component} from 'react';
import * as firebase from 'firebase';

/**********************************
* CropSelect
* Creates a dropdown which displays multiple lists from which can be selected from
***********************************/

export default class CropSelect extends Component{


    render() {
        var options = Object.keys(this.props.crops).map(item => {
            return <option key={item} value={item.charAt(0).toUpperCase()+item.slice(1)}>{item.charAt(0).toUpperCase()+item.slice(1)}</option>
        });
        return ( //Render the sugglist
            <select value={this.props.value} onChange={(event)=>this.props.onChange(event.target.value)} required>
                <option disabled value=''>Select a Crop</option>{options}
            </select>
        );
    }
}

import React, {Component} from 'react';
import * as firebase from 'firebase';

/**********************************
* GrowthStageSelect
* Creates a dropdown which displays multiple lists from which can be selected from
***********************************/

export default class GrowthStageSelect extends Component{

    render() {
        var options = this.props.crops[this.props.crop.toLowerCase()]["growthStages"].map(item => {
            return <option key={item.name} value={item.name}>{item.name}</option>
        });

        return ( //Render the sugglist
            <select value={this.props.value} onChange={(event)=>this.props.onChange(event.target.value)}>
                <option disabled value=''>Select the Growth Stage</option>
                {options}
            </select>
        );
    }
}

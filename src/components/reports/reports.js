import React, {Component} from 'react';
import './reports.css';
import * as firebase from 'firebase';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import Webcam from 'react-webcam';


export default class reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crop: '',
            gs: '',
            location: '',
            images: [],
            pest: '',
            notes: '',
            view: 'current',
            list: []
        }
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.capture = this.capture.bind(this);
        this.setRef = this.setRef.bind(this);
        this.getReports();
        
    }
    
    setRef(webcam){ 
        this.webcam = webcam;
    }
    
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleCreate(){
        var fid = firebase.database().ref('reports/').push().key;
        var uid = firebase.auth().currentUser.uid;
        
        var updates = {}
        updates['reports/' + fid] = {
            crop: this.state.crop,
            location: this.state.location,
            owner: uid
          }
        updates['users/' + uid + '/reports/' + fid] = true;
        firebase.database().ref().update(updates).then(() => {
            this.state.images.forEach( (imageURL, index) => {
            var blob = dataURItoBlob(imageURL);
                firebase.storage().ref().child('images').child(fid).child(index.toString()).put(blob).then(snapshot => {
                    console.log(snapshot)
                    firebase.database().ref('reports/' + fid + '/images').push(snapshot.downloadURL)
                })
            });
            
        }).catch(err => console.error(err));
        
        this.toggleView();
        
        this.setState({
            crop: '',
            gs: '',
            location: '',
            images: [],
            pest: '',
            notes: '',
            view: 'current',
            list: []
        })
        
        
    }
    
    
    componentWillMount(){
        firebase.database().ref('crops').once('value', (snapshot) => {
           this.setState({crops: snapshot.val()}); 
        });
    }
    
    getReports(){
    
        var info = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/reports/').key;
        
        
    }
        
    toggleView(){
        this.setState({view:(this.state.view== 'newReport')?'current':'newReport'})
    }
    
    capture(){
        const imageSrc = this.webcam.getScreenshot();
        var images = this.state.images;
        if(images.length === 2) images.shift();
        images.push(imageSrc);
        this.setState({images:images})
        
    }

    render() {
           
            
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
                    firebase.database().ref('crops/').on('value', snap =>  {
                           var data = [];
                           snap.forEach(ss => {
                              data.push(ss.child('name').val());
                           });
                            this.state.list = data;
                           console.log(this.state.list);
                           console.log(this.state.list.pop());
                        })
                    var imageTags = this.state.images.map((imageURL, index) => {
                        return <img key={index} src={imageURL}/>
                    })
                    return(
                         
                        <div className="container">
                            <h1>New Report</h1>
                            <select>
                                <option value={this.state.list.pop()}>{this.state.list.pop()}</option>
                            </select>
                            <input placeholder="Crop Dropdown" name="crop" value={this.state.crop} onChange={this.handleChange} required />
                            <br/>
                            <input placeholder="Growth Stage of Crop" name="gs" value={this.state.gs} onChange={this.handleChange} required />
                            <br/>
                            <input placeholder="Location" name="location" value={this.state.location} onChange={this.handleChange} required />
                            <br/>
                            <input placeholder="Pest" name="pest" value={this.state.pest} onChange={this.handleChange} required />
                            <br/>
                            
                            {imageTags}
                            
                             <Webcam audio={false} height={350} ref={this.setRef} screenshotFormat="image/jpeg" width={350} />
                            <button placeholder="Picture" name="picture" value={this.state.picture} onClick={this.capture} required/>
                            <br/>
                            <input placeholder="Notes" name="notes" value={this.state.notes} onChange={this.handleChange}/>
                            
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

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}
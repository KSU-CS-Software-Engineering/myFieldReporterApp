import React, {Component} from 'react';
import './reports.css';
import * as firebase from 'firebase';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import Webcam from '../webcam/webcam';


export default class Reports extends Component {
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
            list: [],
            reports: []
        }
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.readFile = this.readFile.bind(this);
        this.getReports();
        
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
            gs: this.state.gs,
            pest: this.state.pest,
            notes: this.state.notes,
            time: Date().toString(),
            owner: uid
          }
        updates['users/' + uid + '/reports/' + fid] = true;
        firebase.database().ref().update(updates).then(() => {
            console.log(this.state.images[0])
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
    
    readFile(event) {
        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onloadend = () => {
            this.state.images[this.state.images.length] = file;
        }

        reader.onerror = function () {
            alert('There was an error reading the file!');
        }

        reader.readAsDataURL(file);
    }

    render() {
           
        if (window.File && window.FileReader && window.FormData) {
                    var $inputField = this.state.file;

                } else {
                    alert("File upload is not supported!");
                    
                }
        
        
            if(this.state.view == 'current'){
                 firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/reports/').on('value', snap =>  {
                           var data = [];
                           snap.forEach(ss => {
                              data.push(ss.child('name').val());
                           });
                            this.state.reports = data;
                           console.log(this.state.reports);
                           console.log(this.state.reports.pop());
                        })
                
                return (
                    <div className="container">
            
                        <button onClick={this.toggleView}>Create Report</button>
                       
                        <h1>Your Reports</h1>
                        
                        <br/><br/>
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
                         
                        <div className="reports-container">
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
                            
                            <input id="file" type="file" accept="image/*" onChange={this.readFile}></input>
                            
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
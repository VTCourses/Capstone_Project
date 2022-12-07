import { Amplify, Storage } from 'aws-amplify';
import { useState } from "react";
// import {Component} from "react";
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

function Upload() {
    const [fileData, setFileData] = useState();
    const [fileStatus, setFileStatus] = useState(false);

    const uploadFile = async () => {
        const result = await Storage.put(fileData.name, fileData, {
            contentType: fileData.type,
        });
        setFileStatus(true);
        console.log(21, result);
    }

    return (
        <div className="Upload">
            <div>
                <input type="file" onChange={(e) => setFileData(e.target.files[0]) } />
            </div>
            <div>
                <button className='Upload-Button' onClick ={uploadFile}>Upload File</button>
            </div>
            {fileStatus ? 'File uploaded successfully' : ""}
        </div>
    );
}

export default Upload;

// class Upload extends Component{
//     state = {
//         selectedFile: null,
//         fileUploadedSuccessfully: false
//     }

//     onFileChange = event => {
//         this.setState({selectedFile: event.target.files[0]});
//     }

//     onFileUpload = () => {
//         const formData = new FormData();
//         formData.append("demo file", this.state.selectedFile, this.state.selectedFile.name)

//         //call api
//         console.log(formData);
//         this.setState({selectedFile: null});
//         this.setState({fileUploadedSuccessfully: true});
//     }

//     fileData = () => {
//         if (this.state.selectedFile) {
//         return (
//             <div>
//                 <h2>File Details:</h2>
//                 <p>File Name: {this.state.selectedFile.name}</p>
//                 <p>File Type: {this.state.selectedFile.type}</p>
//                 <p>Last Modified: {" "}
//                     {this.state.selectedFile.lastModifiedDate.toDateString()}
//                 </p>
//             </div>
//             );
//         }else if(this.state.fileUploadedSuccessfully){
//             return(
//                 <div>
//                     <br />
//                     <h4>File successfully uploaded</h4>
//                 </div>
//             )
//         }else{
//             return(
//                 <div>
//                     <br />
//                     <h4>Choose a file to upload</h4>
//                 </div>
//             )
//         }
//     }

//     render(){
//         return (
//             <div>
//                 <h2>Upload System</h2>
//                 <div>
//                     <input type = "file" onChange={this.onFileChange} />
//                     <button onClick={this.onFileUpload}> Upload </button>
//                 </div>
//                 {this.fileData()}
//             </div>
//         )
//     }
// }

// export default Upload;
import { Amplify, Storage } from 'aws-amplify';
import { useState } from "react";
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
                <input type="file" onChange={(e) => setFileData(e.target.files[0]) } />;
            </div>
            <div>
                <button onClick ={uploadFile}>Upload File</button>
            </div>
            {fileStatus ? 'File uploaded successfully' : ""}
        </div>
    );
}

export default Upload;
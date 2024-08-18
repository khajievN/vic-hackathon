const config = require("../env/config")
const pinataSDK = require('@pinata/sdk');
const {create} = require("ipfs-http-client");
const fs = require("fs");


async function ipfsClient() {
    const projectId = config.IPFS_PROJECT_ID
    const projectSecret = config.IPFS_PROJECT_SECRET
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    return create(
        {
            host: config.IPFS_IP,
            port: 5002,
            protocol: "http",
            headers: {
                authorization: auth
            }
        }
    );
}

// upload to ipfs
async function uploadToIPFSProject(file, name, grantAmount, description) {
    const IPFS_URL = 'https://dexpo.oceandrive.network/ipfs/';
    const ipfs = await ipfsClient();
    //save file
    const fileResponse = await manageFile(file);
    //Options not to make directory while uploading
    let options = {
        wrapWithDirectory: false,
        progress: (prog) => {
            console.log(`received: ${prog}`)
        }
    }
    // upload to ipfs
    let fileUrl = await ipfs.add(fileResponse.file_body, options);
    // metadata json
    const metadata = {
        "name": name,
        "description": description,
        "file": IPFS_URL+fileUrl.path,
        "grantAmount" : grantAmount
    }
    // upload to ipfs
    const metadataUrl = await ipfs.add(JSON.stringify(metadata));
    // remove file
    await removeFile(fileResponse.file_name);

    return IPFS_URL + metadataUrl.path;
}

async function uploadToIPFSProposal(file, name, description) {
    const IPFS_URL = 'https://dexpo.oceandrive.network/ipfs/';
    const ipfs = await ipfsClient();
    //save file
    const fileResponse = await manageFile(file);
    //Options not to make directory while uploading
    let options = {
        wrapWithDirectory: false,
        progress: (prog) => {
            console.log(`received: ${prog}`)
        }
    }
    // upload to ipfs
    let fileUrl = await ipfs.add(fileResponse.file_body, options);
    // metadata json
    const metadata = {
        "name": name,
        "description": description,
        "file": IPFS_URL+fileUrl.path,
    }
    // upload to ipfs
    const metadataUrl = await ipfs.add(JSON.stringify(metadata));
    // remove file
    await removeFile(fileResponse.file_name);

    return IPFS_URL + metadataUrl.path;
}
async function removeFile(file) {
    try {
        //file removed
        fs.unlinkSync(`${__dirname}/uploads/${file}`)
    } catch (err) {
        console.error(err)
    }
}


async function manageFile(file) {
    const file_name = file.name
    const unique_file_name = new Date().getTime() + "_" + file_name;

    const dir = `${__dirname}/uploads/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    // move to folder
    await file.mv(`${__dirname}/uploads/${unique_file_name}`);
    // get file stream
    return {
        file_body: fs.createReadStream(`${__dirname}/uploads/${unique_file_name}`),
        file_name: unique_file_name
    };
}

module.exports = {
    uploadToIPFSProject,
    uploadToIPFSProposal
}

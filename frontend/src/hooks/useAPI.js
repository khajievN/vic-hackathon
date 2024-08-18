import axiosInstance from "../helpers/api/axiosInstance";

function getPath(payload, url) {
    let iterations = Object.entries(payload).length;
    var pathArr = "?";
    if (url) {
        url.includes("?") ? pathArr = '&' : pathArr = '?'
    }

    for (let key in payload) {
        if (!--iterations) {
            pathArr += key + "=" + payload[key];
        } else {
            pathArr += key + "=" + payload[key] + "&";
        }
    }
    return pathArr;
}


export const getProjectListApi = (data) => {
    return axiosInstance.get(`/api/project/list`, {params: data})
}

export const createProjectMetadataApi = (data) => {
    return axiosInstance.post('/api/project/create', data, {
        headers: {"Content-Type": "multipart/form-data"},
    })
}

export const createProposalMetadataApi = (data) => {
    return axiosInstance.post('/api/proposal/create', data, {
        headers: {"Content-Type": "multipart/form-data"},
    })
}


export const getProjectDetailApi = (data) => {
    return axiosInstance.get(`/api/project/detail`, {params: data})
}

export const getProposalListApi = (data) => {
    return axiosInstance.get(`/api/proposal/list`, {params: data})
}

import React from 'react'
import Main from "../pages/main/Main";
import Detail from "../pages/detail/Detail";
import CreateProject from "../pages/create/CreateProject";
import CreateProposal from "../pages/create/CreateProposal";

const publicRoutes = [
    {path: "/", component: <Main/>},
    {path: "/details/:project_id", component: <Detail/>},
    {path: "/createProject", component: <CreateProject/>},
    {path: "/createProposal/:project_id", component: <CreateProposal/>},
]

export {publicRoutes}

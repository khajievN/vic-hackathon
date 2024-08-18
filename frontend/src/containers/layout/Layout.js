import React from 'react'
import Header from "../header/Header";

function Layout({children}) {
    return (
        <div className="layout-container">
            <Header/>
             {children}
        </div>
    );
}

export default Layout

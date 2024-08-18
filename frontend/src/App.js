import React from "react";
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import Index from "./routes";

function App() {
    const loader = useSelector(state => state.loader);

    return (
        <>
            <BrowserRouter> {/* Wrap Index with BrowserRouter */}
                <Index />
            </BrowserRouter>
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                theme="colored"
            />
        </>
    );
}

export default App;

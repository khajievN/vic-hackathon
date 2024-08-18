import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import App from './App';
import { store } from './store'
import { saveState } from './store/localStorage'
import { throttle } from 'lodash';

store.subscribe(throttle(() => {
    saveState(store.getState())
}, 1000));


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

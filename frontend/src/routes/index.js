import React from 'react'
import {Route, Routes} from 'react-router-dom';
import {publicRoutes} from './routes'
import Layout from '../containers/layout/Layout';

const Index = () => {
	document.addEventListener('contextmenu', event => event.preventDefault());
	return (
		<Layout>
			<Routes>
				{publicRoutes.map((route, key) => (
					<Route key={key} path={route.path} element={route.component} />
				))}
			</Routes>
		</Layout>
	);
};


export default Index;

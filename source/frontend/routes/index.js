import React from 'react';
import { Route, IndexRoute } from 'react-router';

import CoreLayout from 'layouts/CoreLayout';
import HomeView from 'views/HomeView';

export default (store) => (
    <Route path='/index.html' component={CoreLayout}>
        <IndexRoute component={HomeView} />
    </Route>
);

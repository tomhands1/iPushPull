import React, { useState } from 'react';

import PageSelector from './page-selector/PageSelector';
import Login from './login/Login';

const ApplicationToolBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (isLoggedIn ?
        <PageSelector />
        :
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
    );
};

export default ApplicationToolBar;

import React, { useState, useCallback } from 'react';
import ipushpull from "ipushpull-js";

import ABInput from '@adaptabletools/adaptableblotter-react-aggrid/adaptableblotter/App_Scripts/components/Input';
import Button from '@adaptabletools/adaptableblotter-react-aggrid/adaptableblotter/App_Scripts/components/SimpleButton';
import Check from '@adaptabletools/adaptableblotter-react-aggrid/adaptableblotter/App_Scripts/components/icons/check';

import './Login.css';

const ABButton = (Button as any);

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
    const attemptLogin = useCallback((username: string, password: string) => ipushpull.auth.login(username, password)
        .then(() => {
            onLoginSuccess();           
        }), [onLoginSuccess]);

    const [username, setUsername] = useState(process.env.IPUSHPULL_USERNAME || '');
    const [password, setPassword] = useState(process.env.IPUSHPULL_PASSWORD || '');

    const login = useCallback(() => {
        attemptLogin(username, password)
    }, [username, password]);

    const isEnter = (key: string) => {
        if (key === "Enter") {
            login();
        }
    };

    return (
        <div className="loginWrapper">
            <ABInput
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                value={username}
                placeholder="Username"
            />
            <ABInput
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => isEnter(e.key)}
                value={password}
                placeholder="Password"
            />
            <ABButton onClick={login}><Check /></ABButton>
        </div>
    );
};

export default Login;

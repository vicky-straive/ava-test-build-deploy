'use client';

import { useRouter } from 'next/navigation';
import React, { useContext, useState, useRef, useEffect } from 'react';

import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Divider } from 'primereact/divider';

import URLLinks from '../../../../app/api/links';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const [token, setToken] = useState(sessionStorage.getItem('token') || '');

    console.log('token', token);

    const toast = useRef<Toast>(null);
    const { SER_BASE_CONNECTION, MS_SER_CONNECTION, SER_BASE_LOGIN_CONNECTION } = URLLinks;
    const url = window.location.href.split("?")[1];
    const urlParams = new URLSearchParams(url);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const getToken = () => {
        window.location.href = `${MS_SER_CONNECTION}/login/with-o365`;
    };

    const handleSignIn = async () => {
        try {
            const response = await fetch(`${SER_BASE_CONNECTION}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            if (response.status == 200) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Welcome!',
                    detail: 'Login Success ',
                    life: 3000
                });
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Something went wrong',
                    detail: response?.statusText ? response?.statusText : 'An unknown error occurred',
                    life: 3000
                });
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Something went wrong',
                detail: error instanceof Error ? error.message : 'An unknown error occurred',
                life: 3000
            });
        }
    };

    const handlePostCall = async (token: any) => {
        try {
            const formData = new FormData();
            const url = window.location.href.split('?')[1];
            // setToken(url);

            const apiUrl = `${MS_SER_CONNECTION}/api/azure-level`;
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${token}`
                }
            });
            formData.append('accessToken', token);
            console.log('token', token);

            if (response.status === 200) {
                const name = response?.data?.name;
                const logToken = response;
                // setUserName(name);
                // showSuccess(name);
                // setIsLoginSuccessful(true);
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                console.log('Login failed. Please check your credentials.');
                
            }
        } catch (error) {
            console.log('Login failed. Please check your credentials.');
        } finally {
            // setIsLoading(false);
        }
    };

    useEffect(() => {
        const newArr = [];
        for (const [key] of urlParams as any) {
            newArr.push(atob(key));
        }
        if (newArr[0] != null) {
            localStorage.setItem('token', newArr[0]);
            setToken(newArr[0]);
            handlePostCall(newArr[0]);
        }
    }, []);

    return (
        <div className={containerClassName}>
            <Toast ref={toast}></Toast>
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-5">AVA</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email1" type="text" placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="password1" feedback={false} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a>
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={handleSignIn}></Button>
                            {/* <Divider className="mt-5 mb-5" /> */}
                            <Divider layout="horizontal" className="mt-5 mb-5 " align="center">
                                <b>OR</b>
                            </Divider>
                            <div className="flex justify-content-end w-12 ">
                                <Button type="button" onClick={getToken} label="Microsoft" icon="pi pi-microsoft" outlined text raised />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

'use client';

import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '../authConfig';
import { AuthProvider } from '../authcontext';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const msalInstance = new PublicClientApplication(msalConfig);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <MsalProvider instance={msalInstance}>
                    <PrimeReactProvider>
                        <LayoutProvider>
                            <AuthProvider>
                                {children}
                            </AuthProvider>
                        </LayoutProvider>
                    </PrimeReactProvider>
                </MsalProvider>
            </body>
        </html>
    );
}
/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Application',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
                {
                    label: 'New Project',
                    icon: 'pi pi-fw pi-bolt',
                    to: '/pages/new_project'
                },
                {
                    label: 'Projects',
                    icon: 'pi pi-fw pi-folder',
                    to: '/pages/project'
                },
                {
                    label: 'Uploads',
                    icon: 'pi pi-fw pi-cloud-upload',
                    to: '/pages/uploads'
                },
                {
                    label: 'Process Config',
                    icon: 'pi pi-fw pi-sitemap',
                    to: '/pages/process_config'
                },
            ]
        },
        {
            label: 'Utilities',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog',
                    items: [
                        {
                            label: 'Logout',
                            icon: 'pi pi-fw pi-sign-out',
                            to: '/auth/login'
                        },
                    ]
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;

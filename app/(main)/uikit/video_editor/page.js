"use client"

import React, { useEffect, useRef, useState } from 'react';
import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  license: 'wQpstN2Rx22zUioU33IPH8lzOr-QNQT819kyZRSm1uXyik-2sdWk8iMuxEEd3ZZi',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.30.0/assets',
  callbacks: {
    onUpload: 'local',
    onSave: (scene) => {
      const element = document.createElement('a');
      const base64Data = btoa(unescape(encodeURIComponent(scene)));
      element.setAttribute(
        'href',
        `data:application/octet-stream;base64,${base64Data}`
      );
      element.setAttribute(
        'download',
        `cesdk-${new Date().toISOString()}.scene`
      );

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    onLoad: 'upload',
    onDownload: 'download',
    onExport: 'download'
  },
  ui: {
    elements: {
      navigation: {
        action: {
          close: true,
          back: true,
          save: false,
          download: true,
          load: true,
          export: true
        }
      }
    }
  }
};

export default function CreativeEditorSDKComponent() {
  const cesdk_container = useRef(null);
  const [cesdk, setCesdk] = useState(null);

  useEffect(() => {
    if (!cesdk_container.current) return;

    let cleanedUp = false;
    let instance;
    CreativeEditorSDK.create(cesdk_container.current, config).then(
      async (_instance) => {
        instance = _instance;
        if (cleanedUp) {
          instance.dispose();
          return;
        }

        await Promise.all([
          instance.addDefaultAssetSources(),
          instance.addDemoAssetSources({ sceneMode: 'Video' }),
        ]);
        await instance.createVideoScene();

        setCesdk(instance);
      }
    );
    const cleanup = () => {
      cleanedUp = true;
      instance?.dispose();
      setCesdk(null);
    };
    return cleanup;
  }, [cesdk_container]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '88vh', minHeight: '70vh' }}>
      <div ref={cesdk_container} style={{ flexGrow: 1 }}></div>
    </div>
  );
}

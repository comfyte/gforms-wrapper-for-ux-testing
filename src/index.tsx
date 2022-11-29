import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
// import { register as registerServiceWorker } from './utils/sw-registration';

import './styles/global.css';

const root = createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);

// registerServiceWorker();

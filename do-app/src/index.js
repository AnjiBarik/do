import React from 'react';
import { createRoot } from 'react-dom/client'; 
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { BooksProvider } from './BooksContext';
import IconLoader from './components/iconLoader/IconLoader'; 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (event) => {
      console.error('Unhandled error:', event.error); 
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return <div>Something went wrong.</div>; // Placeholder for error UI
  }

  return children;
};

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <BooksProvider>
         <IconLoader>
          <App />
          </IconLoader>
        </BooksProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

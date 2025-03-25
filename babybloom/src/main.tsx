import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style.css'
import App from './App'

// Error boundary component to catch and display React errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("React error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div className="error-container">Something went wrong. Please reload the page.</div>;
    }

    return this.props.children;
  }
}

// Add console logging for debugging
console.log("Script running");
const rootElement = document.getElementById('root') as HTMLElement;
console.log("Root element:", rootElement);

if (!rootElement) {
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Error: Could not find root element!</div>';
} else {
  try {
    // Mount the application to the root element with error boundary
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <Suspense fallback={<div className="loading">Loading...</div>}>
              <div className="app-container">
                <App />
              </div>
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>,
    );
    console.log("Render called");
  } catch (error) {
    console.error("Error rendering React app:", error);
    rootElement.innerHTML = `<div style="color: red; padding: 20px;">
      Error rendering React app: ${error instanceof Error ? error.message : String(error)}
    </div>`;
  }
}

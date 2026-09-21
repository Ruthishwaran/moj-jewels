import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MOJ Jewels Error:", error, errorInfo);
  }

  handleReset = () => {
    // Clear ALL localStorage and reload fresh
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0b0f19',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Outfit, sans-serif'
        }}>
          <div style={{
            maxWidth: '420px',
            width: '100%',
            background: 'rgba(17,24,39,0.92)',
            border: '1px solid rgba(197,160,89,0.4)',
            borderRadius: '16px',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(197,160,89,0.15)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <span style={{ fontSize: '28px' }}>⚠️</span>
            </div>

            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>
              MOJ Jewels — Session Reset Needed
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '28px', lineHeight: '1.6' }}>
              Your browser has stale cached data from a previous version. Click the button below to clear it and load the full MOJ Jewels store.
            </p>

            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: 'linear-gradient(90deg, #c5a059 0%, #fff0c2 50%, #c5a059 100%)',
                color: '#0b0f19',
                border: 'none',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              ↻ Clear Cache & Load MOJ Jewels Store
            </button>

            <p style={{ color: '#475569', fontSize: '11px', marginTop: '16px' }}>
              This will reset the local session. Your device is safe.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

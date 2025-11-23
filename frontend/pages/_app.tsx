import '../styles/globals.css';
import '../styles/design-tokens.css';
import type { AppProps } from 'next/app';
import toast, { Toaster, ToastBar } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              background: 'white',
              color: '#1a1a1a',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
            }}
          >
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                      marginLeft: '12px',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '18px',
                      lineHeight: '1',
                      padding: '4px',
                    }}
                    aria-label="Dismiss notification"
                  >
                    ×
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}

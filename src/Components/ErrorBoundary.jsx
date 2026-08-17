import React from 'react';
import '../styles/theme.css';

// Daha önce hiçbir yerde error boundary yoktu: örn. ProfilePage'te user undefined iken
// user.userName okunması gibi bir render hatası tüm uygulamayı beyaz ekrana düşürüyordu.
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Uygulama render hatası:', error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="ax-auth-screen">
                    <div className="ax-auth-card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                        <div style={{ fontSize: 32, marginBottom: 'var(--space-3)' }}>⚠️</div>
                        <h2 style={{ fontSize: 'var(--text-xl)' }}>Bir şeyler ters gitti</h2>
                        <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                            Sayfa yüklenirken beklenmeyen bir hata oluştu.
                        </p>
                        <button className="ax-btn ax-btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={this.handleReload}>
                            Giriş sayfasına dön
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

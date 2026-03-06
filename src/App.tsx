import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/HomePage/HomePage.tsx';
import { ProductsPage } from './pages/ProductsPage/ProductsPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return children;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactElement }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (isAuthenticated) {
		return <Navigate to="/products" replace />;
	}

	return children;
};

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="app">
				<Toaster position="top-right" />
				<main className="app-main">
					<Routes>
						<Route
							path="/"
							element={
								<PublicOnlyRoute>
									<HomePage />
								</PublicOnlyRoute>
							}
						/>
						<Route
							path="/products"
							element={
								<ProtectedRoute>
									<ProductsPage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</main>
			</div>
		</QueryClientProvider>
	);
};

export { App };

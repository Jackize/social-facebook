import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import Layout from './layout';
import Home from './pages/home/Home';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                {
                    path: '/',
                    element: <Home />,
                },
            ],
        },
    ]);
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}

export default App;

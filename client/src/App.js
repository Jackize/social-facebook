import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import Theme from './components/Theme/Theme';
import Layout from './layout';
import Home from './pages/home/Home';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <Theme>
                    <Layout />
                </Theme>
            ),
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

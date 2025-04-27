import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router';

function MainLayout() {
    return (
        <div>
            <Header />
            <div className="p-5">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default MainLayout;
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router';

function MainLayout() {
    return (
        <div>
            <Header />
            <div className="">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default MainLayout;
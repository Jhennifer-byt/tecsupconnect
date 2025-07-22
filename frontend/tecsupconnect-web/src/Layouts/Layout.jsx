import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <div >
    <Navbar />
        <main className="pt-20">{children}</main>
    <Footer />
    </div>
  );
};

export default Layout;

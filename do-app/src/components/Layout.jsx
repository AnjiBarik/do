import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import LogoutHandler from "./utils/LogoutHandler";

const Layout = () => {
  return (
    <section>
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
      <LogoutHandler />
    </section>
  );
};

export { Layout };

import React from "react";
import { Route, Routes } from "react-router-dom";
import BookList from "./components/book-list/BookList";
import Cart from "./components/cart/Cart";
import SpecificBook from "./components/specific-book/SpecificBook";
import Page404 from "./components/Page404";
import { Layout } from "./components/Layout";
import OrderForm from "./components/cart/OrderForm";
import RegistrationForm from "./components/cart/RegistrationForm"
import LandingPage from "./components/landingPage/LandingPage";
import AdminPanel from "./components/admincomponent/AdminPanel";
import RedirectHandler from "./components/RedirectHandler";

function App() {  

return (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<LandingPage />} />
      <Route path="LandingPage/:id" element={<LandingPage />} />
      <Route path="BookList" element={<BookList />} />
      <Route path="cart" element={<Cart />} />
      <Route path="specificbook" element={<SpecificBook />} />     
      <Route path="RegistrationForm" element={<RegistrationForm />} />
      <Route path="OrderForm" element={<OrderForm />} />
      <Route path="AdminPanel" element={<AdminPanel />} />     
      <Route path="Page404" element={<Page404 />} />  
      <Route path="*" element={<RedirectHandler />} />    
    </Route>
  </Routes>
);

}

export default App;
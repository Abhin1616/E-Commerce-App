import { Route, Routes, useNavigate } from "react-router-dom"
import CustomerRegister from "./pages/Customer/CustomerRegister"
import CustomerLogin from "./pages/Customer/CustomerLogin"
import CustomerHome from "./pages/Customer/CustomerHome"
import SellerRegister from "./pages/Seller/SellerRegister"
import SellerLogin from "./pages/Seller/SellerLogin"
import SellerHome from "./pages/Seller/SellerHome"
import SellerAddProduct from "./pages/Seller/SellerAddProduct"
import CustomerViewProduct from "./pages/Customer/CustomerViewProduct"
import SellerIsAuthenticated from "./pages/Seller/SellerIsAuthenticated"
import SellerEditProduct from "./pages/Seller/SellerEditProduct"
import SellerViewAddedProducts from "./pages/Seller/SellerViewAddedProducts"
import SellerViewProduct from "./pages/Seller/SellerViewProduct"
import Navbar from "./pages/Navbar"
import CustomerCart from "./pages/Customer/CustomerCart"
import { useState, useRef } from "react"
import CustomerProfile from "./pages/Customer/CustomerProfile"
import CustomerCheckout from "./pages/Customer/CustomerCheckout"
import CustomerAddAddress from "./pages/Customer/CustomerAddAddress"
import SellerProfile from "./pages/Seller/SellerProfile"
import CustomerEditAddress from "./pages/Customer/CustomerEditAddress"
import CustomerOrders from "./pages/Customer/CustomerOrders"
import SellerOrders from "./pages/Seller/SellerOrders"
import SellerViewSingleOrder from "./pages/Seller/SellerViewSingleOrder"

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const searchRef = useRef(null);
  return (
    <div>
      <Navbar setSearchTerm={setSearchTerm} setCategory={setCategory} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
      <Routes>
        <Route path="/shoppingApp/register" element={<CustomerRegister />}></Route>
        <Route path="/shoppingApp/seller/register" element={<SellerRegister />}></Route>
        <Route path="/shoppingApp/login" element={<CustomerLogin />}></Route>
        <Route path="/shoppingApp/seller/login" element={<SellerLogin />}></Route>
        <Route path="/shoppingApp/home" element={<CustomerHome key={searchTerm + category} setSearchTerm={setSearchTerm} searchTerm={searchTerm} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} category={category} searchRef={searchRef} />}></Route>

        <Route path="/shoppingApp/products/:productId" element={<CustomerViewProduct />}></Route>
        <Route path="/shoppingApp/seller/home" element={<SellerIsAuthenticated><SellerHome /></SellerIsAuthenticated>}></Route>
        <Route path="/shoppingApp/seller/view-orders" element={<SellerIsAuthenticated><SellerOrders /></SellerIsAuthenticated>}></Route>
        <Route path="/shoppingApp/seller/view-orders/:orderId" element={<SellerIsAuthenticated><SellerViewSingleOrder /></SellerIsAuthenticated>}></Route>
        <Route path="/shoppingApp/seller/add-product" element={<SellerIsAuthenticated><SellerAddProduct /></SellerIsAuthenticated>}></Route>
        <Route path="/shoppingApp/seller/edit-product/:productId" element={<SellerIsAuthenticated><SellerEditProduct /></SellerIsAuthenticated>}></Route>
        <Route path="/shoppingApp/seller/products" element={<SellerIsAuthenticated><SellerViewAddedProducts /></SellerIsAuthenticated>}></Route>
        <Route path="/shoppingApp/seller/profile" element={<SellerIsAuthenticated><SellerProfile /></SellerIsAuthenticated>}></Route>
        <Route path="/shoppingApp/seller/view-product/:productId" element={<SellerIsAuthenticated><SellerViewProduct /></SellerIsAuthenticated>}></Route>
        <Route path="/shoppingApp/cart" element={<CustomerCart />}></Route>
        <Route path="/shoppingApp/profile" element={<CustomerProfile />}></Route>
        <Route path="/shoppingApp/checkout" element={<CustomerCheckout />}></Route>
        <Route path="/shoppingApp/profile/add-address" element={<CustomerAddAddress />}></Route>
        <Route path="/shoppingApp/profile/edit-address/:addressId" element={<CustomerEditAddress />}></Route>
        <Route path="/shoppingApp/view-order-history" element={<CustomerOrders />}></Route>
      </Routes>

    </div>
  )
}

export default App

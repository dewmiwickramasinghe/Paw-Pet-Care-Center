import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Inventory Management
import InventoryItems from "./component/InventoryManagement/s-InventoryItems";
import CategoriesList from "./component/InventoryManagement/CategoriesList";
import AddCategoryForm from "./component/InventoryManagement/addCatagory";
import UpdateCategory from "./component/InventoryManagement/UpdateCategory";
import CategoryDetail from "./component/InventoryManagement/CategoryDetail";
import AddItemForm from "./component/InventoryManagement/AddItem";
import ItemDetailsssss from "./component/InventoryManagement/ItemDetails";
import InventorySummaryReport from "./component/InventoryManagement/summery";

// Online Store
import AdminHome from './component/store/pages/Home/AdminHome';
import Store from './component/store/pages/Home/Store';
import ItemDetails from './component/store/pages/Home/ItemDetails';
import MyOrders from './component/store/pages/Home/MyOrders';  // <-- Import MyOrders

// Cart, Checkout, Receipt
import { CartProvider } from './component/store/utils/CartContext';
import Cart from './component/store/components/Cart.jsx';
import Checkout from './component/store/pages/Home/Checkout';
import Receipt from './component/store/pages/Home/Receipt';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Inventory Management Routes */}
          <Route path="/inv" element={<InventoryItems />} />
          <Route path="/dashboard/shashini" element={<InventoryItems />} />
          <Route path="/dashboard/addcatagory" element={<AddCategoryForm />} />
          <Route path="/dashboard/catagory" element={<CategoriesList />} />
          <Route path="/dashboard/additem" element={<AddItemForm />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
          <Route path="/categories/:id/edit" element={<UpdateCategory />} />
          <Route path="/dashboard/summery" element={<InventorySummaryReport />} />
          <Route path="/items/:id" element={<ItemDetailsssss />} />

          {/* Store Routes */}
          <Route path="/" element={<AdminHome />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/Store" element={<Store />} />
          <Route path="/store-items/:itemId" element={<ItemDetails />} />
          <Route path="/my-orders" element={<MyOrders />} />  {/* <-- Add MyOrders route */}

          {/* Cart, Checkout, Receipt */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/receipt/:orderId" element={<Receipt />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

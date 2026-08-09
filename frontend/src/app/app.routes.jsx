import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetails from "../features/products/pages/ProductDetails";
import Cart from "../features/cart/pages/Cart";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import AppLayout from "./AppLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/seller",
        children: [
          {
            path: "/seller/create",
            element: (
              <Protected role="seller">
                <CreateProduct />
              </Protected>
            ),
          },
          {
            path: "/seller/dashboard",
            element: (
              <Protected role="seller">
                <Dashboard />
              </Protected>
            ),
          },
          {
            path: "/seller/product/:id",
            element: (
              <Protected role="seller">
                <SellerProductDetails />
              </Protected>
            ),
          },
        ],
      },
      {
        path: "/cart",
        element: (
          <Protected>
            <Cart />
          </Protected>
        ),
      },
    ],
  },
]);

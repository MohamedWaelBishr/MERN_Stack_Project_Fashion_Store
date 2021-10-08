import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Swal from "sweetalert2";
import Products from "./products/Products";
import DetailProduct from "./detailProduct/DetailProduct";
import Login from "./auth/Login";
import Register from "./auth/Register";
import OrderHistory from "./history/OrderHistory";
import OrderDetails from "./history/OrderDetails";
import Cart from "./cart/Cart";
import NotFound from "./utils/not_found/NotFound";
import Categories from "./categories/Categories";
import CreateProduct from "./createProduct/CreateProduct";
import Users from "./Users/Users";
import { Redirect } from "react-router";
import Tags from "./Tags/Tags";
import EditTag from "./EditTag/EditTag";
import { GlobalState } from "../../GlobalState";
import EditUser from "./EditUser/EditUser";
import AddUser from "./AddUser/AddUser";
import Profile from "./Profile/Profile";

function Pages() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  const LOGIN_REQUIRED = () => {
    Swal.fire({
      icon: "error",
      title: "Login Required  ",
      text: " You Must Login To Access This Page ",
    });
    return <Redirect to="/" />;
  };

  return (
    <Switch>
      <Route path="/" exact component={Products} />
      <Route path="/detail/:id" exact component={DetailProduct} />

      <Route path="/login" exact component={isLogged ? Products : Login} />
      <Route
        path="/register"
        exact
        component={isLogged ? NotFound : Register}
      />

      <Route path="/users" exact component={isAdmin ? Users : NotFound} />
      <Route
        exact
        path="/users/edit/:id"
        component={isAdmin ? EditUser : NotFound}
      />
      <Route
        path="/users/create"
        exact
        component={isAdmin ? AddUser : NotFound}
      />

      <Route path="/tags" exact component={isAdmin ? Tags : NotFound} />
      <Route
        exact
        path="/tags/edit/:id"
        component={isAdmin ? EditTag : NotFound}
      />

      <Route
        path="/category"
        exact
        component={isAdmin ? Categories : NotFound}
      />
      <Route
        path="/create_product"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />
      <Route
        path="/edit_product/:id"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />

      <Route
        path="/history"
        exact
        component={isLogged ? OrderHistory : NotFound}
      />
      <Route
        path="/history/:id"
        exact
        component={isLogged ? OrderDetails : NotFound}
      />

      <Route path="/profile" exact component={isLogged ? Profile : NotFound} />

      <Route path="/cart" exact component={isLogged ? Cart : LOGIN_REQUIRED} />

      <Route path="*" exact component={NotFound} />
    </Switch>
  );
}

export default Pages;

import './App.css';
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import authProvider from './providers/authProvider.ts';
import dataProvider from './providers/dataProvider.ts';
import CategoryList from "./components/categories/CategoryList.tsx";
import CategoryEdit from "./components/categories/CategoryEdit.tsx";
import CategoryShow from "./components/categories/CategoryShow.tsx";
import CategoryCreate from "./components/categories/CategoryCreate.tsx";
import { UserShow } from "./components/users/UserShow.tsx";
import { UserEdit } from "./components/users/UserEdit.tsx";
import UserList from "./components/users/UserList.tsx";
import { UserCreate } from "./components/users/UserCreate.tsx";
import { RoleShow } from "./components/roles/RoleShow.tsx";
import { RoleList } from "./components/roles/RoleList.tsx";
import { RoleEdit } from "./components/roles/RoleEdit.tsx";
import StockList from "./components/stock/StockList.tsx";
import StockShow from "./components/stock/StockShow.tsx";
import StockEdit from "./components/stock/StockEdit.tsx";
import StockCreate from "./components/stock/StockCreate.tsx";
import PricebookEdit from "./components/priceBook/PriceBookEdit.tsx";
import PricebookList from "./components/priceBook/PriceBookList.tsx";
import PricebookShow from "./components/priceBook/PriceBookShow.tsx";
import PricebookCreate from "./components/priceBook/PriceBookCreate.tsx";
import { ProductEdit } from "./components/product/ProductEdit.tsx";
import { ProductList } from "./components/product/ProductList.tsx";
import { ProductShow } from "./components/product/ProductShow.tsx";
import { ProductCreate } from "./components/product/ProductCreate.tsx";
import OrderEdit from "./components/order/OrderEdit.tsx";
import OrderList from "./components/order/OrderList.tsx";
import OrderShow from "./components/order/OrderShow.tsx";
import { BrandEdit } from "./components/brand/BrandEdit.tsx";
import { BrandList } from "./components/brand/BrandList.tsx";
import { BrandShow } from "./components/brand/BrandShow.tsx";
import { BrandCreate } from "./components/brand/BrandCreate.tsx";

export const App = () => <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="category" list={CategoryList} edit={CategoryEdit} show={CategoryShow} create={CategoryCreate} />
    <Resource name="brand" list={BrandList} edit={BrandEdit} show={BrandShow} create={BrandCreate} />
    <Resource name="role" list={RoleList} edit={RoleEdit} show={RoleShow} />
    <Resource name="user" list={UserList} edit={UserEdit} show={UserShow} create={UserCreate} />
    <Resource name="stock" list={StockList} edit={StockEdit} show={StockShow} create={StockCreate} />
    <Resource name="payment-method" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
    <Resource name="shipping-method" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />

    <Resource name="pricebook" list={PricebookList} edit={PricebookEdit} show={PricebookShow} create={PricebookCreate} />
    <Resource name="product" list={ProductList} edit={ProductEdit} show={ProductShow} create={ProductCreate} />
    <Resource name="order" list={OrderList} edit={OrderEdit} show={OrderShow} />
</Admin>;

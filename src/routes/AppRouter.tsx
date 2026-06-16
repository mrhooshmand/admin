import {BrowserRouter, Routes, Route} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import {lazy, Suspense} from "react";
import Loading from "@/components/Loading.tsx";
import PageNotFound from "@/pages/PageNotFound.tsx";

const Dashboard = lazy(() => import("../pages/Dashboard"))
const Users = lazy(() => import("../pages/Users"))
const Profile = lazy(() => import("../pages/Profile"))


export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route
                    path="/"
                    element={<MainLayout/>}
                >
                    <Route index element={<Suspense fallback={() => <Loading/>}><Dashboard/></Suspense>}/>
                    <Route path="dashboard"
                           element={<Suspense fallback={() => <Loading/>}><Dashboard/></Suspense>}/>
                    <Route path="users" element={<Suspense fallback={() => <Loading/>}><Users/></Suspense>}/>
                    <Route path="profile"
                           element={<Suspense fallback={() => <Loading/>}><Profile/></Suspense>}/>
                </Route>
                <Route path={"*"} element={<PageNotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}
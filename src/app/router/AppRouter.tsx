import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy, Suspense} from "react";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Loading from "@/components/Loading";
import PageNotFound from "@/pages/PageNotFound";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Users = lazy(() => import("@/pages/Users"));
const Profile = lazy(() => import("@/pages/Profile"));

const PageLoader = () => <Loading/>;

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader/>}>
                <Routes>
                    <Route element={<AuthLayout/>}>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                    </Route>
                    <Route element={<MainLayout/>}>
                        <Route index element={<Dashboard/>}/>
                        <Route path="dashboard" element={<Dashboard/>}/>
                        <Route path="users" element={<Users/>}/>
                        <Route path="profile" element={<Profile/>}/>
                    </Route>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
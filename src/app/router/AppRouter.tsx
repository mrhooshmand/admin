import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy, Suspense} from "react";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import Loading from "@/shared/components/Loading";
import PageNotFound from "@/shared/components/PageNotFound";

const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard"));
const Users = lazy(() => import("@/features/users/pages/Users"));
const Profile = lazy(() => import("@/features/profile/pages/Profile"));

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
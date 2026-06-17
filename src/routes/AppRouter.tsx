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
            <Routes>
                <Route element={<AuthLayout/>}>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Route>

                <Route element={<MainLayout/>}>
                    <Route
                        index
                        element={
                            <Suspense fallback={<PageLoader/>}>
                                <Dashboard/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="dashboard"
                        element={
                            <Suspense fallback={<PageLoader/>}>
                                <Dashboard/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="users"
                        element={
                            <Suspense fallback={<PageLoader/>}>
                                <Users/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <Suspense fallback={<PageLoader/>}>
                                <Profile/>
                            </Suspense>
                        }
                    />
                </Route>

                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}
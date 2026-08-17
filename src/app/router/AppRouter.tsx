import {Routes, Route} from "react-router-dom";
import {lazy, Suspense} from "react";

import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/features/auth/pages/LoginPage";
import Register from "@/features/auth/pages/RegisterPage";
import Loading from "@/shared/components/Loading";
import PageNotFound from "@/shared/components/PageNotFound";

import {appRoutes} from "./appRoutes";
import PermissionRoute from "./PermissionRoute";
import {PermissionProvider} from "@/app/providers/PermissionProvider.tsx";

const PageLoader = () => <Loading/>;
const Profile = lazy(() => import("@/features/profile/pages/ProfilePage"));

export default function AppRouter() {
    return (
        <PermissionProvider>
            <Suspense fallback={<PageLoader/>}>
                <Routes>
                    <Route element={<AuthLayout/>}>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                    </Route>

                    <Route element={<MainLayout/>}>
                        <Route index element={<PageNotFound/>}/>
                        {appRoutes.map((route) => (
                            <Route
                                key={route.code}
                                path={route.path}
                                element={
                                    <PermissionRoute code={route.code}>
                                        {route.element}
                                    </PermissionRoute>
                                }
                            />
                        ))}
                        <Route path="profile" element={<Profile/>}/>
                    </Route>

                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Suspense>
        </PermissionProvider>
    );
}
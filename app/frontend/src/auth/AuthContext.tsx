import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axiosClient";

type AuthContextType = {
    authenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, baseCurrency: string) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem("token").then((token) => {
            if (token) setAuthenticated(true);
            setIsLoading(false);
        });

        const interceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    await logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password });
        await AsyncStorage.setItem("token", res.data.token);
        setAuthenticated(true);
    };

    const register = async (email: string, password: string, baseCurrency: string) => {
        await api.post("/auth/register", { email, password, base_currency: baseCurrency });
    };

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        setAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ authenticated, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

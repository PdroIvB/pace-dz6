import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect } from "react";

export const useAxios = () => {
    const { auth } = usePage<PageProps>().props;

    const axiosInstance = axios.create({
        baseURL: "/api",
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
        withXSRFToken: true,
    });

    return { axiosInstance };
}
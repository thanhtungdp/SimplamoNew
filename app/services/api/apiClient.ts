/**
 * Centralized API Client
 * 
 * This module provides a singleton API client that automatically handles:
 * - Authentication headers (Bearer token)
 * - Tenant headers (tenant-id)
 * - Base configuration
 * - Auto-loading credentials from storage on app startup
 * 
 * Usage:
 * ```typescript
 * import { apiClient } from "@/services/api/apiClient"
 * 
 * // Set auth once (usually after login)
 * apiClient.setAuth(token, tenant)
 * 
 * // Make requests - headers are automatically included
 * const response = await apiClient.get("/auth/dashboards")
 * ```
 */

import { create, ApisauceInstance } from "apisauce"
import Config from "@/config"
import { storage } from "@/stores/mmkvStorage"

class ApiClient {
    private apisauce: ApisauceInstance
    private token: string | null = null
    private tenant: string | null = null

    constructor() {
        this.apisauce = create({
            baseURL: Config.API_URL,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            timeout: 30000,
        })

        // Auto-load credentials from storage on initialization
        this.loadAuthFromStorage()
    }

    /**
     * Load authentication credentials from storage
     * Called automatically on initialization
     */
    private loadAuthFromStorage() {
        try {
            const authStorage = storage.getString("auth-storage")
            if (authStorage) {
                const authData = JSON.parse(authStorage)
                const { token, tenant } = authData.state || {}

                if (token && tenant) {
                    this.setAuth(token, tenant)
                    console.log("[ApiClient] Auto-loaded auth from storage")
                }
            }
        } catch (e) {
            console.warn("[ApiClient] Failed to load auth from storage:", e)
        }
    }

    /**
     * Set authentication credentials
     * This will automatically add headers to all subsequent requests
     * and save to storage
     */
    setAuth(token: string, tenant: string) {
        this.token = token
        this.tenant = tenant
        this.apisauce.setHeader("Authorization", `Bearer ${token}`)
        this.apisauce.setHeader("tenant-id", tenant)
    }

    /**
     * Clear authentication credentials
     */
    clearAuth() {
        this.token = null
        this.tenant = null
        this.apisauce.deleteHeader("Authorization")
        this.apisauce.deleteHeader("tenant-id")
    }

    /**
     * Get current token
     */
    getToken(): string | null {
        return this.token
    }

    /**
     * Get current tenant
     */
    getTenant(): string | null {
        return this.tenant
    }

    /**
     * Make a GET request
     */
    get<T = any>(url: string, params?: any, axiosConfig?: any) {
        return this.apisauce.get<T>(url, params, axiosConfig)
    }

    /**
     * Make a POST request
     */
    post<T = any>(url: string, data?: any, axiosConfig?: any) {
        return this.apisauce.post<T>(url, data, axiosConfig)
    }

    /**
     * Make a PUT request
     */
    put<T = any>(url: string, data?: any, axiosConfig?: any) {
        return this.apisauce.put<T>(url, data, axiosConfig)
    }

    /**
     * Make a PATCH request
     */
    patch<T = any>(url: string, data?: any, axiosConfig?: any) {
        return this.apisauce.patch<T>(url, data, axiosConfig)
    }

    /**
     * Make a DELETE request
     */
    delete<T = any>(url: string, params?: any, axiosConfig?: any) {
        return this.apisauce.delete<T>(url, params, axiosConfig)
    }

    /**
     * Set a custom header
     */
    setHeader(name: string, value: string) {
        this.apisauce.setHeader(name, value)
    }

    /**
     * Delete a custom header
     */
    deleteHeader(name: string) {
        this.apisauce.deleteHeader(name)
    }
}

// Singleton instance
export const apiClient = new ApiClient()

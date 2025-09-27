export interface LocaleGqlOptions {
    variables?: Record<string, any>
    headers?: Record<string, string>
    endpoint?: string
}

export interface LocaleGqlResponse<T = any> {
    data?: T
    errors?: Array<{
        message: string
        locations?: Array<{ line: number; column: number }>
        path?: string[]
    }>
}

export interface LocaleGqlError extends Error {
    gqlErrors?: Array<{
        message: string
        locations?: Array<{ line: number; column: number }>
        path?: string[]
    }>
}

/**
 * Composable for executing GraphQL queries on local graphs when needed
 * Completely independent from the main GraphQL client
 * 
 * @example
 * ```typescript
 * // Basic query execution
 * const { localeQuery } = useLocaleGql()
 * const result = await localeQuery('getProducts', { variables: { first: 10 } })
 * 
 * // Query with custom endpoint
 * const result = await localeQuery('getProducts', { 
 *   variables: { first: 10 }, 
 *   endpoint: 'http://localhost:4001/graphql' 
 * })
 * 
 * // Query with retry
 * const { queryWithRetry } = useLocaleGql()
 * const result = await queryWithRetry('getProducts', { variables: { first: 10 } }, 3)
 * 
 * // Query with caching
 * const { queryWithCache } = useLocaleGql()
 * const result = await queryWithCache('getProducts', { variables: { first: 10 } })
 * 
 * // Get locale information
 * const { getLocaleInfo } = useLocaleGql()
 * const localeInfo = getLocaleInfo()
 * console.log(localeInfo.currentLocale, localeInfo.currentEndpoint)
 * ```
 */
export const useLocaleGql = () => {
    const { $i18n } = useNuxtApp()
    const config = useRuntimeConfig()

    // Simple error message helper
    const getErrorMessage = (error: any): string => {
        if (error?.message) return error.message
        if (error?.gqlErrors?.[0]?.message) return error.gqlErrors[0].message
        return 'Unknown error occurred'
    }

    // Fallback if $i18n is not available
    const getCurrentLocale = () => {
        try {
            return $i18n?.locale?.value || 'en'
        } catch {
            return 'en'
        }
    }

    /**
     * Get the appropriate GraphQL endpoint based on current locale
     * @param customEndpoint - Optional custom endpoint to use
     * @returns The GraphQL endpoint URL
     */
    const getLocaleEndpoint = (customEndpoint?: string): string => {
        const locale = getCurrentLocale()

        // If custom endpoint is provided, use it
        if (customEndpoint) {
            return customEndpoint
        }

        // Use runtime config endpoints
        const endpoints = config.public.localeGqlEndpoints as Record<string, string>
        return endpoints[locale] || endpoints.default || 'http://localhost:4001/graphql'
    }

    /**
     * Execute a GraphQL query on locale-specific endpoint
     * Completely independent from the main GraphQL client
     * @param query - The GraphQL query string
     * @param options - Query execution options
     * @returns Promise with query response
     */
    const localeQuery = async <T = any>(
        query: string,
        options: LocaleGqlOptions = {}
    ): Promise<LocaleGqlResponse<T>> => {
        try {
            const endpoint = getLocaleEndpoint(options.endpoint)

            // Log the endpoint selection for debugging
            console.log(`Executing GraphQL query on locale endpoint: ${endpoint}`)

            // Execute GraphQL query directly using $fetch
            const response = await $fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                },
                body: {
                    query,
                    variables: options.variables
                }
            }) as any

            // Handle GraphQL response
            if (response.errors && response.errors.length > 0) {
                const gqlError: LocaleGqlError = new Error('GraphQL errors occurred')
                gqlError.gqlErrors = response.errors
                throw gqlError
            }

            return {
                data: response.data,
                errors: response.errors
            }
        } catch (error: any) {
            const gqlError: LocaleGqlError = new Error(getErrorMessage(error))
            gqlError.gqlErrors = error.gqlErrors || [{ message: error.message }]
            throw gqlError
        }
    }

    /**
     * Execute a GraphQL mutation on locale-specific endpoint
     * @param mutation - The GraphQL mutation string
     * @param options - Mutation execution options
     * @returns Promise with mutation response
     */
    const mutate = async <T = any>(
        mutation: string,
        options: LocaleGqlOptions = {}
    ): Promise<LocaleGqlResponse<T>> => {
        try {
            const endpoint = getLocaleEndpoint(options.endpoint)

            // Log the endpoint selection for debugging
            console.log(`Executing GraphQL mutation on locale endpoint: ${endpoint}`)

            // Execute GraphQL mutation directly using $fetch
            const response = await $fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                },
                body: {
                    query: mutation,
                    variables: options.variables
                }
            }) as any

            // Handle GraphQL response
            if (response.errors && response.errors.length > 0) {
                const gqlError: LocaleGqlError = new Error('GraphQL errors occurred')
                gqlError.gqlErrors = response.errors
                throw gqlError
            }

            return {
                data: response.data,
                errors: response.errors
            }
        } catch (error: any) {
            const gqlError: LocaleGqlError = new Error(getErrorMessage(error))
            gqlError.gqlErrors = error.gqlErrors || [{ message: error.message }]
            throw gqlError
        }
    }

    /**
     * Execute a GraphQL subscription on locale-specific endpoint
     * @param subscription - The GraphQL subscription string
     * @param options - Subscription execution options
     * @returns Observable for subscription updates
     */
    const subscribe = <T = any>(
        subscription: string,
        options: LocaleGqlOptions = {}
    ) => {
        const endpoint = getLocaleEndpoint(options.endpoint)
        console.log(`Setting up GraphQL subscription on locale endpoint: ${endpoint}`)

        // For WebSocket subscriptions, you would implement WebSocket connection here
        // For now, return a placeholder
        return {
            subscribe: (observer: any) => {
                console.warn('WebSocket subscription not implemented yet')
                return { unsubscribe: () => { } }
            }
        }
    }

    /**
     * Execute a query with automatic retry on failure
     * @param query - The GraphQL query string
     * @param options - Query execution options
     * @param maxRetries - Maximum number of retry attempts (default: 3)
     * @returns Promise with query response
     */
    const queryWithRetry = async <T = any>(
        query: string,
        options: LocaleGqlOptions = {},
        maxRetries: number = 3
    ): Promise<LocaleGqlResponse<T>> => {
        let lastError: any

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await localeQuery<T>(query, options)
            } catch (error: any) {
                lastError = error

                // Don't retry on certain types of errors
                if (error.gqlErrors?.some((err: any) =>
                    err.message.includes('Unauthorized') ||
                    err.message.includes('Forbidden') ||
                    err.message.includes('Not Found')
                )) {
                    throw error
                }

                // Wait before retrying (exponential backoff)
                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
                    await new Promise(resolve => setTimeout(resolve, delay))
                }
            }
        }

        throw lastError
    }

    /**
     * Execute multiple queries in parallel
     * @param queries - Array of query objects with query string and options
     * @returns Promise with array of responses
     */
    const queryMultiple = async <T = any>(
        queries: Array<{ query: string; options?: LocaleGqlOptions }>
    ): Promise<LocaleGqlResponse<T>[]> => {
        const promises = queries.map(({ query, options }) =>
            localeQuery<T>(query, options)
        )

        return Promise.all(promises)
    }

    /**
     * Execute a query with caching
     * @param query - The GraphQL query string
     * @param options - Query execution options
     * @param cacheKey - Optional cache key (defaults to query hash)
     * @param ttl - Cache time-to-live in milliseconds (default: 5 minutes)
     * @returns Promise with cached or fresh query response
     */
    const queryWithCache = async <T = any>(
        query: string,
        options: LocaleGqlOptions = {},
        cacheKey?: string,
        ttl: number = 5 * 60 * 1000 // 5 minutes
    ): Promise<LocaleGqlResponse<T>> => {
        const key = cacheKey || `locale_gql_${btoa(query + JSON.stringify(options.variables || {}))}`

        // Check cache first (only in browser)
        if (process.client) {
            const cached = sessionStorage.getItem(key)
            if (cached) {
                const { data, timestamp } = JSON.parse(cached)
                if (Date.now() - timestamp < ttl) {
                    return { data }
                }
            }
        }

        // Execute query and cache result
        const result = await localeQuery<T>(query, options)
        if (result.data && process.client) {
            sessionStorage.setItem(key, JSON.stringify({
                data: result.data,
                timestamp: Date.now()
            }))
        }

        return result
    }

    /**
     * Get current locale information
     * @returns Current locale and available endpoints
     */
    const getLocaleInfo = () => {
        const locale = getCurrentLocale()
        const availableEndpoints = [
            'http://localhost:4001/graphql', // en
            'http://localhost:4002/graphql', // ru
            'http://localhost:4003/graphql', // ar
            'http://localhost:4004/graphql', // de
            'http://localhost:4005/graphql', // es
            'http://localhost:4006/graphql', // fr
            'http://localhost:4007/graphql', // it
            'http://localhost:4008/graphql', // pt
            'http://localhost:4009/graphql'  // fa
        ]

        return {
            currentLocale: locale,
            availableEndpoints,
            currentEndpoint: getLocaleEndpoint()
        }
    }

    /**
     * Get the endpoint for a specific locale
     * @param locale - The locale to get endpoint for
     * @returns The endpoint URL
     */
    const getEndpointForLocale = (locale: string): string => {
        const endpoints = config.public.localeGqlEndpoints as Record<string, string>
        return endpoints[locale] || endpoints.default || 'http://localhost:4001/graphql'
    }

    return {
        // Core methods
        localeQuery,
        mutate,
        subscribe,

        // Advanced methods
        queryWithRetry,
        queryMultiple,
        queryWithCache,

        // Utility methods
        getLocaleEndpoint,
        getLocaleInfo,
        getEndpointForLocale
    }
}

/**
 * Shorthand composable for quick query execution
 * @param query - The GraphQL query string
 * @param variables - Query variables
 * @param endpoint - Optional custom endpoint
 * @returns Promise with query response
 */
export const useGqlQuery = async <T = any>(
    query: string,
    variables?: Record<string, any>,
    endpoint?: string
) => {
    const { localeQuery: executeQuery } = useLocaleGql()
    return executeQuery<T>(query, { variables, endpoint })
}

/**
 * Shorthand composable for quick mutation execution
 * @param mutation - The GraphQL mutation string
 * @param variables - Mutation variables
 * @param endpoint - Optional custom endpoint
 * @returns Promise with mutation response
 */
export const useGqlMutation = async <T = any>(
    mutation: string,
    variables?: Record<string, any>,
    endpoint?: string
) => {
    const { mutate: executeMutation } = useLocaleGql()
    return executeMutation<T>(mutation, { variables, endpoint })
}

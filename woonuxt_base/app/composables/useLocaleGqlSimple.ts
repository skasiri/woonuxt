/**
 * Simple version of useLocaleGql to avoid server errors
 * This version doesn't depend on external composables
 */

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
 * Simple composable for locale-specific GraphQL queries
 */
export const useLocaleGqlSimple = () => {
    const config = useRuntimeConfig()

    /**
     * Get current locale (simplified)
     */
    const getCurrentLocale = (): string => {
        // Try to get locale from browser
        if (process.client) {
            const locale = localStorage.getItem('locale') ||
                document.documentElement.lang ||
                navigator.language.split('-')[0] ||
                'en'
            return locale
        }
        return 'en'
    }

    /**
     * Get the appropriate GraphQL endpoint based on current locale
     */
    const getLocaleEndpoint = (customEndpoint?: string): string => {
        const locale = getCurrentLocale()

        if (customEndpoint) {
            return customEndpoint
        }

        // Use runtime config endpoints
        const endpoints = config.public.localeGqlEndpoints as Record<string, string>
        return endpoints[locale] || endpoints.default || 'http://localhost:4001/graphql'
    }

    /**
     * Execute a GraphQL query on locale-specific endpoint
     */
    const localeQuery = async <T = any>(
        query: string,
        options: LocaleGqlOptions = {}
    ): Promise<LocaleGqlResponse<T>> => {
        try {
            const endpoint = getLocaleEndpoint(options.endpoint)

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
                console.error('GraphQL errors:', response.errors)
                const gqlError: LocaleGqlError = new Error(`GraphQL errors occurred: ${response.errors.map(e => e.message).join(', ')}`)
                gqlError.gqlErrors = response.errors
                throw gqlError
            }

            return {
                data: response.data,
                errors: response.errors
            }
        } catch (error: any) {
            console.error('GraphQL query error details:', {
                message: error.message,
                status: error.status,
                statusText: error.statusText,
                data: error.data,
                url: endpoint
            })
            
            const gqlError: LocaleGqlError = new Error(error.message || 'Unknown error')
            gqlError.gqlErrors = error.gqlErrors || [{ message: error.message }]
            throw gqlError
        }
    }

    /**
     * Get current locale information
     */
    const getLocaleInfo = () => {
        const locale = getCurrentLocale()

        return {
            currentLocale: locale,
            currentEndpoint: getLocaleEndpoint()
        }
    }

    return {
        localeQuery,
        getLocaleInfo,
        getLocaleEndpoint
    }
}

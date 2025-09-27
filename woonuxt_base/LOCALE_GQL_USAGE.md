# useLocaleGql - مستقل از GraphQL اصلی

`useLocaleGql` یک composable کاملاً مستقل است که امکان اجرای کوئری‌های GraphQL بر روی endpoint های محلی مختلف را فراهم می‌کند.

## ویژگی‌ها

- ✅ **کاملاً مستقل**: هیچ وابستگی به GraphQL اصلی ندارد
- ✅ **پشتیبانی از چندین endpoint**: هر locale می‌تواند endpoint مخصوص خود داشته باشد
- ✅ **استفاده همزمان**: می‌توان همزمان از GraphQL اصلی و محلی استفاده کرد
- ✅ **Cache کردن**: پشتیبانی از cache کردن نتایج
- ✅ **Retry خودکار**: قابلیت retry با exponential backoff
- ✅ **Error handling**: مدیریت کامل خطاها

## تنظیمات

### Environment Variables

```bash
# Locale-specific GraphQL Endpoints
LOCALE_GQL_DEFAULT_ENDPOINT=http://localhost:4001/graphql
LOCALE_GQL_EN_ENDPOINT=http://localhost:4001/graphql
LOCALE_GQL_RU_ENDPOINT=http://localhost:4002/graphql
LOCALE_GQL_AR_ENDPOINT=http://localhost:4003/graphql
LOCALE_GQL_DE_ENDPOINT=http://localhost:4004/graphql
LOCALE_GQL_ES_ENDPOINT=http://localhost:4005/graphql
LOCALE_GQL_FR_ENDPOINT=http://localhost:4006/graphql
LOCALE_GQL_IT_ENDPOINT=http://localhost:4007/graphql
LOCALE_GQL_PT_ENDPOINT=http://localhost:4008/graphql
LOCALE_GQL_FA_ENDPOINT=http://localhost:4009/graphql
```

## استفاده

### 1. کوئری ساده

```typescript
const { localeQuery } = useLocaleGql();

const query = `
  query getProducts($first: Int!) {
    products(first: $first) {
      nodes {
        name
        price
      }
    }
  }
`;

const { data } = await localeQuery(query, {
  variables: { first: 10 },
});
```

### 2. کوئری با endpoint سفارشی

```typescript
const { localeQuery } = useLocaleGql();

const { data } = await localeQuery(query, {
  variables: { first: 10 },
  endpoint: 'http://custom-endpoint.com/graphql',
});
```

### 3. Mutation

```typescript
const { mutate } = useLocaleGql();

const mutation = `
  mutation createProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
    }
  }
`;

const { data } = await mutate(mutation, {
  variables: { input: { name: 'New Product' } },
});
```

### 4. کوئری با cache

```typescript
const { queryWithCache } = useLocaleGql();

const { data } = await queryWithCache(
  query,
  {
    variables: { first: 10 },
  },
  'products-cache',
  300000,
); // 5 minutes cache
```

### 5. کوئری با retry

```typescript
const { queryWithRetry } = useLocaleGql();

const { data } = await queryWithRetry(
  query,
  {
    variables: { first: 10 },
  },
  3,
); // 3 retries
```

### 6. کوئری‌های متعدد

```typescript
const { queryMultiple } = useLocaleGql();

const queries = [
  { query: query1, options: { variables: { id: 1 } } },
  { query: query2, options: { variables: { id: 2 } } },
];

const results = await queryMultiple(queries);
```

### 7. دریافت اطلاعات locale

```typescript
const { getLocaleInfo } = useLocaleGql();

const info = getLocaleInfo();
console.log(info.currentLocale); // 'ru'
console.log(info.currentEndpoint); // 'http://localhost:4002/graphql'
console.log(info.availableEndpoints); // Array of all endpoints
```

## مثال کامل

```typescript
<script setup>
const { localeQuery, getLocaleInfo } = useLocaleGql()

// Get current locale info
const localeInfo = getLocaleInfo()
console.log('Current locale:', localeInfo.currentLocale)
console.log('Current endpoint:', localeInfo.currentEndpoint)

// Execute query based on current locale
const productQuery = `
  query getProductBySku($sku: ID!) {
    product(id: $sku, idType: SKU) {
      name
      sku
      description
      price
    }
  }
`

const { data: localeData } = await localeQuery(productQuery, {
  variables: { sku: 'PRODUCT-123' }
})

console.log('Locale-specific data:', localeData)
</script>
```

## نکات مهم

1. **Endpoint ها باید فعال باشند**: مطمئن شوید که endpoint های محلی شما در حال اجرا هستند
2. **Schema compatibility**: endpoint های محلی باید schema مشابه داشته باشند
3. **Error handling**: همیشه خطاها را handle کنید
4. **Performance**: برای کوئری‌های مکرر از cache استفاده کنید

## تفاوت با GraphQL اصلی

| ویژگی          | GraphQL اصلی        | useLocaleGql           |
| -------------- | ------------------- | ---------------------- |
| Endpoint       | یکی                 | متعدد (بر اساس locale) |
| Cache          | خودکار              | دستی                   |
| Auto-generated | بله                 | خیر                    |
| وابستگی        | nuxt-graphql-client | مستقل                  |
| استفاده همزمان | -                   | بله                    |

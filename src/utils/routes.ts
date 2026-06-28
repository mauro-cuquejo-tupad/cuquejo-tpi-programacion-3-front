export const HOME_STORE = "/src/pages/store/home/home.html";
export const HOME_ADMIN = "/src/pages/admin/adminHome/adminHome.html";
export const ADMIN_ORDERS = "/src/pages/admin/orders/orders.html";
export const ADMIN_CATEGORIES = "/src/pages/admin/categories/categories.html";
export const ADMIN_PRODUCTS = "/src/pages/admin/products/products.html";
export const HOME_CLIENT = "/src/pages/client/client.html";
export const LOGIN_PAGE = "/src/pages/auth/login/login.html";
export const REGISTRO_PAGE = "/src/pages/auth/registro/registro.html";
export const CART_PAGE = "/src/pages/store/cart/cart.html";
export const ORDER_PAGE = "/src/pages/client/orders/orders.html";
export const PRODUCT_DETAIL = "/src/pages/store/productDetail/productDetail.html";
export const ROOT_PAGE = "/";
export const INDEX_PAGE = "/index.html";

export const VALID_PAGES = new Set<String>([
    LOGIN_PAGE,
    REGISTRO_PAGE,
]);
export const VALID_USER_PAGES = new Set<string>([
    HOME_STORE,
    HOME_CLIENT,
    CART_PAGE,
    PRODUCT_DETAIL,
    ORDER_PAGE
]);

export const VALID_ADMIN_PAGES = new Set<string>([
    HOME_ADMIN,
    ADMIN_CATEGORIES,
    ADMIN_ORDERS,
    ADMIN_PRODUCTS
]);
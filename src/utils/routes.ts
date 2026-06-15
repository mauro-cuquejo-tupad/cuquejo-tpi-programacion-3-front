export const HOME_STORE = "/src/pages/store/home/home.html";
export const HOME_ADMIN = "/src/pages/admin/admin.html";
export const HOME_CLIENT = "/src/pages/client/client.html";
export const LOGIN_PAGE = "/src/pages/auth/login/login.html";
export const REGISTRO_PAGE = "/src/pages/auth/registro/registro.html";
export const CART_PAGE = "/src/pages/store/cart/cart.html";
export const PRODUCT_DETAIL = "/src/pages/store/productDetail/productDetail.html";
export const ROOT_PAGE = "/";
export const INDEX_PAGE = "/index.html";

export const VALID_PAGES = new Set<string>([
    ROOT_PAGE,
    INDEX_PAGE,
    HOME_STORE,
    HOME_ADMIN,
    HOME_CLIENT,
    LOGIN_PAGE,
    REGISTRO_PAGE,
    CART_PAGE,
    PRODUCT_DETAIL
]);
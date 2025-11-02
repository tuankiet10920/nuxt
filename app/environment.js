/*
  http://localhost:3333/api
  https://ntkmarket.shop/api
  http://localhost:5000
  https://phucansolutions.com/api
*/

/**
 * @target environment
 * @desc CẤU HÌNH DATABASE CONFIG
 * @option test
 * @option production
 * @option development
 */
export const environment = "production";

export const configs = {
  debug: true,
  is_replace_route: true,
  environment,
  admin: {
    title: "ANNA BUILDINGS PANEL",
    prefix: "quan-tri",
  },
};

export const apiUrl =
  environment == "production" ? "production_url" : "http://localhost:5000/api";

export const imageUrl =
  environment == "production" ? "production_url" : "http://localhost:5000";

export const routesMap = [
  {
    en: "account",
    vi: "thong-tin-tai-khoan",
    children: [
      {
        en: "account",
        vi: "",
      },
      {
        en: "love",
        vi: "san-pham-yeu-thich",
      },
      {
        en: "address",
        vi: "dia-chi",
      },
      {
        en: "orders",
        vi: "don-hang-cua-toi",
      },
      {
        en: "voucher",
        vi: "diem-tich-luy",
      },
    ],
  },
  {
    en: "product-slug",
    vi: "san-pham",
  },
  {
    en: "about",
    vi: "gioi-thieu",
  },
];

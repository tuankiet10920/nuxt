/*
  http://localhost:3333/api
  https://ntkmarket.shop/api
  http://localhost:5000
  https://phucansolutions.com/api
*/
export const apiUrl = "http://localhost:5000/api";
export const imageUrl = "http://localhost:5000";
export const configs = {
  debug: true,
  admin: {
    title: "ANNA BUILDINGS PANEL",
    prefix: "quan-tri",
  },
  isReplaceRoute: true,
};
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

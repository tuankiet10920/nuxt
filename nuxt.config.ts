// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import { configs, routesMap } from "./app/environment";

interface RouteMapInterface {
  en: string;
  vi: string;
  children?: RouteMapInterface[];
}

export default defineNuxtConfig({
  srcDir: "app",
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  debug: false,
  hooks: {
    "pages:extend"(routes) {
      if (configs.is_replace_route) {
        let routesHasPath: RouteMapInterface[] = [];

        // lọc và chia ra các route có và không có chilren
        routesHasPath = routesMap;

        routes.forEach((route) => {
          if (route.path) {
            if (route.path.includes("admin")) {
              route.path = route.path.replace("admin", configs.admin.prefix);
            }

            // các routes lồng nhau
            if (routesHasPath.length > 0) {
              // cấu hình cho các route lồng nhau
              let nameOfRoute: string = "";

              // nếu không tìm thấy name của route thì dùng path và tách thành mảng theo dấu /
              if (route.name) nameOfRoute = route.name ?? "";
              else nameOfRoute = route.path.split("/")[1] ?? "";

              if (nameOfRoute.trim() != "") {
                const currentRouteInRouteMap = routesHasPath.find(
                  (item) => item.en == nameOfRoute
                );

                const params = ["slug", "id"];
                let indexOfParam = -1;

                const isExistParamInRoute = params.some((param, index) => {
                  if (nameOfRoute.includes(param)) {
                    indexOfParam = index;
                    return true;
                  }
                  return false;
                });

                // cập nhật route đơn
                if (isExistParamInRoute) {
                  route.path = route.path.replace(
                    `/${nameOfRoute.split("-")[0]}/:${params[indexOfParam]}()`,
                    `/${currentRouteInRouteMap?.vi}/:${params[indexOfParam]}()`
                  );
                } else {
                  route.path = route.path.replace(
                    `/${nameOfRoute}`,
                    `/${currentRouteInRouteMap?.vi}`
                  );
                }

                route.children?.map((item) => {
                  const equalRoute = currentRouteInRouteMap?.children?.find(
                    (_item) => `${nameOfRoute}-${_item.en}` == item.name
                  );
                  if (equalRoute) item.path = equalRoute.vi;
                  return item;
                });
              }
            }
          }
        });
      }
    },
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
  ],
});

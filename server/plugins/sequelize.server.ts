// server/plugins/sequelize.server.ts
import { Sequelize, DataTypes, Options } from "sequelize";
// import { environment } from "../../app/environment.js";
import config from "../../config/config.json";
import fs from "fs";
import path from "path";

type EnvType = "development" | "test" | "production";

// Khởi tạo một đối tượng Sequelize toàn cục (global)
// Cần sử dụng một biến toàn cục để tránh kết nối lại nhiều lần
let sequelizeInstance: Sequelize | null = null;

// Khai báo biến global cho TypeScript (để useDB() có thể truy cập)
declare global {
  var __sequelize: Sequelize | undefined;
}

// Hàm tải tất cả Models và thiết lập liên kết
const loadModelsAndAssociate = (sequelize: Sequelize) => {
  const db: any = {};

  // Đường dẫn tới thư mục models (ngang hàng với thư mục server/)
  const modelsPath = path.join(process.cwd(), "models");
  const basename = path.basename(__filename);

  // Đọc tất cả file model trong thư mục models/
  fs.readdirSync(modelsPath)
    .filter((file) => {
      // Bỏ qua các file ẩn, file hiện tại, và chỉ lấy file .js không phải .test.js
      return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.js") === -1
      );
    })
    .forEach((file) => {
      // Import và khởi tạo Model
      // Lưu ý: Nếu bạn dùng ESM (.mjs hoặc 'type': 'module' trong package.json)
      // bạn cần dùng dynamic import(path.join(modelsPath, file))
      // hoặc dùng require() nếu là CJS
      const model = require(path.join(modelsPath, file))(sequelize, DataTypes);
      db[model.name] = model;
    });

  // Chạy hàm associate (Liên kết) giữa các Models
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

// Hàm khởi tạo kết nối
async function initializeSequelize() {
  if (sequelizeInstance) {
    return sequelizeInstance;
  }

  const port: number = 3306;

  const environment: EnvType = "production";

  // 1. Lấy chuỗi kết nối từ biến môi trường
  const connectionUrl =
    environment == "production"
      ? config[environment]["database_url"]
      : generateStringDatabaseConnection(
          config[environment]["username"],
          config[environment]["password"],
          config[environment]["host"],
          port,
          config[environment]["database"]
        );

  if (!connectionUrl) {
    console.error("DATABASE_URL is not set. Database initialization skipped.");
    return null;
  }

  try {
    // 2. Tạo đối tượng Sequelize
    const sequelize = new Sequelize(connectionUrl, {
      dialect: "mysql",
      logging: false, // Tắt logging SQL ra console
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false, // Cần cho Railway/PlanetScale
        },
      },
    });

    // 3. Xác thực kết nối
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // 5. Tải Models và Liên kết (BƯỚC QUAN TRỌNG)
    loadModelsAndAssociate(sequelize);

    // 6. Gán vào biến Global để các API Route có thể truy cập
    global.__sequelize = sequelize;

    sequelizeInstance = sequelize;
    return sequelizeInstance;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return null;
  }
}

/**
 *
 * @param {string} user
 * @param {string} pass
 * @param {string} host
 * @param {number} port
 * @param {string} db
 * @returns {string}
 */
const generateStringDatabaseConnection = (
  user: string,
  pass: string,
  host: string,
  port: number,
  db: string
) => {
  return `mysql://${user}:${pass}@${host}:${port}/${db}`;
};

// 6. Định nghĩa Server Plugin
export default defineNitroPlugin(async (nitroApp) => {
  // Chỉ chạy logic khởi tạo database khi server khởi động
  console.log("Tôi đã chạy nè bạn ơi!");

  if (!sequelizeInstance) {
    await initializeSequelize();
  }
});

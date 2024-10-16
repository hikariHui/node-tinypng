import config from "./config.json" with { type: "json" };
import tinify from "tinify";
import fs from "fs";
import path from "path";

// Set the API key
tinify.key = config.key;

// Validate the API key
try {
  await tinify.validate();
  console.log("Valid key");
} catch (error) {
  console.error("Invalid key");
  process.exit(1);
}

console.log(`当月已压缩次数: ${tinify.compressionCount}`);

/** 根路径 */
const rootPath = process.argv[2];
if (!rootPath) {
  console.error("请输入目录或文件！");
  process.exit(1);
}

// 检查路径是否存在或者是否是文件
if (!fs.existsSync(rootPath) && !fs.statSync(rootPath).isFile()) {
  console.error("路径不存在！");
  process.exit(1);
}

/** 检查路径是否为图片文件 */
function isImage(filePath) {
  const ext = filePath.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png"].includes(ext);
}

async function compressFromFile(originFile, targetPath, config = {}) {
  console.log(`当前压缩图片：${originFile}`);
  let source = tinify.fromFile(originFile);
  if (config.type) {
    source = source.convert({ type: config.type });
    if (config.type === "image/jpeg") {
      source = source.transform({ background: "black" });
    }
  }
  //  如果目标目录不存在，则创建目录
  if (!fs.existsSync(path.dirname(targetPath))) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  }
  return await source.toFile(targetPath);
}

if (fs.statSync(rootPath).isFile() && isImage(rootPath)) {
  // 如果是文件，且是图片文件
  // 目标文件名新增_tiny后缀
  const targetPath = rootPath.replace(/(\.\w+)$/, "_tiny$1");
  compressFromFile(rootPath, targetPath);
}

/** 递归压缩目录下的所有图片文件 */
function dfs(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    // 排除隐藏文件
    if (file.startsWith(".")) continue;
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      dfs(filePath);
    } else if (fs.statSync(filePath).isFile() && isImage(filePath)) {
      const targetPath = filePath.replace(rootPath, rootPath + "_tiny");
      compressFromFile(filePath, targetPath);
    }
  }
}

if (fs.statSync(rootPath).isDirectory()) {
  // 如果是目录
  dfs(rootPath);
}

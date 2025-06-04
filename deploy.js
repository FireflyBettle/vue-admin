/*
 * @Author: chenyourong
 * @Date: 2025-06-04 10:35:33
 * @LastEditors: chenyourong
 * @LastEditTime: 2025-06-04 18:29:53
 * @Description: 
 * @FilePath: /vue-admin-template-master/deploy.js
 */
const { NodeSSH } = require("node-ssh");
const path = require("path");

const ssh = new NodeSSH();
const localDir = path.join(__dirname, "dist"); // 本地dist目录
const remoteDir = "/www/server/web/dist"; // 服务器目标目录
const serverConfig = {
  host: "8.138.222.126",
  username: "root",
  // 选择一种认证方式（密码或私钥）：
  password: "", // 方式1：密码
  // privateKey: '/path/to/private_key.pem',    // 方式2：私钥路径
};

async function uploadDist() {
  try {
    console.log(" 正在连接服务器...");

    // 建立SSH连接
    await ssh.connect(serverConfig);

    console.log(" 连接成功，开始上传文件...");

    // 2. 清空目标目录（可选）
    await ssh.execCommand(`rm  -rf ${remoteDir}/*`, { cwd: "/" });

    // 上传整个dist文件夹
    const result = await ssh.putDirectory(localDir, remoteDir, {
      recursive: true, // 递归上传
      concurrency: 10, // 并发数
      tick: (localPath, remotePath, error) => {
        if (error) {
          console.error(` 上传失败: ${localPath}`);
        } else {
          console.log(` 上传成功: ${localPath} -> ${remotePath}`);
        }
      },
    });

    if (result) {
      console.log("✅  全部文件上传完成！");
    } else {
      console.error("❌  上传过程中出现错误");
    }
  } catch (err) {
    console.error(" 发生错误:", err.message);
  } finally {
    ssh.dispose(); // 关闭连接
  }
}

uploadDist();

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const {
  Api404Error,
  BaseError,
  BusinessLogicError,
  Api401Error,
  Api403Error,
} = require("../core/error.response");

class UploadFile {
  static async createFolderIfNotExist(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  static async uploadImage(pathImage, name, file) {
    const allowedFile = [".png", ".jpg", ".jpeg"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedFile.includes(fileExtension)) {
      throw new BusinessLogicError("Invalid file format", [], 500);
    }

    const userDir = path.join(__dirname, pathImage);

    this.createFolderIfNotExist(userDir);

    const uploadPath = path.join(userDir, `${name}${fileExtension}`);

    try {
      await sharp(file.buffer).toFile(uploadPath);
      return {
        image: `${name}${fileExtension}`,
        path: uploadPath,
      };
    } catch (err) {
      console.error("Error uploading file:", err);
      throw new BusinessLogicError("File upload failed", [], 500);
    }
  }

  static async deleteImage(pathImage, name) {
    const userDir = path.join(__dirname, pathImage, name);
    if (fs.existsSync(userDir)) {
      const stat = fs.statSync(userDir);
      if (stat.isDirectory()) {
        // Thêm xử lý nếu cần cho thư mục
      } else if (stat.isFile()) {
        fs.unlinkSync(userDir);
      }
    } else {
      console.log(`file not found: ${name}`);
    }
  }

  static async uploadAudio(pathAudio, name, file) {
    const allowedFile = [".mp3", ".wav", ".aac", ".flac"]; // Các định dạng âm thanh được phép
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Kiểm tra định dạng file
    if (!allowedFile.includes(fileExtension)) {
      throw new BusinessLogicError("Định dạng file không hợp lệ", [], 500);
    }

    const userDir = path.join(__dirname, pathAudio);

    // Tạo thư mục nếu chưa tồn tại
    await this.createFolderIfNotExist(userDir);

    const uploadPath = path.join(userDir, `${name}${fileExtension}`);

    try {
      // Lưu file vào đường dẫn
      await fs.promises.writeFile(uploadPath, file.buffer);
      return {
        audio: `${name}${fileExtension}`, // Tên file
        path: uploadPath, // Đường dẫn file
      };
    } catch (err) {
      console.error("Lỗi khi upload file:", err);
      throw new BusinessLogicError("Upload file thất bại", [], 500);
    }
  }

  static async uploadDocument(pathDocs, name, file) {
    const allowedFile = [".doc", ".docx", ".pdf", ".txt", ".odt", ".rtf", ".odp", ".pptx", ".ppt"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Kiểm tra định dạng file
    if (!allowedFile.includes(fileExtension)) {
      throw new BusinessLogicError("Định dạng file không hợp lệ", [], 500);
    }

    const userDir = path.join(__dirname, pathDocs);

    // Tạo thư mục nếu chưa tồn tại
    await this.createFolderIfNotExist(userDir);

    const uploadPath = path.join(userDir, `${name}${fileExtension}`);

    try {
      // Lưu file vào đường dẫn
      await fs.promises.writeFile(uploadPath, file.buffer);
      return {
        document: `${name}${fileExtension}`, // Tên file
        path: uploadPath, // Đường dẫn file
      };
    } catch (err) {
      console.error("Lỗi khi upload file:", err);
      throw new BusinessLogicError("Upload file thất bại", [], 500);
    }
  }
}
module.exports = UploadFile;
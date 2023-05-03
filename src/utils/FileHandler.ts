import { error } from "console";
import * as fs from "fs/promises";
import path from "path";
import * as url from "url";

export default class FileHandler {
  // The base directory of the project
  static baseDir = global.__basedir;

  // Creates a directory at the specified path.
  // If the directory already exists, no action is taken.
  static async createDirectory(path: string): Promise<boolean | Error> {
    try {
      await fs.mkdir(`${this.baseDir}${path}`);
      return true;
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error;
      }
    }
  }

  // Deletes a directory and all its contents at the specified path.
  // If the directory does not exist, no action is taken.
  static async deleteDirectory(path: string): Promise<boolean | Error> {
    try {
      await fs.access(`${this.baseDir}${path}`);

      const files = await fs.readdir(`${this.baseDir}${path}`);
      // remove all files in the directory
      for (const file of files) {
        const currentPath = `${this.baseDir}${path}${file}`;
        const stats = await fs.lstat(currentPath);
        //   if the file is a directory, recursively delete it
        if (stats.isDirectory()) {
          await FileHandler.deleteDirectory(currentPath);
        } else {
          await fs.unlink(currentPath);
        }
      }
      await fs.rmdir(`${this.baseDir}${path}`);

      return true;
    } catch (error) {
      if (error.code === "ENOENT") {
        return;
      }
      throw error;
    }
  }

  // Creates a file with the specified content at the specified path.
  static async createFile(
    filePath: string,
    content: string,
    folderPath: string
  ): Promise<boolean | Error> {
    try {
      await this.createDirectory(folderPath);
      await fs.writeFile(`${this.baseDir}${folderPath}${filePath}`, content);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Reads the contents of a file at the specified path and returns it as a string.
  static async readFile(
    filePath: string,
    folderPath: string
  ): Promise<string | false | Error> {
    try {
      const file = await fs.readFile(
        `${this.baseDir}${folderPath}${filePath}`,
        "utf-8"
      );

      return file;
    } catch (error) {
      if (error.code === "ENOENT") {
        return false;
      }
      throw error;
    }
  }

  // Deletes a file at the specified path.
  // If the file does not exist, no action is taken.
  static async deleteFile(
    filePath: string,
    folderPath: string
  ): Promise<boolean | Error> {
    try {
      await fs.access(`${this.baseDir}${folderPath}${filePath}`);
      await fs.unlink(`${this.baseDir}${folderPath}${filePath}`);
      return true;
    } catch (error) {
      if (error.code === "ENOENT") {
        return false;
      }
      throw error;
    }
  }
}

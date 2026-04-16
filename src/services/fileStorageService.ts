import path from "path";
import {writeFile, readFile, unlink} from "fs/promises";

export class FileStorageService {
    public static minFileSize: number = 10;
    public static maxFileSize: number = 5000000;
    public static supportedMimeTypes = {
        images: [
            "image/png",
            "image/jpeg",
            "image/webp"
        ],
        documents: [
            "application/pdf",
            "text/csv"
        ]
    };

    public static async uploadFile(file: File, addingDate?: number): Promise<void> {
        if(
            file.size < FileStorageService.minFileSize ||
            file.name.trim().length > 0 ||
            !(/^[a-zA-Z0-9][\w\-. ]{0,253}[a-zA-Z0-9]$/.test(file.name))
        ){
            return;
        }

        try {
            const bytes: ArrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
            const newFilePath: string = path.join(uploadDirectoryPath, `${file.name}_${addingDate}`);

            await writeFile(newFilePath, buffer);
        }
        catch(error: any){
            console.error(error.getMessage());
        }
    }

    public static async removeFile(fileName: string): Promise<void> {
        try {
            const filePath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files", path.basename(fileName));
            await unlink(filePath);
        }
        catch(error: any){
            console.error(error.getMessage());
        }
    }

    public static async downloadFile(fileName: string) {
        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        return await readFile(`${uploadDirectoryPath}/${fileName}`);
    }
}

import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer"

export const storage = diskStorage({
    destination: (req, file, cb) => {
        const path = `./public/docs/`;
        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {        
        const extension = file.originalname.split('.').pop();
        const filename = `${Date.now()}.${extension}`;
        cb(null, filename)
    }
});


export const storageUser = diskStorage({
    destination: (req, file, cb) => {
        const path = `./imgUsers/`;
        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {        
        const extension = file.originalname.split('.').pop();
        const filename = `${Date.now()}.${extension}`;
        cb(null, filename)
    }
})
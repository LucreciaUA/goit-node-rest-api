import multer from "multer";
import * as path from 'node:path'
import crypto from 'crypto'

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(process.cwd(), 'temp'))
    },
    filename(req, file, callback) {
        const extname = path.extname(file.originalname)
        const basename = path.basename(file.originalname, extname)
        const suffix = crypto.randomUUID()
        callback(null, `${basename}-${suffix}${extname}`)
    }
})

export default multer({storage: storage})
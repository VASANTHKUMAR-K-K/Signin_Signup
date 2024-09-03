
import express from 'express'
import { isAuth} from '../Middleware/isAuth.js';
import { uploadFiles } from '../Middleware/multer.js';
import { createProduct, deleteProduct, fetchAllProducts, fetchSingleProduct, updateStock } from '../Controllers/product.js';

const router = express.Router();
router.post("/product/new", isAuth, uploadFiles, createProduct)
router.get("/product/all-products", fetchAllProducts)
router.get("/product/singleproduct/:id", fetchSingleProduct)
router.delete("/product/delete/:id",isAuth, deleteProduct)
router.put("/product/:id",isAuth, updateStock)  //give loing token in header and update in body stock value


export default router;
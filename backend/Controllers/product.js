import { Product } from '../Models/Product.js';
import { rm } from 'fs'

//ADD NEW PRODUCTS
export const createProduct = async (req, res) =>{
    try {
        //CHECK USER IS ADMIL OR NOT
        if(req.User.role !=="admin"){
            return res.status(403).json({
                message: "Unauthorized Access",
            });
        }

        const{ title, description, category, price, stock}=req.body;
        const image = req.file;
        if(!image){
            return res.status(400).json({
                message: "Please Select an Image",
            });
        }

        //STORE TO DB

        const product = await Product.create({
            title,
            description,
            category,
            price,
            stock,
            image : image?.path,
        });
        res.status(200).json({
            message: "Product details added success",
            product,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

// FETCH ALL PRODUCTS

export const fetchAllProducts = async (req, res) => {
    try {
        const product = await Product.find();
        return res.status(200).json({message: "list of products", product});
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        })
    }
}

//FETCH SINGLE PRODUCT
export const fetchSingleProduct = async (req, res) => {
    try {
        const id=req.params.id;
        const product = await Product.findById(id);
        return res.status(200).json({message: "Product Details", product});
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        })
    }
}

// DELETE PRODUCTS

export const deleteProduct = async (req, res) =>{
   try {
    if( req.User.role != "admin"){
        return res.status(403).json({
            message:"Unauthorized Access",
        });
    }

const product= await Product.findById(req.params.id)
if(!product){
    return res.send(403).json({
        message: "Invalid Product Details",
    })
}
    rm(product.image,()=>{
        console.log("Image Delected")
    })

    await product.deleteOne();
    return res.json({
        message: "Product Details Deleted Success",
    })
   } catch (error) {
    res.send(500).json({
        message: error.message
    })
   }

}

//UPDATE STOCK DETAILS

export const updateStock = async (req, res) => {
    try {
        const product =await Product.findById(req.params.id);
        if(req.User.role !=="admin"){
            return res.status(403).json({
                message: "Unauthorized Access",
            });
        }

        if(!product){
            return res.status(403).json({
                message: "Invalid product details",
            });
        }

        if(req.body.stock){
            product.stock=req.body.stock;
            await product.save()
            return res.json({
                message:"Stock Updated",
            })
        }
        return res.status(403).json({
            message: "Please enter stock value",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
        
    }
}
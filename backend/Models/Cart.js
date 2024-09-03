import mongoose from "mongoose";
import { Product } from "./Product";


const schema = mongoose.Schema({
    Product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        require: true,
    },
    quantity: {
        type: Number,
        require:true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true,

    },
});

export const Cart = mongoose.Cart("Cart", schema);
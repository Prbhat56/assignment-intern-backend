const express=require("express");
const dbConnect = require("./config/db");
const dotenv=require("dotenv").config();
const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const deleteRoutes=require("./routes/deleteRoutes");
const getRoutes=require("./routes/getUserRoutes");
const updateRoutes=require("./routes/updateRoutes");
const profileRoutes=require("./routes/profileRoutes");


const app=express();
app.use(express.json());
dbConnect();
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/delete",deleteRoutes);
app.use("/api/get",getRoutes);
app.use("/api/update",updateRoutes);
app.use("/api/profilelist",profileRoutes);
const PORT=process.env.PORT||3002;
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
})
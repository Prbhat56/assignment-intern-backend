const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");



const register=async(req,res)=>{
try {
    const {username,password,role,email}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=new User({username,password:hashedPassword,role,email});
    await newUser.save();
    res.status(201).json({message:`user registered with username ${username}`});
} catch (error) {
    res.status(500).json({message:"Something went wrong"});
}

};
const login = async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user){
            return res.status(404).json({message:`user with ${username} not found`});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credential"});
        }
        const token = jwt.sign(
            { id: user._id, role: user.role, username: username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        res.status(200).json({token,user});
    } catch (error) {
        res.status(500).json({message:"error occured"});
    }
};
module.exports={
    register,
    login,
};
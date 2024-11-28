const express=require("express");
const verifyToken=require("../middleware/authMiddleware");
const authorizedRoles=require("../middleware/roleMiddleware");
const router=express.Router();
router.get("/admin",verifyToken,authorizedRoles("admin"),(req,res)=>{
    res.json({message:"Welcome admin"});
});

router.get("/manager",verifyToken,authorizedRoles("admin","manager"),(req,res)=>{
    res.json({message:"Welcome manager"});
});

router.get("/user",verifyToken,authorizedRoles("admin","manager","user"),(req,res)=>{
    res.json({message:"Welcome  user"});
});

module.exports=router;

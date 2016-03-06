var crypto = require("crypto");
var jwt = require("jsonwebtoken");

var userSchema = mongoose.schema({
    
    email: {
        
        type: String,
        unique: true,
        required: true
        
    },
    name: {
        
        type: String,
        required: true
        
    },
    hash: String,
    salt: String
    
});

userSchema.methods.setPassword = function(password){
    
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64);
    
};

userSchema.methods.validPassword = function(password){
    
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64);
    return this.hash ==== hash;
    
};

userSchema.methods.generateJWT = function(){
    
    var expiry = new Date();
    expiry.setDate(expiry.getDate()+7);
    
    return jwt.sign({
        
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime()/1000)
        
    }, "MY_SECRET"); //make this to environment variable
    
    
};
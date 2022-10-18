import passport from 'passport';
import userModel from '../../models/user.js';
import { GenerateToken } from "../../utils/index.js";

export function processLogin(req, res, next){
    passport.authenticate('local', (err, user, info) => {
        // are there any server errors?
        if(err){
            console.error(err);
            res.end(err);
        }
        // are there any login errors?
        if(!user){
            return res.json({success: false, msg: 'ERROR: Authentication Failed'})
        }
        // no problem - we have good username and password
        req.logIn(user, (err) => {
            // are there any db erros?
            if (err){
                console.error(err);
                res.end(err);
            }
            const authToken = GenerateToken(user);

            return res.json({
                success: true,
                msg: 'User logged in successfully',
                user: {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    emailAddress: user.emailAddress
                },
                token: authToken
            })
        })
    })(req, res, next);
};

export function processRegistration(req, res, next){
    // instantiate a new user object
    let newUser = new userModel({
        ...req.body //javascript destructing
    });

    userModel.register(newUser, req.body.password, (err) => {
        // error validation
        if (err){
            if(err.name === 'UserExistsError'){
                console.error('ERROR: User Already Exists!')
            }
            console.log(err);

            return res.json({success: false, msg: 'ERROR: Registration Failed!'});
        }
        // all ok - user has been registered
        return res.json({success: true, msg: 'User Registered Successfully'});
    })
}

export function processLogout(req, res, next){
    req.logOut((err) => {
        if(err){
            console.error(err);
            res.end(err);
        }
        console.log('User Logged Out');
    });
    res.json({success: true, msg: 'User logged out successfully'});
}
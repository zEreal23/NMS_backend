exports.userSignupValidator = (req , res , next) =>{
    req.check('name', ' Name is required').notEmpty()
    req.check('email', '3 to 32 charracters').matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        })
        req.check('password', ' Password is required').notEmpty()
        req.check('password')
            .isLength({
                min:6
            })
            .withMessage('least 6 characters')
            .matches(/\d/)
            .withMessage('Password must be number')
            const erros = req.validationErrors()
            if(erros) {
                const firstError = erros.map(error => error.msg)[0];
                return res.status(400).json({error: firstError})
            }
            next();
}

exports.userSigninValidator = (req , res , next) =>{
    req.check('email', '3 to 32 charracters').matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        })
        req.check('password', ' Password is required').notEmpty()
        req.check('password')
            .isLength({
                min:6
            })
            .withMessage('least 6 characters')
            .matches(/\d/)
            .withMessage('Password must be number')
            const erros = req.validationErrors()
            if(erros) {
                const firstError = erros.map(error => error.msg)[0];
                return res.status(400).json({error: firstError})
            }
            next();
}
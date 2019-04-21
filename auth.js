
module.exports = {
    'facebookAuth' : {
        'clientID' : process.env.CLIENT_ID,
        'clientSecret': process.env.SECRET,
        'callbackURL': 'http://localhost:3000/auth/facebook/callback'
    }
}
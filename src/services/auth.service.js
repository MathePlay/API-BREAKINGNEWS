import User from '../models/User.js'

const loginService = (email) => User.findOne({email}).select("+password")


export default loginService
import User from './user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'

export const updateUser = async (req, res) => {
    try {
        const { name, surname, username, email, phone } = req.body
        if (!name && !surname && !username && !email && !phone) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Information needed' 
                }
            )
        }
        const user = await User.findById(req.user.uid)
        if (!user) return res.status(404).send(
            {
                success: false,
                message: 'User not found' 
            }
        )
        if (name) user.name = name
        if (surname) user.surname = surname
        if (username) user.username = username
        if (email) user.email = email
        if (phone) user.phone = phone
        await user.save();
        res.send(
            {
                success: true,
                message: 'Profile updated successfully', user 
            }
        )
    } catch (error) {
        console.error('Error updating user profile:', error)
        res.status(500).send(
            {
                success: false,
                message: 'General Error' 
            }
        )
    }
}

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.uid
        const { oldPassword, newPassword } = req.body
        const user = await User.findById(userId)
        if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User not found"
                }
            )
        }
        const isPasswordCorrect = await checkPassword(user.password, oldPassword)
        if (!isPasswordCorrect) {
            return res.status(400).send(
                { 
                    message: 'Wrong old password' 
                }
            )
        }
        user.password = await encrypt(newPassword)
        await user.save()
        return res.send(
            {
                success: true,
                message: "Password updated successfully"
            }
        )
    } catch (err) {
            return res.status(500).send(
            {
                success: false,
                message: "General error",
                error: err.message || err
            }
        )
    }
}


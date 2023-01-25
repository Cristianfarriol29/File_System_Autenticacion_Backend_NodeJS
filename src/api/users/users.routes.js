const UserRoutes = require('express').Router();
const multer = require('multer');

// Crea una instancia de multer
const upload = require('../../middlewares/updateFile.middleware')
const { isAuth } = require('../../middlewares/auth.middleware');
const { register, login, logout, confirm, forgotPassword, verifyToken, newPassword, verifyAdminByEmail, filesToVerify, changeFilesStatus} = require('./users.controllers');

UserRoutes.post('/register', register);
UserRoutes.post('/login', login);
UserRoutes.get("/confirmar-usuario/:token", confirm);
UserRoutes.post("/olvide-password", forgotPassword);
UserRoutes.get("/olvide-password/:token", verifyToken);
UserRoutes.post("/nuevo-password/:token", newPassword);
UserRoutes.get("/verify-admin/:token", verifyAdminByEmail);
UserRoutes.post('/file-to-verify', filesToVerify);
UserRoutes.post('/change-file-status', changeFilesStatus);
UserRoutes.get('/logout/:token',  logout);

module.exports = UserRoutes;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const userController_1 = require("../controller/userController");
exports.router.route('/followUnfollow/:id').post(userController_1.followUnfollowUser);
exports.router.route('/findById').post(userController_1.findUserById);
exports.router.route('/myFollowings').get(userController_1.getMyFollowings);
exports.router.route('/myFollowers').get(userController_1.getMyFollowers);
exports.router.route('/updateUser').patch(userController_1.updateUser);
exports.router.route('/changePassword').patch(userController_1.changePassword);
exports.router.get('/protectedCheck', (req, res) => {
    res.send('protected running');
});

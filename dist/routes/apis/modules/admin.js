"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var multer_1 = __importDefault(require("../../../middlewares/multer"));
var admin_controller_1 = __importDefault(require("../../../controllers/apis/admin-controller"));
router.get('/stores', admin_controller_1.default.getStores);
router.post('/stores', multer_1.default.single('cover'), admin_controller_1.default.postStore);
router.get('/stores/:id', admin_controller_1.default.getStore);
router.put('/stores/:id', multer_1.default.single('cover'), admin_controller_1.default.putStore);
router.delete('/stores/:id', admin_controller_1.default.deleteStore);
router.post('/ownership/:drinkId', admin_controller_1.default.addOwnership);
router.delete('/ownership/:drinkId', admin_controller_1.default.removeOwnership);
router.get('/users', admin_controller_1.default.getUsers);
router.patch('/users/:id', admin_controller_1.default.patchUser);
router.get('/orders', admin_controller_1.default.getOrders);
router.delete('/orders/:orderId', admin_controller_1.default.deleteOrder);
exports.default = router;

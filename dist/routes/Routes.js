"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Routes = /** @class */ (function () {
    function Routes() {
        this.router = express_1.default.Router();
        this.setUpUserRoutes();
    }
    Routes.prototype.setUpUserRoutes = function () {
        // root
        this.router.get("/", function (req, res) {
            res.render("home");
        });
        // show form
        this.router.get("/form", function (req, res) {
            res.render("form");
        });
    }; // end of setUpUserRoutes
    return Routes;
}());
exports.default = new Routes().router;
//# sourceMappingURL=Routes.js.map
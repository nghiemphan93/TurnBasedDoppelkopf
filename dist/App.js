"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = __importStar(require("body-parser"));
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var Routes_1 = __importDefault(require("./routes/Routes"));
var MainTest_1 = __importDefault(require("./doppelKopf/MainTest"));
var App = /** @class */ (function () {
    function App() {
        this.userSocketIDList = [];
        this.userNameList = [];
        this.app = express_1.default();
        this.config();
        this.listenSocketEvents();
        this.simulateTurnBased();
    }
    App.prototype.config = function () {
        this.listenPort();
        this.io = socket_io_1.default(this.server);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express_1.default.static("public"));
        this.app.use(express_1.default.static("dist/public"));
        this.app.set("view engine", "ejs");
        this.app.use(Routes_1.default);
    };
    App.prototype.listenPort = function () {
        var _this = this;
        // setup PORT
        this.PORT = process.env.PORT || 3000;
        this.server = this.app.listen(this.PORT, function () {
            console.log("Server started at port " + _this.PORT);
        });
    }; // end of listenPort
    /**
     * Listen to socket events from clients
     */
    App.prototype.listenSocketEvents = function () {
        var _this = this;
        // listen when connected
        this.io.on("connection", function (clientSocket) {
            console.log(clientSocket.id + " made socket connection ");
            console.log(_this.userSocketIDList.length + " register");
            console.log("\n");
            // listen to register player's name
            clientSocket.on("register", function (data) {
                var index = _this.userNameList.indexOf(data.userName);
                if (index >= 0) {
                    // if name existed
                    console.log(data.userName + " replace");
                    _this.userSocketIDList.splice(index, 1, clientSocket.id);
                    console.log(_this.userNameList);
                    console.log(_this.userSocketIDList);
                    console.log();
                }
                else {
                    // if name not yet exited
                    console.log("Welcome " + data.userName);
                    _this.userSocketIDList.push(clientSocket.id);
                    _this.userNameList.push(data.userName);
                    console.log(_this.userNameList);
                    console.log(_this.userSocketIDList);
                    console.log();
                }
                // enable next turn button for the first Client
                index = _this.userSocketIDList.indexOf(clientSocket.id);
                console.log(index);
                if (index == 0) {
                    clientSocket.emit("enableNextTurnBtn", {});
                }
                // check if there's already 4 players
                if (_this.userNameList.length == 4) {
                    _this.io.sockets.emit("startGame", { message: "game started ♥10" });
                    var main = new MainTest_1.default();
                }
            }); // end of register
            // listen when played a card
            clientSocket.on("nextTurn", function (data) {
                var index = _this.userSocketIDList.indexOf(clientSocket.id);
                _this.nextPlayer(index);
            }); // end of card played
            // listen when disconnected
            clientSocket.on("disconnect", function () {
                var index = _this.userSocketIDList.indexOf(clientSocket.id);
                console.log(_this.userSocketIDList[index + 1] + " disconnected");
                _this.userSocketIDList.splice(index, 2);
                console.log("\n");
            }); // end of disconnected
        });
    }; // end of listenSocketEvents
    // simulate turn based
    App.prototype.simulateTurnBased = function () {
        // setInterval(() => {
        //    console.log("hello");
        //    this.io.sockets.emit("yourTurn", {message: "your turn"});
        // }, 2000);
    };
    // next player logic
    App.prototype.nextPlayer = function (index) {
        if (index < this.userSocketIDList.length - 1) {
            var nextPlayerID = this.userSocketIDList[index + 1];
            this.io.to(nextPlayerID).emit("yourTurn", { message: "your turn" });
        }
        else {
            var nextPlayerID = this.userSocketIDList[0];
            this.io.to(nextPlayerID).emit("yourTurn", { message: "your turn" });
        }
    }; // end of nextPlayer
    return App;
}());
exports.default = App;
//# sourceMappingURL=App.js.map
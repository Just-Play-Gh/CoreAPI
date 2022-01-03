"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    console.log('ENV VARSS');
    console.log(process.env.DB_PORT);
    console.log('ENV VARSS END');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.setGlobalPrefix('/api/v1');
    app.enableCors();
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map
import { BaseController } from '../resources/base.controller';
import { RoleService } from './role.service';
export declare class RoleController extends BaseController {
    private readonly rolesService;
    constructor(rolesService: RoleService);
    getMe(): Promise<string>;
}

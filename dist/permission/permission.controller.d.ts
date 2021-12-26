import { BaseController } from '../resources/base.controller';
import { AssignPermissionToRoleDto } from './dto/assign-role.dto';
import { PermissionService } from './permission.service';
export declare class PermissionController extends BaseController {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    assignRoleToUser(body: AssignPermissionToRoleDto): Promise<import("../role/entity/role.entity").Role>;
}

import { BaseService } from '../resources/base.service';
import { Role } from '../role/entity/role.entity';
import { AssignPermissionToRoleDto } from './dto/assign-role.dto';
export declare class PermissionService extends BaseService {
    constructor();
    assignPermissionToRole(body: AssignPermissionToRoleDto): Promise<Role>;
    hasPermission(permission: string): Promise<boolean>;
    hasAnyPermission(permission: string[]): Promise<void>;
}

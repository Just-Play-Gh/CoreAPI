import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/resources/base.service';
import { Role } from 'src/role/entity/role.entity';
import { getConnection, getRepository, In } from 'typeorm';
import { AssignPermissionToRoleDto } from './dto/assign-role.dto';
import { Permission } from './entity/permission.entity';

@Injectable()
export class PermissionService extends BaseService {
  constructor() {
    super(Permission);
  }

  async assignPermissionToRole(body: AssignPermissionToRoleDto) {
    const { permissionId, roleId } = body;
    const permissions = getRepository(Permission).find({
      where: { id: In([2, 3]) },
    });
    const role = await Role.findOne(
      { id: roleId },
      { relations: ['permissions'] },
    );
    console.log(permissions);
    // role.permissions.push(permissions);
    // await getRepository(Role).save(role);
    // const data = await getConnection()
    //   .createQueryBuilder()
    //   .relation(Role, 'permissions')
    //   .of(role)
    //   .add(permission);
  }
}

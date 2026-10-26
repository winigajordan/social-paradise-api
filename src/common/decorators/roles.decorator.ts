import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/user/enum/user-role.enum';

export const ROLES_KEY = 'roles';

// Rôles autorisés sur une route. Sans ce décorateur, seule une route @Public()
// échappe à la règle par défaut : ADMIN uniquement.
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

import usePermissionMatrix from '@/composables/authenticate/usePermissionMatrix';
import type { RoleSymfony } from 'open-api-espace-partenaire-souscription-typescript';
import useIasAndRole from './useIasAndRole';

export default function () {
  const { permissionMatrix } = usePermissionMatrix();
  const { roleStore } = useIasAndRole();

  const doesHavePermission = (roles: RoleSymfony[]): boolean => {
    return roles.includes(roleStore.value);
  };

  const doesHavePermissionAmongRoleBoker = (): boolean => {
    return permissionMatrix.onlyBrokerRole.includes(roleStore.value);
  };

  const doesHavePermissionAmongRoleDelegate = (): boolean => {
    return permissionMatrix.onlyDelegateRole.includes(roleStore.value);
  };

  const doesHavePermissionAmongAllRolesButBroker = (): boolean => {
    return permissionMatrix.allRolesButBroker.includes(roleStore.value);
  };

  const doesHavePermissionAmongAllRolesButConsultation = (): boolean => {
    return permissionMatrix.allRolesButConsultation.includes(roleStore.value);
  };

  const doesHavePermissionAmongAllRolesButBrokerAndConsultation = (): boolean => {
    return permissionMatrix.allRolesButBrokerAndConsultation.includes(roleStore.value);
  };

  const doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate = (): boolean => {
    return permissionMatrix.allRolesButBrokerAndConsultationAndDelegate.includes(roleStore.value);
  };

  return {
    doesHavePermission,
    doesHavePermissionAmongRoleBoker,
    doesHavePermissionAmongAllRolesButBroker,
    doesHavePermissionAmongAllRolesButConsultation,
    doesHavePermissionAmongAllRolesButBrokerAndConsultation,
    doesHavePermissionAmongAllRolesButBrokerAndConsultationAndDelegate,
    doesHavePermissionAmongRoleDelegate
  };
}

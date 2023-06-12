import { RoleSymfony } from 'open-api-espace-partenaire-souscription-typescript';

interface IPermissionMatrix {
  [key: string]: RoleSymfony[];
}

export default function () {
  const roleBroker: RoleSymfony = RoleSymfony.Courtier;
  const roleConsultation: RoleSymfony = RoleSymfony.Consultation;
  const roleDelegate: RoleSymfony = RoleSymfony.Delegue;
  const roleAdmin: RoleSymfony = RoleSymfony.Admin;
  const roleTechnicalManagement: RoleSymfony = RoleSymfony.DirTech;

  const permissionMatrix: IPermissionMatrix = {
    allRoles: [roleBroker, roleDelegate, roleTechnicalManagement, roleAdmin, roleConsultation],
    onlyBrokerRole: [roleBroker],
    onlyDelegateRole: [roleDelegate],
    allRolesButBroker: [roleDelegate, roleTechnicalManagement, roleAdmin, roleConsultation],
    allRolesButConsultation: [roleBroker, roleDelegate, roleTechnicalManagement, roleAdmin],
    allRolesButBrokerAndConsultation: [roleDelegate, roleTechnicalManagement, roleAdmin],
    allRolesButBrokerAndConsultationAndDelegate: [roleTechnicalManagement, roleAdmin]
  };

  return {
    roles: { roleBroker, roleConsultation, roleDelegate, roleAdmin, roleTechnicalManagement },
    permissionMatrix
  };
}

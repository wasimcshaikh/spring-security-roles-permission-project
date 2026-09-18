package medislot_provider_verification.service;

import medislot_provider_verification.dto.PermissionResponse;
import medislot_provider_verification.dto.RoleResponse;
import medislot_provider_verification.dto.UpdateRolePermissionsRequest;

import java.util.List;

public interface RolePermissionManagementService {

    List<RoleResponse> getAllRoles();

    List<PermissionResponse> getAllPermissions();

    List<PermissionResponse> getPermissionsByRole(Long roleId);

    void updateRolePermissions(
            Long roleId,
            UpdateRolePermissionsRequest request
    );
}
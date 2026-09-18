package medislot_provider_verification.service;

import lombok.RequiredArgsConstructor;
import medislot_provider_verification.dto.PermissionResponse;
import medislot_provider_verification.dto.RoleResponse;
import medislot_provider_verification.dto.UpdateRolePermissionsRequest;
import medislot_provider_verification.entity.Permission;
import medislot_provider_verification.entity.RoleEntity;
import medislot_provider_verification.entity.RolePermission;
import medislot_provider_verification.entity.RolePermissionId;
import medislot_provider_verification.repository.PermissionRepository;
import medislot_provider_verification.repository.RolePermissionRepository;
import medislot_provider_verification.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolePermissionManagementServiceImpl
        implements RolePermissionManagementService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {

        return roleRepository.findAll()
                .stream()
                .map(role -> RoleResponse.builder()
                        .id(role.getId())
                        .name(role.getName())
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {

        return permissionRepository.findAll()
                .stream()
                .map(permission -> PermissionResponse.builder()
                        .id(permission.getId())
                        .name(permission.getName())
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getPermissionsByRole(Long roleId) {

        roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new RuntimeException("Role not found with id: " + roleId));

        return rolePermissionRepository.findByRoleId(roleId)
                .stream()
                .map(RolePermission::getPermission)
                .map(permission -> PermissionResponse.builder()
                        .id(permission.getId())
                        .name(permission.getName())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public void updateRolePermissions(
            Long roleId,
            UpdateRolePermissionsRequest request) {

        RoleEntity role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new RuntimeException("Role not found with id: " + roleId));

        List<Long> permissionIds = request.getPermissionIds();

        List<RolePermission> existingPermissions =
                rolePermissionRepository.findByRoleId(roleId);

        rolePermissionRepository.deleteAll(existingPermissions);

        if (permissionIds == null || permissionIds.isEmpty()) {
            return;
        }

        List<RolePermission> newPermissions = permissionIds.stream()
                .distinct()
                .map(permissionId -> {

                    Permission permission =
                            permissionRepository.findById(permissionId)
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Permission not found with id: "
                                                            + permissionId));

                    RolePermissionId id =
                            new RolePermissionId(
                                    role.getId(),
                                    permission.getId()
                            );

                    return RolePermission.builder()
                            .id(id)
                            .role(role)
                            .permission(permission)
                            .build();
                })
                .toList();

        rolePermissionRepository.saveAll(newPermissions);
    }
}
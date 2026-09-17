package medislot_provider_verification.service;

import lombok.RequiredArgsConstructor;
import medislot_provider_verification.entity.RoleEntity;
import medislot_provider_verification.entity.RolePermission;
import medislot_provider_verification.repository.RolePermissionRepository;
import medislot_provider_verification.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl
        implements PermissionService {

    private final RoleRepository roleRepository;

    private final RolePermissionRepository
            rolePermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public Set<String> getPermissionsForRole(
            String roleName) {

        RoleEntity role =
                roleRepository
                        .findByName(roleName)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Role not found: " + roleName
                                )
                        );

        return rolePermissionRepository
                .findByRoleId(role.getId())
                .stream()
                .map(RolePermission::getPermission)
                .map(permission -> permission.getName())
                .collect(Collectors.toSet());
    }
}
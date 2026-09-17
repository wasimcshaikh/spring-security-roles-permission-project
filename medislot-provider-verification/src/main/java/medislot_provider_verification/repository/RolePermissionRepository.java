package medislot_provider_verification.repository;

import medislot_provider_verification.entity.RolePermission;
import medislot_provider_verification.entity.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RolePermissionRepository
        extends JpaRepository<
        RolePermission,
        RolePermissionId> {

    List<RolePermission> findByRoleId(Long roleId);
}
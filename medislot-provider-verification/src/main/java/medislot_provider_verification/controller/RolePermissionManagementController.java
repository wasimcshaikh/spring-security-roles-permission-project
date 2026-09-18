package medislot_provider_verification.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import medislot_provider_verification.dto.PermissionResponse;
import medislot_provider_verification.dto.RoleResponse;
import medislot_provider_verification.dto.UpdateRolePermissionsRequest;
import medislot_provider_verification.service.RolePermissionManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class RolePermissionManagementController {

    private final RolePermissionManagementService
            rolePermissionManagementService;

    @GetMapping("/roles")
    public ResponseEntity<List<RoleResponse>> getAllRoles() {

        return ResponseEntity.ok(
                rolePermissionManagementService.getAllRoles()
        );
    }

    @GetMapping("/permissions")
    public ResponseEntity<List<PermissionResponse>> getAllPermissions() {

        return ResponseEntity.ok(
                rolePermissionManagementService.getAllPermissions()
        );
    }

    @GetMapping("/roles/{roleId}/permissions")
    public ResponseEntity<List<PermissionResponse>>
    getPermissionsByRole(@PathVariable Long roleId) {

        return ResponseEntity.ok(
                rolePermissionManagementService
                        .getPermissionsByRole(roleId)
        );
    }

    @PutMapping("/roles/{roleId}/permissions")
    public ResponseEntity<String> updateRolePermissions(
            @PathVariable Long roleId,
            @Valid @RequestBody UpdateRolePermissionsRequest request) {

        rolePermissionManagementService
                .updateRolePermissions(roleId, request);

        return ResponseEntity.ok(
                "Role permissions updated successfully"
        );
    }
}
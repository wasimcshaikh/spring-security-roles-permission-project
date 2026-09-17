package medislot_provider_verification.service;

import java.util.Set;

public interface PermissionService {

    Set<String> getPermissionsForRole(String roleName);
}
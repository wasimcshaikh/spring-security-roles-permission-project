package medislot_provider_verification.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateRolePermissionsRequest {

    @NotNull(message = "Permission IDs are required")
    private List<Long> permissionIds;
}
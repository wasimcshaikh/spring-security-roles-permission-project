package medislot_provider_verification.exception;

public class AssessmentAlreadyAssignedException
        extends RuntimeException {

    public AssessmentAlreadyAssignedException(String message) {
        super(message);
    }
}
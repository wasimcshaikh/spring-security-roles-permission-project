package medislot_provider_verification.exception;

public class AssessmentFileRequiredException
        extends RuntimeException {

    public AssessmentFileRequiredException(
            String message) {

        super(message);
    }
}
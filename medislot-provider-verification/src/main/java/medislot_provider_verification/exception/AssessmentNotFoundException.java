package medislot_provider_verification.exception;

public class AssessmentNotFoundException
        extends RuntimeException {

    public AssessmentNotFoundException(
            String message) {

        super(message);
    }
}
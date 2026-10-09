package medislot_provider_verification.exception;

public class CustomerAlreadyExistsException
        extends RuntimeException {

    public CustomerAlreadyExistsException(String message) {
        super(message);
    }
}
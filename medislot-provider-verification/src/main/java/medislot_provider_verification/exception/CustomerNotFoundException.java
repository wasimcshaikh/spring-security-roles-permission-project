package medislot_provider_verification.exception;

public class CustomerNotFoundException
        extends RuntimeException {

    public CustomerNotFoundException(String message) {
        super(message);
    }
}
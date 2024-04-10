package com.example.Pizzeriabackend.exception;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.security.access.AccessDeniedException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(CustomExceptionHandler.class);

    @ExceptionHandler(GeneralBadRequestException.class)
    protected ResponseEntity<Object> handleGeneralBadRequestException(GeneralBadRequestException exception) {
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST,
                exception.getInternalAppCode()
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(GeneralNotFoundException.class)
    protected ResponseEntity<Object> handleGeneralNotFoundException(GeneralNotFoundException exception) {
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.NOT_FOUND
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NoUserPermissionException.class)
    protected ResponseEntity<Object> handleNoUserPermissionException(NoUserPermissionException exception) {
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.UNAUTHORIZED
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(DateParsingException.class)
    protected ResponseEntity<Object> handleDateParsingException(DateParsingException exception) {
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(GeneralServerException.class)
    protected ResponseEntity<Object> handleGeneralServerException(GeneralServerException exception) {
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // authentication & authentication errors ------------------------------------------------

    // This exception to be raised and handled requires usage of @Secured annotation which raises this exception
    // In case of URL-based authentication - only 403 response status is being returned (no exception thrown)
    // This exception cannot normally happen with well-designed Frontend application
    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<Object> handleAccessDeniedExceptionException(AccessDeniedException exception) {
        logger.error("AccessDeniedException");
        logger.error(exception.toString());
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                "Requester doesn't have permission to access this endpoint",
                HttpStatus.FORBIDDEN,
                InternalAppCode.NO_PERMISSION
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(BadCredentialsException.class)
    protected ResponseEntity<Object> handleBadCredentialsExceptionException(BadCredentialsException exception) {
        logger.error("BadCredentialsException");
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.UNAUTHORIZED,
                InternalAppCode.BAD_CREDENTIALS
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SignatureException.class)
    protected ResponseEntity<Object> handleSignatureException(SignatureException exception) {
        logger.error("SignatureException");
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.FORBIDDEN,
                InternalAppCode.BAD_ACCESS_TOKEN
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    protected ResponseEntity<Object> handleExpiredJwtException(ExpiredJwtException exception) {
        logger.error("ExpiredJwtException");
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.FORBIDDEN,
                InternalAppCode.ACCESS_TOKEN_EXPIRED
        );

        System.out.println(exceptionDetails);
        return new ResponseEntity<>(exceptionDetails, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MalformedJwtException.class)
    protected ResponseEntity<Object> handleMalformedJwtException(MalformedJwtException exception) {
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.FORBIDDEN,
                InternalAppCode.BAD_ACCESS_TOKEN
        );

        System.out.println(exceptionDetails);
        return new ResponseEntity<>(exceptionDetails, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(RefreshTokenException.class)
    protected ResponseEntity<Object> handleRefreshTokenException(RefreshTokenException exception) {
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.FORBIDDEN,
                exception.getInternalAppCode()
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.FORBIDDEN);
    }
    // END authentication & authentication errors ------------------------------------------------

    @ExceptionHandler(GeneralEventException.class)
    protected ResponseEntity<Object> handleGeneralEventException(GeneralEventException exception) {
        ApiExceptionDetails exceptionDetails = new ApiExceptionDetails(
                exception.getMessage(),
                HttpStatus.FORBIDDEN,
                exception.getInternalAppCode()
        );
        return new ResponseEntity<>(exceptionDetails, HttpStatus.FORBIDDEN);
    }

}

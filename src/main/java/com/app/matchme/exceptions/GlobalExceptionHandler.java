package com.app.matchme.exceptions;

import com.app.matchme.dtos.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({BusinessException.class})
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException exception) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(exception.getMessage(), null));
    }
    @ExceptionHandler({RepositoryException.class})
    public ResponseEntity<ApiResponse<Void>> handleRepositoryException(RepositoryException exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(exception.getMessage(), null));
    }
    @ExceptionHandler({AuthorizationDeniedException.class, AccessDeniedException.class})
    public ResponseEntity<ApiResponse<Void>> handleAuthorizationException(Exception exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>("Resource not found", null));
    }
    @ExceptionHandler({AuthenticationException.class})
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(Exception exception) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>("Authentication failed", null));
    }
    @ExceptionHandler({RuntimeException.class})
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException exception) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(exception.getMessage(), null));
    }
}

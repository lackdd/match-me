package com.app.matchme.exceptions;

public class BusinessException extends RuntimeException{
    public BusinessException(String msg) {
        super(msg);
    }

    public BusinessException(String msg, Throwable cause) {
        super(msg, cause);
    }
}

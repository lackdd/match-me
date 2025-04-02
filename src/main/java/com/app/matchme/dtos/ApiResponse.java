package com.app.matchme.dtos;

public record ApiResponse<T> (String message, T payload) {
    public ApiResponse(String message, T payload) {
        this.message = message;
        this.payload = payload;
    }

    public ApiResponse(String message) {
        this(message, null);
    }
}

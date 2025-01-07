package com.app.matchme.services;

import com.app.matchme.entities.Client;
import com.app.matchme.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    @Autowired
    private ClientRepository repo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Client register(Client user){
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }
}

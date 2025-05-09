// UsuarioRepository.java
package com.consultoriomedico.repository;

import com.consultoriomedico.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);
}
// Usuario.java
package com.consultoriomedico.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String email;
    private String password;
    
    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;
    
    private String telefono;
    private String direccion;
    
    @Column(name = "fecha_registro", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaRegistro;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = new Date();
    }
}
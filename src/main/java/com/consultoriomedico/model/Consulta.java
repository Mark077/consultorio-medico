// Consulta.java
package com.consultoriomedico.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
@Table(name = "consultas")
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    
    @Column(name = "fecha_solicitud", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaSolicitud;
    
    @Column(name = "fecha_consulta", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaConsulta;
    
    private String motivo;
    private String estado;
    private String notas;
    
    @PrePersist
    protected void onCreate() {
        fechaSolicitud = new Date();
        if (estado == null) {
            estado = "pendiente";
        }
    }
}
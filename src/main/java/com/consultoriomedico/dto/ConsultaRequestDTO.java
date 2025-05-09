@Data
public class ConsultaRequest {
    @NotBlank(message = "El email del paciente es requerido")
    @Email(message = "El email debe ser válido")
    private String pacienteEmail;
    
    @NotNull(message = "El doctor es requerido")
    private Long doctorId;
    
    @Future(message = "La fecha debe ser futura")
    @NotNull(message = "La fecha es requerida")
    private LocalDateTime fechaConsulta;
    
    @NotBlank(message = "El motivo es requerido")
    @Size(min = 10, message = "El motivo debe tener al menos 10 caracteres")
    private String motivo;
}
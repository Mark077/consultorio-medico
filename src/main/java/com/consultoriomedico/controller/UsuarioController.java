// UsuarioController.java
package com.consultoriomedico.controller;

import com.consultoriomedico.model.Usuario;
import com.consultoriomedico.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;
    
	@PostMapping("/registro")
	public ResponseEntity<?> registrarUsuario(@Valid @RequestBody Usuario usuario, BindingResult result) {
		
		if (result.hasErrors()) {
			Map<String, String> errores = new HashMap<>();
			result.getFieldErrors().forEach(err -> {
				errores.put(err.getField(), err.getDefaultMessage());
			});
			return ResponseEntity.badRequest().body(errores);
		}
		
		if (usuarioService.obtenerUsuarioPorEmail(usuario.getEmail()) != null) {
			return ResponseEntity.badRequest().body(Collections.singletonMap("email", "El email ya está registrado"));
		}
		
		Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
		return ResponseEntity.ok(nuevoUsuario);
	}
	
	@PostMapping
	
	public ResponseEntity<?> crearConsulta(@Valid @RequestBody ConsultaRequest request, BindingResult result) {
		if (result.hasErrors()) {
			Map<String, String> errores = new HashMap<>();
			result.getFieldErrors().forEach(err -> {
				errores.put(err.getField(), err.getDefaultMessage());
			});
			return ResponseEntity.badRequest().body(errores);
		}
		
		try {
			Consulta consulta = consultaService.crearConsulta(request);
			return ResponseEntity.ok(consulta);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Collections.singletonMap("error", "Error al crear la consulta"));
		}
	}
}
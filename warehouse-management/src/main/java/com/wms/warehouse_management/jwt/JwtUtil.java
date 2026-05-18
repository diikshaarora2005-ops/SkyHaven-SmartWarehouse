package com.wms.warehouse_management.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

@Component
public class JwtUtil {

	private final String SECRET_KEY =
	        "mysecretkeymysecretkeymysecretkey12";

	public String generateToken(String username, String role) {

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(
                	    Keys.hmacShaKeyFor(SECRET_KEY.getBytes()),
                	    SignatureAlgorithm.HS256
                	)
                .compact();
    }

    public Claims extractClaims(String token) {

    	return Jwts.parserBuilder()
    	        .setSigningKey(
    	                Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
    	        .build()
    	        .parseClaimsJws(token)
    	        .getBody();
    }

    public String extractUsername(String token) {

        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {

        return extractClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token, String username) {

        return extractUsername(token).equals(username);
    }
}

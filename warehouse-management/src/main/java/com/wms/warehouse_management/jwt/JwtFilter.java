package com.wms.warehouse_management.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.ExpiredJwtException;



import java.io.IOException;
import java.util.ArrayList;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request)
	        throws ServletException {

	    String path = request.getServletPath();

	    return path.startsWith("/auth")
	            || path.startsWith("/swagger-ui")
	            || path.startsWith("/v3/api-docs");
	}

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

    	String path = request.getServletPath();

    	if (path.contains("swagger")
    	        || path.contains("api-docs")) {

    	    filterChain.doFilter(request, response);
    	    return;
    	}
    	String authHeader = request.getHeader("Authorization");

        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            try {

                token = authHeader.substring(7);

                username = jwtUtil.extractUsername(token);

            } catch (ExpiredJwtException e) {

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                response.getWriter()
                        .write("JWT token expired");

                return;

            } catch (Exception e) {

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                response.getWriter()
                        .write("Invalid token");

                return;
            }
        }

        if (username != null
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            new ArrayList<>());

            authenticationToken.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request));

            SecurityContextHolder.getContext()
                    .setAuthentication(authenticationToken);
        }

        filterChain.doFilter(request, response);
    }
}
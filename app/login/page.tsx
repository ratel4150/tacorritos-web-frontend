"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "../../hooks/useAuth";
import { Container, Box, TextField, Button, Typography } from "@mui/material";

// Tipado según tu backend
interface LoginResponse {
  login: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  };
}

interface LoginVars {
  input: {
    email: string;
    password: string;
  };
}

// Mutación GraphQL con input object
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      expiresIn
      refreshExpiresIn
    }
  }
`;

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const [loginMutation, { loading, error }] = useMutation<LoginResponse, LoginVars>(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await loginMutation({ variables: { input: form } });
      if (data?.login.accessToken) {
        // Guardamos solo el accessToken, podrías guardar refreshToken si quieres
        login(data.login.accessToken);
        window.location.href = "/menu";
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10}>
        <Typography variant="h4" gutterBottom>Iniciar Sesión</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Correo"
            margin="normal"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Contraseña"
            margin="normal"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          {error && <Typography color="error">Credenciales inválidas</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

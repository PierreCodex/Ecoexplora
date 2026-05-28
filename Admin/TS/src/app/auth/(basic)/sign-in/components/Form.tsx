'use client'
import { useAuth } from '@/hooks/useAuth'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Alert, Button, Form, FormCheck, FormControl, FormLabel } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface LoginFormValues {
  email: string
  password: string
}

const schema: yup.ObjectSchema<LoginFormValues> = yup.object({
  email: yup.string().email('Email no válido').required('Email requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
})

const LoginForm = () => {
  const router = useRouter()
  const { login, loading, error, isAuthenticated, sessionReady } = useAuth()

  useEffect(() => {
    if (sessionReady && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [sessionReady, isAuthenticated, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    await login(values.email, values.password)
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      <div className="mb-3">
        <FormLabel>
          Email <span className="text-danger">*</span>
        </FormLabel>
        <FormControl
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          isInvalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>}
      </div>
      <div className="mb-3">
        <FormLabel>
          Contraseña <span className="text-danger">*</span>
        </FormLabel>
        <FormControl
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          isInvalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && <Form.Control.Feedback type="invalid">{errors.password.message}</Form.Control.Feedback>}
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <FormCheck>
          <Form.Check.Input className="form-check-input-light fs-14" type="checkbox" id="rememberMe" />
          <Form.Check.Label htmlFor="rememberMe">Mantener sesión iniciada</Form.Check.Label>
        </FormCheck>
        <Link href="/auth/reset-pass" className="text-decoration-underline link-offset-3 text-muted">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <div className="d-grid">
        <Button variant="primary" type="submit" className="fw-semibold py-2" disabled={loading || isSubmitting}>
          {loading || isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
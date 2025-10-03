import { useAuth } from './AuthContext';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const { signUpEmail } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>();

  const onSubmit = handleSubmit(async (values) => {
    await signUpEmail(values.email, values.password);
    navigate('/');
  });

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" className="mt-1 w-full rounded-md border p-2" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="mt-1 w-full rounded-md border p-2" {...register('password', { required: 'Password is required', minLength: { value: 6, message: '6+ chars' } })} />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-brand text-white rounded-md py-2">Create account</button>
      </form>
      <p className="mt-4 text-sm">Have an account? <Link to="/login" className="text-brand">Sign in</Link></p>
    </div>
  );
}

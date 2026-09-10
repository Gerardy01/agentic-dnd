import { useState } from 'react';
import { Form, type FormProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { accountApi } from '@/api';
import useStaticModal from '@/hooks/global/useStaticModal';

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function useRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { serverErrorModal } = useStaticModal();

  const [registerForm] = Form.useForm<RegisterFormValues>();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const submitRegisterData: FormProps<RegisterFormValues>['onFinish'] = async (values) => {
    if (values.password !== values.confirmPassword) {
      setErrorMsg(t('auth.passwordMismatch'));
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const [err, data] = await accountApi.createAccount({
        email: values.email.trim(),
        password: values.password,
      });

      if (err) {
        if (err.status === 409) {
          setErrorMsg('An adventurer with this email already exists.');
          return;
        }
        if (err.status === 422) {
          setErrorMsg(err.response?.data?.message || 'Invalid registration details.');
          return;
        }
        serverErrorModal();
        return;
      }

      if (data?.verificationToken) {
        navigate(
          `/verification?token=${encodeURIComponent(data.verificationToken)}&email=${encodeURIComponent(values.email)}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    registerForm,
    loading,
    errorMsg,
    submitRegisterData,
  };
}

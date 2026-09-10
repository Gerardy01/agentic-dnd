import { useState } from 'react';
import { Form, type FormProps } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/api';
import useTokenStore from '@/stores/useTokenStore';
import useNotification from '@/hooks/global/useNotification';
import useStaticModal from '@/hooks/global/useStaticModal';

interface OtpFormValues {
  code: string;
}

export default function useVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { successNotification } = useNotification();
  const { serverErrorModal } = useStaticModal();

  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [form] = Form.useForm<OtpFormValues>();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const setAccessToken = useTokenStore((state) => state.setAccessToken);

  const submitVerification: FormProps<OtpFormValues>['onFinish'] = async (values) => {
    const cleanedCode = Number(values.code.trim());
    if (isNaN(cleanedCode)) {
      setErrorMsg(t('auth.invalidOtp'));
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const [err, data] = await authApi.verifyOtp({
        code: cleanedCode,
        verificationToken: tokenFromUrl,
      });

      if (err) {
        if (err.status === 400 || err.status === 401) {
          setErrorMsg(t('auth.invalidOtp'));
          return;
        }
        serverErrorModal();
        return;
      }

      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        successNotification('Seal Broken', 'Welcome to the Agentic D&D Realm.');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!emailFromUrl) {
      setErrorMsg('No email associated with this verification session. Please log in again.');
      return;
    }

    setResending(true);
    setErrorMsg('');

    try {
      const [err] = await authApi.getOtp({ email: emailFromUrl });
      if (err) {
        serverErrorModal();
        return;
      }

      successNotification(t('auth.otpResent'));
    } finally {
      setResending(false);
    }
  };

  return {
    form,
    loading,
    resending,
    errorMsg,
    email: emailFromUrl,
    hasToken: Boolean(tokenFromUrl),
    submitVerification,
    handleResendOtp,
  };
}

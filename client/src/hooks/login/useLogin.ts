import { useEffect, useState } from 'react';
import { Form, type FormProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import useStaticModal from '@/hooks/global/useStaticModal';
import useToken from '@/hooks/global/useToken';
import { authApi } from '@/api';

interface LoginFormValues {
  identifier: string;
  password: string;
}

export default function useLogin() {
  const navigate = useNavigate();
  const { serverErrorModal } = useStaticModal();
  const { isLoggedIn } = useToken();

  const [loginForm] = Form.useForm<LoginFormValues>();
  const [loading, setLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const checkLoggedIn = async () => {
    const loggedIn = await isLoggedIn();
    if (loggedIn) {
      navigate('/');
    }
    setPageLoad(false);
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const submitLoginData: FormProps<LoginFormValues>['onFinish'] = async (values) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const [err, data] = await authApi.login({
        identifier: values.identifier.trim(),
        password: values.password,
      });

      if (err) {
        if (err.status === 401 || err.status === 404) {
          setErrorMsg('Invalid adventurer name/email or secret passphrase.');
          return;
        }
        serverErrorModal();
        return;
      }

      if (data?.verificationToken) {
        navigate(
          `/verification?token=${encodeURIComponent(data.verificationToken)}&email=${encodeURIComponent(values.identifier)}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loginForm,
    loading,
    errorMsg,
    pageLoad,
    submitLoginData,
  };
}

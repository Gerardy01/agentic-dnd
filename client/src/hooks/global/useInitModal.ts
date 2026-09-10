import { useState, useMemo } from 'react';
import { Form, type FormProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { accountApi, authApi } from '@/api';
import useAccountStore from '@/stores/useAccountStore';
import useTokenStore from '@/stores/useTokenStore';
import useStaticModal from '@/hooks/global/useStaticModal';

interface InitModalFormValues {
  username: string;
}

export default function useInitModal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { serverErrorModal } = useStaticModal();

  const { accountId, username, setUsername, removeAccount } = useAccountStore();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const removeAccessToken = useTokenStore((state) => state.removeAccessToken);

  const [form] = Form.useForm<InitModalFormValues>();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // The modal overrides the screen if the user is authenticated but has an empty username
  const isOpen = useMemo(() => {
    return Boolean(accountId && (!username || username.trim() === ''));
  }, [accountId, username]);

  const submitUsername: FormProps<InitModalFormValues>['onFinish'] = async (values) => {
    const trimmed = values.username.trim();
    if (!trimmed) {
      setErrorMsg(t('initModal.nameRequired'));
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const [err, res] = await accountApi.updateUsername({
        username: trimmed,
      });

      if (err) {
        if (err.status === 409) {
          setErrorMsg(t('initModal.usernameTaken'));
          return;
        }

        if (err.status === 422) {
          setErrorMsg(err.response?.data?.message || t('initModal.nameMin'));
          return;
        }

        serverErrorModal();
        return;
      }

      if (res) {
        setUsername(res.account.username);
        setAccessToken(res.accessToken);
        form.resetFields();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    removeAccessToken();
    removeAccount();
    form.resetFields();
    setErrorMsg('');
    navigate('/login');
  };

  return {
    form,
    isOpen,
    loading,
    errorMsg,
    submitUsername,
    handleLogout,
  };
}

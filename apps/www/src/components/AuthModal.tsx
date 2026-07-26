import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { login, registerWithCode, sendRegisterCode, type AuthUser } from "../lib/auth";

type AuthMode = "login" | "register";

type AuthModalProps = {
  opened: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onAuthed: (user: AuthUser) => void;
};

const validateEmail = (email: string) => /.+@.+\..+/.test(email);

export function AuthModal({ opened, initialMode = "login", onClose, onAuthed }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSendCode = useMemo(() => validateEmail(email), [email]);
  const canRegister = useMemo(
    () => validateEmail(email) && password.length >= 8 && /^\d{6}$/.test(code),
    [code, email, password],
  );
  const canLogin = useMemo(() => validateEmail(email) && password.length >= 8, [email, password]);

  useEffect(() => {
    if (!opened) return;
    setMode(initialMode);
    setEmail("");
    setPassword("");
    setCode("");
    setCodeSent(false);
    setError(null);
    setMessage(null);
  }, [initialMode, opened]);

  const resetFeedback = () => {
    setError(null);
    setMessage(null);
  };

  const handleSendCode = async () => {
    if (!canSendCode) return;
    setLoading(true);
    resetFeedback();
    try {
      await sendRegisterCode(email.trim());
      setCodeSent(true);
      setMessage("验证码已发送，请查看绑定邮箱。开发环境下验证码会打印在 backend 日志里。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送验证码失败");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!canRegister) return;
    setLoading(true);
    resetFeedback();
    try {
      const user = await registerWithCode(email.trim(), code.trim(), password);
      onAuthed(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!canLogin) return;
    setLoading(true);
    resetFeedback();
    try {
      const user = await login(email.trim(), password);
      onAuthed(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      radius="md"
      title={mode === "login" ? "登录 JsonViz" : "注册 JsonViz"}
      size="md"
    >
      <Tabs value={mode} onChange={(value) => setMode((value as AuthMode) || "login")}>
        <Tabs.List grow>
          <Tabs.Tab value="login">登录</Tabs.Tab>
          <Tabs.Tab value="register">注册</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login" pt="md">
          <Stack>
            {error && <Alert color="red">{error}</Alert>}
            <TextInput
              label="邮箱"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
            <PasswordInput
              label="密码"
              placeholder="至少 8 位"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
            <Button onClick={handleLogin} loading={loading} disabled={!canLogin}>
              登录
            </Button>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="register" pt="md">
          <Stack>
            {message && <Alert color="teal">{message}</Alert>}
            {error && <Alert color="red">{error}</Alert>}
            <TextInput
              label="绑定邮箱"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
            <Group align="end" grow>
              <TextInput
                label="6 位验证码"
                placeholder="123456"
                value={code}
                maxLength={6}
                onChange={(event) => {
                  const next = event.currentTarget.value.replace(/\D/g, "").slice(0, 6);
                  setCode(next);
                }}
              />
              <Button variant="light" onClick={handleSendCode} loading={loading} disabled={!canSendCode}>
                发送验证码
              </Button>
            </Group>
            <PasswordInput
              label="密码"
              placeholder="至少 8 位"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
            <Text size="sm" c="dimmed">
              注册必须完成邮箱验证。验证码 10 分钟内有效，60 秒内不可重复发送。
            </Text>
            <Button onClick={handleRegister} loading={loading} disabled={!codeSent || !canRegister}>
              完成注册
            </Button>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
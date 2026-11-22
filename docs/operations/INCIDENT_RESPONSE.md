# Security Incident Response Playbook

1. Identify compromised credentials or anomalous traffic.
2. Rotate `BETTER_AUTH_SECRET` and `JWT_SECRET`.
3. Flush active sessions via revocation registry.
4. Review MongoDB Atlas audit logs for suspicious data modifications.

export const passwordResetTemplate =
  ({
    resetUrl,
    expiresInMinutes,
  }) => {
    return `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 8px;
        "
      >
        <h2
          style="
            color: #2E7D32;
          "
        >
          Password Reset Request
        </h2>

        <p>
          You requested to reset your password.
        </p>

        <p>
          Click the button below:
        </p>

        <div
          style="
            margin: 24px 0;
          "
        >
          <a
            href="${resetUrl}"

            style="
              background: #2E7D32;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This link expires in
          ${expiresInMinutes}
          minutes.
        </p>

        <p>
          If you did not request this,
          please ignore this email.
        </p>
      </div>
    `;
  };
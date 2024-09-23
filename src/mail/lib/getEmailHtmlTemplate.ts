export const getEmailHtmlTemplate = (receiver: string) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">
            <h2 style="color: #4CAF50;">VReal Soft Test Project</h2>
            <p style="font-size: 16px;"> Dear ${receiver}! You have been granted file access permissions!</p>
            <p style="font-size: 14px;">Check out the details below:</p>
            <a href="https://localhost:3000/folder" style="
                display: inline-block;
                padding: 12px 20px;
                background-color: #4CAF50;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                margin-top: 20px;
              ">View File</a>
            <p style="margin-top: 20px;">This might be interesting for you!</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
            <p style="font-size: 12px; color: #777;">&copy; 2024 VReal Soft, All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
};

const template_add_booking = (confirmationUrl) => ` <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Roboto', 'Arial', sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                        background-color: #f8f9fa;
                    }
                    .container {
                        max-width: 650px;
                        margin: 30px auto;
                        padding: 30px;
                        background-color: #ffffff;
                        border-radius: 15px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    }
                    .logo {
                        text-align: center;
                        margin-bottom: 25px;
                    }
                    .logo img {
                        width: 150px;
                        height: auto;
                    }
                    h1 {
                        color: #1a237e;
                        text-align: center;
                        margin-bottom: 30px;
                        font-size: 32px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    p {
                        color: #37474f;
                        margin: 20px 0;
                        text-align: center;
                        font-size: 16px;
                        line-height: 1.8;
                    }
                    .highlight-text {
                        background-color: #e3f2fd;
                        padding: 15px;
                        border-radius: 8px;
                        margin: 25px 0;
                        text-align: center;
                        font-weight: 500;
                    }
                    .btn-container {
                        text-align: center;
                        margin: 35px 0;
                    }
                    .confirm-btn {
                        display: inline-block;
                        padding: 15px 40px;
                        background-color: #6ebfff;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                        font-size: 18px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 6px rgba(33, 150, 243, 0.3);
                    }

                    .confirm-btn a,
                    .confirm-btn a:visited,
                    .confirm-btn a:hover,
                    .confirm-btn a:active {
                        color: #ffffff !important;
                        text-decoration: none;
                    }

                    .confirm-btn:hover {
                        background-color: #6ebfff;
                        transform: translateY(-2px);
                        box-shadow: 0 6px 8px rgba(33, 150, 243, 0.4);
                    }

                    .expire-text {
                        color: #78909c;
                        font-size: 14px;
                        font-style: italic;
                        margin-top: 30px;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #e0e0e0;
                        text-align: center;
                        font-size: 14px;
                        color: #90a4ae;
                    }
                    .social-links {
                        margin: 20px 0;
                    }
                    .social-links a {
                        margin: 0 10px;
                        color: #1976d2;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">
                        <img src="https://www.zarla.com/images/zarla-cherry-villa-1x1-2400x2400-20230329-364cypymfghh7wcq7hx3.png?crop=1:1,smart&width=250&dpr=2" alt="Logo Công ty">
                    </div>
                    <h1>Xác Nhận Đặt Phòng Của Bạn</h1>
                    <p>Cảm ơn bạn đã chọn dịch vụ homestay cao cấp của chúng tôi! Chúng tôi rất hân hạnh được đón tiếp bạn.</p>
                    <div class="highlight-text">
                        Việc đặt phòng của bạn chỉ còn một bước nữa là hoàn tất. Vui lòng xác nhận đặt phòng để đảm bảo mọi thứ đã sẵn sàng cho kỳ nghỉ của bạn.
                    </div>
                    <p>Để hoàn tất quá trình đặt phòng và đảm bảo giữ chỗ, vui lòng nhấn vào nút xác nhận bên dưới:</p>
                    <div class="btn-container">
                        <a href="${confirmationUrl}" class="confirm-btn">Xác Nhận Đặt Phòng</a>
                    </div>
                    <p class="expire-text">Lưu ý: Liên kết xác nhận này sẽ hết hạn sau 24 giờ vì lý do bảo mật</p>
                    <div class="footer">
                        <p>Cần hỗ trợ? Liên hệ với đội ngũ hỗ trợ của chúng tôi</p>
                        <p>Email: support@homestay.com | Điện thoại: +1 234 567 890</p>
                        <div class="social-links">
                            <a href="#">Facebook</a>
                            <a href="#">Instagram</a>
                            <a href="#">Twitter</a>
                        </div>
                        <p>© 2025 Premium Homestay. Mọi quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>`;

module.exports = template_add_booking;

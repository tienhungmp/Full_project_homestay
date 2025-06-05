import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, XCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useConfirmEmailToAddBooking } from '@/hooks/useOrder';

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'default';

interface MessageConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

const StatusMessage = () => {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState<MessageType>('default');
  const token = searchParams.get('token');
  const customTitle = searchParams.get('title');
  const customMessage = searchParams.get('message');
  const redirectTo = searchParams.get('redirect') || '/';
  const {confirmEmailToAddBooking} =  useConfirmEmailToAddBooking();

  const getMessageConfig = (type: MessageType): MessageConfig => {
    const configs: Record<MessageType, MessageConfig> = {
      success: {
        icon: <CheckCircle className="h-16 w-16" />,
        title: customTitle || 'Thành công!',
        description: customMessage || 'Hóa đơn đã được thêm vô tài khoản thành công',
        buttonText: 'Tiếp tục',
        buttonLink: redirectTo,
        bgColor: 'bg-green-50',
        iconColor: 'text-green-500',
        borderColor: 'border-green-200'
      },
      error: {
        icon: <XCircle className="h-16 w-16" />,
        title: customTitle || 'Có lỗi xảy ra',
        description: customMessage || 'Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.',
        buttonText: 'Thử lại',
        buttonLink: redirectTo,
        bgColor: 'bg-red-50',
        iconColor: 'text-red-500',
        borderColor: 'border-red-200'
      },
      info: {
        icon: <Info className="h-16 w-16" />,
        title: customTitle || 'Thông báo',
        description: customMessage || 'Vui lòng kiểm tra email để hoàn tất quá trình xác thực.',
        buttonText: 'Đã hiểu',
        buttonLink: redirectTo,
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-500',
        borderColor: 'border-blue-200'
      },
      warning: {
        icon: <AlertCircle className="h-16 w-16" />,
        title: customTitle || 'Cảnh báo',
        description: customMessage || 'Có một số vấn đề cần được chú ý.',
        buttonText: 'Tiếp tục',
        buttonLink: redirectTo,
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-500',
        borderColor: 'border-yellow-200'
      },
      default: {
        icon: <Info className="h-16 w-16" />,
        title: customTitle || 'Trạng thái chưa xác định',
        description: customMessage || 'Hệ thống đang xử lý yêu cầu của bạn.',
        buttonText: 'Quay lại',
        buttonLink: redirectTo,
        bgColor: 'bg-gray-50',
        iconColor: 'text-gray-500',
        borderColor: 'border-gray-200'
      }
    };

    return configs[type];
  };

  const config = getMessageConfig(type);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        const responseData = await confirmEmailToAddBooking(token);

        if (responseData.success) {
          setType('success');
        }
      };

      fetchData();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className={`${config.borderColor} border-2`}>
            <CardContent className={`${config.bgColor} p-8 text-center`}>
              <div className={`${config.iconColor} flex justify-center mb-6`}>
                {config.icon}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {config.title}
              </h1>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {config.description}
              </p>
              
              <div className="space-y-4">
                <Button 
                  asChild 
                  className="w-full bg-brand-blue hover:bg-brand-blue/90"
                >
                  <Link to={config.buttonLink}>
                    {config.buttonText}
                  </Link>
                </Button>
                
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/" className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      Trang chủ
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/contact" className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Liên hệ hỗ trợ
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Nếu bạn cần hỗ trợ, vui lòng liên hệ{' '}
              <Link 
                to="/contact" 
                className="text-brand-blue hover:underline font-medium"
              >
                đội ngũ hỗ trợ
              </Link>
              {' '}của chúng tôi.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StatusMessage;

import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  subject: z.string().min(5, {
    message: "Tiêu đề phải có ít nhất 5 ký tự",
  }),
  message: z.string().min(10, {
    message: "Nội dung phải có ít nhất 10 ký tự",
  }),
});

const Contact = () => {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    }
  });

  const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
    console.log(data);
    toast.success("Cảm ơn bạn đã liên hệ với chúng tôi!");
    form.reset();
  };

  return (
    <>
      <Helmet>
        <title>Liên hệ - BlissStay</title>
      </Helmet>

      <Navbar />
      
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Liên hệ với chúng tôi</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Contact Form */}
          <div className="md:w-2/3">
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập họ và tên" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tiêu đề" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nội dung</FormLabel>
                          <FormControl>
                            <textarea 
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                              rows={6}
                              placeholder="Nội dung tin nhắn..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
                      Gửi tin nhắn
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Info */}
          <div className="md:w-1/3">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-brand-blue mt-0.5" />
                      <div>
                        <h3 className="font-medium">Địa chỉ</h3>
                        <p className="text-muted-foreground">123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-brand-blue mt-0.5" />
                      <div>
                        <h3 className="font-medium">Điện thoại</h3>
                        <p className="text-muted-foreground">1900 1234 (8AM - 10PM)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-brand-blue mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-muted-foreground">support@blissstay.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 mr-3 text-brand-blue mt-0.5" />
                      <div>
                        <h3 className="font-medium">Hỗ trợ trực tuyến</h3>
                        <p className="text-muted-foreground">Chat trực tuyến 24/7</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Giờ làm việc</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thứ Hai - Thứ Sáu:</span>
                      <span>8:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thứ Bảy:</span>
                      <span>8:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chủ Nhật:</span>
                      <span>9:00 - 17:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Vị trí của chúng tôi</h2>
          <div className="w-full h-96 border rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3946996775513!2d106.70129147504418!3d10.779693989318768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5d0f8d4!2sTimes%20Square%20Building!5e0!3m2!1sen!2s!4v1690017024455!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Contact;

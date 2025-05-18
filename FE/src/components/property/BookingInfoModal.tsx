import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Form schema validation
const formSchema = z.object({
  username: z.string().min(2, { message: 'Vui lòng nhập tên của bạn' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  address: z.string().min(5, { message: 'Vui lòng nhập địa chỉ hợp lệ' }),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, { message: 'Số điện thoại phải có 10 chữ số' }),
});

export type BookingInfoFormValues = z.infer<typeof formSchema>;

interface BookingInfoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookingInfoFormValues) => void;
}

const BookingInfoModal = ({ open, onClose, onSubmit }: BookingInfoModalProps) => {
  const form = useForm<BookingInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      address: '',
      phoneNumber: '',
    },
  });

  const handleSubmit = (data: BookingInfoFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thông tin đặt phòng</DialogTitle>
          <DialogDescription>
            Vui lòng cung cấp thông tin để tiếp tục đặt phòng
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
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
                    <Input placeholder="example@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Đường ABC, Quận XYZ, TP. HCM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0912345678" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose} className="mr-2">
                Hủy
              </Button>
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
                Tiếp tục
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingInfoModal;
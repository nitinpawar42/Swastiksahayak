"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';
import { createRazorpayOrder, verifyPaymentAndCreateOrder } from '@/lib/actions/payment';
import { useEffect, useRef, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

declare const Razorpay: any;

interface CreateOrderButtonProps {
    product: Product;
}

const initialState = {
  message: null,
  errors: null,
  success: false,
};

export function CreateOrderButton({ product }: CreateOrderButtonProps) {
  const { toast } = useToast();
  const [createOrderState, createOrderAction] = useFormState(createRazorpayOrder, initialState);
  const [verifyPaymentState, verifyPaymentAction] = useFormState(verifyPaymentAndCreateOrder, initialState);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  
  const formRef = useRef<HTMLFormElement>(null);

  const resellerId = "temp-reseller-id"; // In a real app, get this from auth state

  useEffect(() => {
    if (createOrderState.success && createOrderState.order) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: createOrderState.order.amount,
        currency: createOrderState.order.currency,
        name: 'Swastik Sahayak',
        description: `Order for ${product.name}`,
        order_id: createOrderState.order.id,
        handler: function (response: any) {
            const paymentForm = new FormData();
            paymentForm.append('razorpay_payment_id', response.razorpay_payment_id);
            paymentForm.append('razorpay_order_id', response.razorpay_order_id);
            paymentForm.append('razorpay_signature', response.razorpay_signature);
            paymentForm.append('productId', product.id);
            paymentForm.append('resellerId', resellerId);
            paymentForm.append('customerDetails', JSON.stringify(customerDetails));
            verifyPaymentAction(paymentForm);
        },
        prefill: {
          name: customerDetails.name,
          contact: customerDetails.phone,
        },
        theme: {
          color: '#F97316',
        },
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({
          title: 'Payment Failed',
          description: response.error.description,
          variant: 'destructive',
        });
      });
      rzp.open();
      setDialogOpen(false);
    } else if (createOrderState.message && !createOrderState.success) {
      toast({
        title: 'Error',
        description: createOrderState.message,
        variant: 'destructive',
      });
    }
  }, [createOrderState, toast, product.name, verifyPaymentAction, resellerId, customerDetails]);

  useEffect(() => {
    if (verifyPaymentState.success) {
        toast({
            title: 'Success!',
            description: verifyPaymentState.message,
        });
    } else if (verifyPaymentState.message && !verifyPaymentState.success) {
        toast({
            title: 'Error',
            description: verifyPaymentState.message,
            variant: 'destructive',
        });
    }
  }, [verifyPaymentState, toast]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
            <Button size="lg" className="w-full text-lg font-bold">
                <CreditCard className="mr-2 h-5 w-5" />
                Create Order & Pay
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Enter Customer Details</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={createOrderAction} className="space-y-4">
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="amount" value={product.sellingPrice} />
                <input type="hidden" name="resellerId" value={resellerId} />
                
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={customerDetails.name} onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})} />
                </div>
                 <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={customerDetails.phone} onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} />
                </div>
                 <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={customerDetails.address} onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={customerDetails.city} onChange={(e) => setCustomerDetails({...customerDetails, city: e.target.value})} />
                    </div>
                    <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={customerDetails.state} onChange={(e) => setCustomerDetails({...customerDetails, state: e.target.value})} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" value={customerDetails.pincode} onChange={(e) => setCustomerDetails({...customerDetails, pincode: e.target.value})} />
                </div>

                <SubmitButton />
            </form>
        </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Processing...' : 'Proceed to Payment'}
        </Button>
    )
}

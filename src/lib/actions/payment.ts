
'use server';

import { z } from 'zod';
import Razorpay from 'razorpay';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createShipment } from '../delhivery';
import type { Order, Product, User } from '../types';
import { getProductById } from '../data';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const OrderSchema = z.object({
  productId: z.string(),
  amount: z.coerce.number().positive(),
  resellerId: z.string(), // Assuming the reseller is logged in
});

export async function createRazorpayOrder(
  prevState: any,
  formData: FormData
) {
  const validatedFields = OrderSchema.safeParse({
    productId: formData.get('productId'),
    amount: Number(formData.get('amount')),
    resellerId: formData.get('resellerId'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { amount, productId, resellerId } = validatedFields.data;

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    const product = await getProductById(productId);

    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
    
    // Create a preliminary order document in Firestore
    const orderRef = doc(db, 'orders', razorpayOrder.id);
    await setDoc(orderRef, {
      id: razorpayOrder.id,
      resellerId,
      items: [{ 
        productId: product.id, 
        sellingPrice: product.sellingPrice, 
        commission: product.commission, 
        quantity: 1, 
        name: product.name 
      }],
      status: 'pending_payment',
      totalAmount: amount,
      createdAt: new Date().getTime(),
    });

    return { success: true, order: razorpayOrder };
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return { message: 'Failed to create order.' };
  }
}

const PaymentVerificationSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
    productId: z.string(),
    resellerId: z.string(),
    customerDetails: z.object({
        name: z.string(),
        phone: z.string(),
        address: z.string(),
        city: z.string(),
        pincode: z.string(),
        state: z.string(),
    })
});

export async function verifyPaymentAndCreateOrder(prevState: any, formData: FormData) {
    const rawData = {
        ...Object.fromEntries(formData.entries()),
        customerDetails: JSON.parse(formData.get('customerDetails') as string)
    }
    const validatedFields = PaymentVerificationSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { success: false, message: "Invalid payment data." }
    }
    
    const { razorpay_order_id, razorpay_payment_id, resellerId, productId, customerDetails } = validatedFields.data;

    try {
        // First, update the order in Firestore with payment details and full data
        const orderRef = doc(db, 'orders', razorpay_order_id);
        const productSnap = await getDoc(doc(db, 'products', productId));
        const resellerSnap = await getDoc(doc(db, 'users', resellerId));

        if (!productSnap.exists() || !resellerSnap.exists()) {
             throw new Error("Product or reseller not found");
        }
        const product = productSnap.data() as Product;
        const reseller = resellerSnap.data() as User;

        const orderData: Partial<Order> = {
            paymentDetails: {
                method: 'Prepaid',
                status: 'completed',
                transactionId: razorpay_payment_id,
            },
            status: 'placed',
            customerDetails: customerDetails,
            items: [{
                productId: product.id,
                name: product.name,
                quantity: 1,
                sellingPrice: product.sellingPrice,
                commission: product.commission,
            }],
            totalCommission: product.commission,
            orderDate: new Date().getTime(),
        };

        await setDoc(orderRef, orderData, { merge: true });

        // Now, create the shipment with Delhivery
        const shipmentData = {
            name: customerDetails.name,
            add: customerDetails.address,
            pin: customerDetails.pincode,
            city: customerDetails.city,
            state: customerDetails.state,
            country: 'India',
            phone: customerDetails.phone,
            order: razorpay_order_id,
            payment_mode: 'Prepaid',
            products_desc: product.name,
            total_amount: product.sellingPrice,
            quantity: "1",
        };
        
        // This should be an actual pickup location name from your Delhivery account
        const pickupLocation = 'SwastikWarehouse'; 

        const delhiveryResponse = await createShipment({
            shipments: [shipmentData],
            pickup_location: { name: pickupLocation }
        });


        if (!delhiveryResponse.success || !delhiveryResponse.packages || delhiveryResponse.packages.length === 0) {
           console.error("Delhivery shipment creation failed:", delhiveryResponse.error || "No packages returned");
           // You could potentially update the order status to 'payment_complete_shipping_failed'
           // For now, we'll throw an error to be caught below.
           throw new Error(`Failed to create Delhivery shipment. Reason: ${delhiveryResponse.error || 'Unknown'}`);
        }

        // Update order with shipping details
        await setDoc(orderRef, {
            status: 'processing',
            shippingDetails: {
                provider: 'Delhivery',
                waybill: delhiveryResponse.packages[0].waybill,
                trackingUrl: `https://track.delhivery.com/p/${delhiveryResponse.packages[0].waybill}`
            }
        }, { merge: true });


        return { success: true, message: "Order placed and shipment created successfully!" };

    } catch (error) {
        console.error("Order processing failed:", error);
        return { success: false, message: "Failed to process order after payment." }
    }
}

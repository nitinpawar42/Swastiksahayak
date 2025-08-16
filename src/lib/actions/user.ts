'use server';

import { z } from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { checkPincodeServiceability } from '../delhivery';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format.'),
  aadhaar: z.string().regex(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, 'Invalid Aadhaar number.'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid Pincode format.'),
  addressProof: z.any()
}).refine(data => data.addressProof.size > 0, {
    message: 'Address proof is required.',
    path: ['addressProof'],
});

type State = {
  message?: string | null;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    pan?: string[];
    aadhaar?: string[];
    pincode?: string[];
    addressProof?: string[];
    _form?: string[];
  } | null;
}

export async function registerReseller(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    pan: formData.get('pan'),
    aadhaar: formData.get('aadhaar'),
    pincode: formData.get('pincode'),
    addressProof: formData.get('addressProof'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors in the form.',
    };
  }

  const { name, email, password, pan, aadhaar, pincode, addressProof } = validatedFields.data;

  try {
    // 1. Check pincode serviceability
    const serviceability = await checkPincodeServiceability(pincode);
    
    if (!serviceability || serviceability.delivery_codes.length === 0) {
      return {
          errors: { pincode: ['Sorry, this pincode is not serviceable.'] },
          message: 'Pincode not serviceable.'
      }
    }
    
    // 2. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 3. Upload address proof to Firebase Storage
    const storageRef = ref(storage, `address_proofs/${user.uid}/${addressProof.name}`);
    const snapshot = await uploadBytes(storageRef, addressProof);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 4. Create user document in Firestore with 'pending' status
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      pan: pan,
      aadhaar: aadhaar,
      pincode: pincode,
      addressProofUrl: downloadURL,
      status: 'pending',
      role: 'reseller',
    });

    return { message: "Registration successful! Your application is under review." };

  } catch (error: any) {
    console.error("Registration Error: ", error);
    if (error.code === 'auth/email-already-in-use') {
        return {
            errors: { email: ['This email address is already in use.'] },
            message: 'Registration failed.'
        }
    }
    return {
        errors: { _form: ['An unexpected error occurred. Please try again.'] },
        message: 'An unexpected error occurred.'
    };
  }
}

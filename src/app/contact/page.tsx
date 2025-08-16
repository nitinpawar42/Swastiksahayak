import { ContactForm } from '@/components/contact/ContactForm';
import { Map } from '@/components/contact/Map';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <section className="py-12 md:py-20 lg:py-24 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold font-headline">Contact Us</h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground font-body">
              We're here to help. Reach out to us with any questions or inquiries.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold font-headline">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-body">Our Office</h3>
                    <p className="text-muted-foreground font-body">123 Handicraft Lane, Jaipur, Rajasthan, 302001</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-body">Email Us</h3>
                    <p className="text-muted-foreground font-body">support@swastiksahayak.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-body">Call Us</h3>
                    <p className="text-muted-foreground font-body">+91 987 654 3210</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full h-[400px] md:h-[500px]">
        <Map />
      </section>
    </>
  );
}

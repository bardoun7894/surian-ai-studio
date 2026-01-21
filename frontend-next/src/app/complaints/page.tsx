import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComplaintPortal from '@/components/ComplaintPortal';
import ChatBot from '@/components/ChatBot';

export default function ComplaintsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
      <Navbar />

      <main className="flex-grow pt-20 overflow-hidden">
        <ComplaintPortal initialMode="submit" />
      </main>

      <ChatBot />
      <Footer />
    </div>
  );
}

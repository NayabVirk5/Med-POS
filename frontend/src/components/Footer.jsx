import { LifeBuoy, ShieldCheck, FileText } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p style={{ fontWeight: 500, color: 'var(--text-muted)' }}>&copy; {currentYear} Lifecare Medical POS. All rights reserved.</p>
        <div className="footer-links">
          <a href="#"><LifeBuoy size={16} color="var(--primary-color)" /> Support</a>
          <a href="#"><ShieldCheck size={16} color="var(--primary-color)" /> Privacy Policy</a>
          <a href="#"><FileText size={16} color="var(--primary-color)" /> Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

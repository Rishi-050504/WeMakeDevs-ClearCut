import { motion } from 'motion/react';
import { FileText, LogOut } from 'lucide-react';
import { Button } from './ui/all-components';

interface HeaderProps {
  onLogout?: () => void;
  showLogout?: boolean;
}

export function Header({ onLogout, showLogout = false }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border-b border-black/10 px-8 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-black" strokeWidth={2} />
          <h1 
            className="text-2xl font-black text-black"
            style={{ fontFamily: 'Cooper Black, serif' }}
          >
            ClearCut
          </h1>
        </div>

        {/* Logout Button */}
        {showLogout && onLogout && (
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-black/20 text-black hover:bg-black hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        )}
      </div>
    </motion.header>
  );
}